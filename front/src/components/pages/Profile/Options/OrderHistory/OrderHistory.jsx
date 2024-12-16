import { useEffect, useState } from 'react';
import './OrderHistory.css';
import Dropdown from '@UI/Dropdown/Dropdown';
import { axiosInstance, deserializeVehicle, serializeVehicle } from '@/utils';
import { toast } from 'react-toastify';

const OrderHistory = () => {
  const [filters, setFilters] = useState({ orderDay: null, vehicleId: null, serviceId: null });
  const [activeVehicle, setActiveVehicle] = useState(null);
  const [activeService, setActiveService] = useState(null);
  const [orders, setOrders] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFilters = async () => {
    try {
      setLoading(true);
      const services = await axiosInstance.get('services');
      setServices(services.data);

      const vehicles = await axiosInstance.get('users/vehicles');
      setVehicles(vehicles.data);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const orders = await axiosInstance.get('users/orders', {
        params: { ...filters, }
      });
      setOrders(orders.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilters();
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [filters, activeVehicle]);

  const vehicleOptions = vehicles.map(serializeVehicle);
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

  const handleCancelOrder = async (orderId) => {
    await axiosInstance.post(`users/orders/${orderId}/cancel`);
    toast.success('Замовлення успішно скасовано.');

    await fetchOrders();
  };

  return (
    <div className="order-history">
      <h1>Історія послуг</h1>
      <div className="filters">
        <input
          type="date"
          placeholder="За датою"
          min="2020-01-01"
          onChange={(e) => setFilters({ ...filters, orderDay: e.target.value })}
        />
        <Dropdown
          options={serviceOptions}
          active={activeService}
          setActive={handleServiceChange}
          placeholder="За послугою"
        />
        <Dropdown
          options={vehicleOptions}
          active={activeVehicle}
          setActive={handleVehicleChange}
          placeholder="За транспортом"
        />
      </div>

      {loading ? (
        <p>Завантаження...</p>
      ) : (
        <table>
          <thead>
          <tr>
            <th>Дата замовлення</th>
            <th>Транспорт</th>
            <th>Послуга</th>
            <th>Статус</th>
            <th>Ціна</th>
            <th>Дія</th>
          </tr>
          </thead>
          <tbody>
          {orders.map((order, index) => (
            <tr key={index}>
              <td>
                {new Date(order.orderDate).toLocaleDateString('uk', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                })}
              </td>
              <td>{order.vehicle.model} - {order.vehicle.vin}</td>
              <td>{order.services.map((service) => service.name).join(', ')}</td>
              <td className='cell-status'>
                  <span className={`status ${order.status.replace(' ', '-')}`}>
                    {order.status}
                  </span>
              </td>
              <td>{order.totalPrice} грн</td>
              <td>
                {order.status !== 'CANCELED' && (
                  <button onClick={() => handleCancelOrder(order.id)} className="red-button">
                    Відмінити
                  </button>
                )}
              </td>
            </tr>
          ))}
          {orders.length === 0 && (
            <tr>
              <td colSpan="6" className="no-data">Замовлень не знайдено.</td>
            </tr>
          )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderHistory;
