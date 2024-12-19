import React, { useEffect, useState, useCallback } from 'react';
import Dropdown from '@UI/Dropdown/Dropdown';
import OrdersTable from '@Components/OrderHistory/OrdersTable/OrdersTable';
import {
  axiosInstance,
  deserializeVehicle,
  getUserId,
  serializeUser,
  serializeVehicle,
  statuses,
} from '@/utils';
import { toast } from 'react-toastify';
import { Loading } from '@UI/Loading';

const OrderHistory = ({ role = 'USER', header = 'Історія послуг' }) => {
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

  const fetchFilters = useCallback(async () => {
    setLoading(true);
    setTimeout(async () => {
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
    }, 0);
  }, [role]);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setTimeout(async () => {
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
    }, 500);
  }, [filters, role]);

  useEffect(() => {
    fetchFilters().then();
  }, [fetchFilters]);

  useEffect(() => {
    fetchOrders().then();
  }, [fetchOrders]);

  const vehicleOptions = vehicles.map(serializeVehicle);
  const userOptions = users.map(serializeUser);
  const workerOptions = workers.map(serializeUser);
  const serviceOptions = services.map((s) => s.name);

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

    const userId = getUserId(userName, users);

    setActiveUser(userName);
    setFilters(({ ...filters, userId }));
  };

  const handleWorkerChange = (userName) => {
    if (!userName) {
      setFilters({ ...filters, workerId: null });
      setActiveWorker(null);
      return;
    }

    const workerId = getUserId(userName, workers);

    setActiveWorker(userName);
    setFilters(({ ...filters, workerId }));
  };

  const handleCancelOrder = async (orderId) => {
    await axiosInstance.post(`users/orders/${orderId}/cancel`);
    toast.success('Замовлення успішно скасовано.');

    await fetchOrders();
  };

  const handleStatusChange = async (orderId, status) => {
    await axiosInstance.patch(`orders/${orderId}/status`, { status });
    toast.success('Статус замовлення успішно змінено.');
    await fetchOrders();
  };

  const handleAssignedChange = async (orderId, userName) => {
    if (!userName) return;
    const workerId = getUserId(userName, workers);

    await axiosInstance.patch(`orders/${orderId}/worker`, { workerId });
    toast.success('Відповідального за замовлення успішно змінено.');
    await fetchOrders();
  };

  if (loading) return <Loading />;

  return (
    <div className="order-history">
      <h1>{header}</h1>
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
          options={Array.from(statuses.values())}
          active={statuses.get(filters.status)}
          setActive={(status) => setFilters({ ...filters, status: statuses.getKey(status) })}
          placeholder="За статусом"
        />
        <input
          className="date"
          type="date"
          placeholder="За датою"
          min="2020-01-01"
          onChange={(e) => setFilters({ ...filters, orderDay: e.target.value || null })}
        />
      </div>
      <OrdersTable
        orders={orders}
        role={role}
        onCancelOrder={handleCancelOrder}
        onStatusChange={handleStatusChange}
        workers={workerOptions}
        onWorkerChange={handleAssignedChange}
      />
    </div>
  );
};

export default OrderHistory;