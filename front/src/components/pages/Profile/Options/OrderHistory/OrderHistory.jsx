import { useEffect, useState } from 'react';
import './OrderHistory.css';
import Dropdown from '@UI/Dropdown/Dropdown';
import OrdersTable from '@UI/OrdersTable/OrdersTable';
import { axiosInstance, deserializeUser, deserializeVehicle, serializeUser, serializeVehicle } from '@/utils';
import { toast } from 'react-toastify';

const OrderHistory = ({ role = 'ADMIN' }) => {
  const [filters, setFilters] = useState({
    orderDay: null,
    vehicleId: null,
    serviceId: null,
    userId: null,
    status: null,
  });
  const [activeVehicle, setActiveVehicle] = useState(null);
  const [activeService, setActiveService] = useState(null);
  const [activeUser, setActiveUser] = useState(null);
  const [activeWorker, setActiveWorker] = useState(null);
  const [orders, setOrders] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [services, setServices] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFilters = async () => {
    setLoading(true);
    const services = await axiosInstance.get('services');
    setServices(services.data);

    if (role === 'USER') {
      const vehicles = await axiosInstance.get('users/vehicles');
      setVehicles(vehicles.data);
    } else if (role === 'ADMIN') {
      const workers = await axiosInstance.get('users', {
        params: { role: 'WORKER' },
      });
      setWorkers(workers.data);

      const users = await axiosInstance.get('users');
      setUsers(users.data);
    }

    setLoading(false);
  };

  const fetchOrders = async () => {
    setLoading(true);
    let orders;
    if (role === 'USER') {
      orders = await axiosInstance.get('users/orders', {
        params: { ...filters },
      });
    } else if (role === 'WORKER') {
      orders = await axiosInstance.get('orders/assigned', {
        params: { ...filters },
      });
    } else if (role === 'ADMIN') {
      orders = await axiosInstance.get('orders', {
        params: { ...filters },
      });
    }

    setOrders(orders.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchFilters();
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [filters]);

  const vehicleOptions = vehicles.map(serializeVehicle);
  const userOptions = users.map(serializeUser);
  const workerOptions = workers.map(serializeUser);
  const serviceOptions = services.map((s) => s.name);
  const statusOptions = ['WAITING', 'PROCESSING', 'DONE', 'CANCELED'];

  const handleVehicleChange = (vehicleString) => {
    if (vehicleString) {
      const { vin } = deserializeVehicle(vehicleString);
      const vehicle = vehicles.find((vehicle) => vehicle.vin === vin);
      setFilters(({ ...filters, vehicleId: vehicle.id }));
    } else {
      setFilters({ ...filters, vehicleId: null });
    }

    setActiveVehicle(vehicleString);
  };

  const handleServiceChange = (serviceName) => {
    if (serviceName) {
      const service = services.find((s) => s.name === serviceName);
      setFilters(({ ...filters, serviceId: service.id }));
    } else {
      setFilters({ ...filters, serviceId: null });
    }

    setActiveService(serviceName);
  };

  const handleUserChange = (userName) => {
    if (!userName) {
      setFilters({ ...filters, userId: null });
      setActiveUser(null);
      return;
    }

    const { email } = deserializeUser(userName);
    const user = users.find((user) => user.email === email);

    setActiveUser(userName);
    setFilters(({ ...filters, userId: user.id }));
  };

  const handleWorkerChange = (userName) => {
    if (!userName) {
      setFilters({ ...filters, workerId: null });
      setActiveWorker(null);
      return;
    }

    const { email } = deserializeUser(userName);
    const worker = workers.find((user) => user.email === email);

    setActiveWorker(userName);
    setFilters(({ ...filters, workerId: worker.id }));
  };

  const handleCancelOrder = async (orderId) => {
    await axiosInstance.post(`users/orders/${orderId}/cancel`);
    toast.success('Замовлення успішно скасовано.');

    await fetchOrders();
  };

  return (
    <div className="order-history">
      <h1>Історія послуг</h1>
      <div className="filters">
        <Dropdown
          options={serviceOptions}
          active={activeService}
          setActive={handleServiceChange}
          placeholder="За послугою"
        />
        <Dropdown
          options={userOptions}
          active={activeUser}
          setActive={handleUserChange}
          placeholder="За користувачем"
        />
        <Dropdown
          options={workerOptions}
          active={activeWorker}
          setActive={handleWorkerChange}
          placeholder="За працівником"
        />
        <Dropdown
          options={vehicleOptions}
          active={activeVehicle}
          setActive={handleVehicleChange}
          placeholder="За транспортом"
        />
        <Dropdown
          options={statusOptions}
          active={filters.status}
          setActive={(status) => setFilters({ ...filters, status })}
          placeholder="За статусом"
        />
        <input
          className='date'
          type="date"
          placeholder="За датою"
          min="2020-01-01"
          onChange={(e) => setFilters({ ...filters, orderDay: e.target.value || null })}
        />
      </div>

      {loading ? (
        <p>Завантаження...</p>
      ) : (
        <OrdersTable orders={orders} onCancelOrder={handleCancelOrder} role={role}/>
      )}
    </div>
  );
};

export default OrderHistory;
