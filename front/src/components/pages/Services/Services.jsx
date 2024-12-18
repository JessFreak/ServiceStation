import React, { useEffect, useState } from 'react';
import './Services.css';
import {
  axiosInstance,
  deserializeOrderDate,
  getTomorrowString,
  serializeVehicle
} from '@/utils';
import MyModal from '@UI/MyModal';
import FilterableMultiSelect from '@UI/FilterableMultiSelect/FilterableMultiSelect';
import { toast } from 'react-toastify';
import Dropdown from '@UI/Dropdown/Dropdown';
import { useUser } from '@/context/UserContext';

export const Services = () => {
  const [services, setServices] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '08:00',
  });

  const { user } = useUser();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const servicesResponse = await axiosInstance.get('services');
        setServices(servicesResponse.data);

        if (user) {
          const vehiclesResponse = await axiosInstance.get('users/vehicles');
          setVehicles(vehiclesResponse.data);
        }
      } finally {
        setLoading(false);
      }
    };

    setFormData((prev) => ({ ...prev, date: getTomorrowString() }));

    fetchServices();
  }, [user]);

  const openModal = (service) => {
    setSelectedServices([service]);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedServices([]);
    setFormData({ name: '', date: '', time: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVehicleSelect = (vehicle) => {
    if (!vehicle) {
      setSelectedVehicle(vehicle);
      return;
    }

    const value = vehicle.split(' - ')[1];
    const selectedVehicle = vehicles.find((vehicle) => vehicle.vin === value);
    setSelectedVehicle(selectedVehicle);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedServices.length === 0) {
      toast.error('Ви не обрали жодної послуги');
      return;
    }

    const orderDate = deserializeOrderDate(formData);
    const response = await axiosInstance.post('orders', {
      vehicleId: selectedVehicle.id,
      services: selectedServices.map((service) => service.id),
      orderDate,
    });

    if (response.error) return;

    toast.success('Замовлення створено');
    closeModal();
  };

  if (loading) {
    return <div className="services__loading">Завантаження...</div>;
  }

  const vehicleOptions = vehicles.map(serializeVehicle);

  return (
    <div className="services">
      <h1 className="services__title">Обери свою послугу</h1>
      <div className="services__grid">
        {services.map((service, index) => (
          <div className="service-card" key={index}>
            <div className="service-card__content">
              <h2>{service.name}</h2>
              <p>{service.description}</p>
              <p className="service-card__price">від {service.price} грн</p>
              <button
                className="service-button service-card__button"
                onClick={() => openModal(service)}
              >
                Замовити
              </button>
            </div>
            <div className="service-card__image">
              <img src={service.imageUrl || `${process.env.PUBLIC_URL}/wrench.svg`} alt={service.name} />
            </div>
          </div>
        ))}
      </div>

      {selectedServices && (
        <MyModal
          isOpen={isModalOpen}
          onClose={closeModal}
        >
          <h1>Замовлення послуги</h1>
          {(user && !!vehicles.length) && <form className="order-form" onSubmit={handleSubmit}>
            <div>
              <div className="input-container">
                <label htmlFor="name">Транспорт</label>
                <Dropdown
                  options={vehicleOptions}
                  active={selectedVehicle ? serializeVehicle(selectedVehicle) : null}
                  setActive={handleVehicleSelect}
                  placeholder='Обери необхідний транспорт'
                />
              </div>
              <div className="date-time">
                <div className="input-container">
                  <label htmlFor="date">Дата</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="input-container">
                  <label htmlFor="time">Час</label>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="input-container">
              <label>Послуги</label>
              <FilterableMultiSelect
                options={services}
                selectedOptions={selectedServices}
                setSelectedOptions={setSelectedServices}
              />
            </div>
            <button className="service-button" type="submit">
              Замовити
            </button>
          </form>}
          {!user && <h2>Авторизуйтесь для виконання замовлення.</h2>}
          {!vehicles.length && <h2>Додайте транспорт у профіль для виконання замовлення.</h2>}
        </MyModal>
      )}
    </div>
  );
};
