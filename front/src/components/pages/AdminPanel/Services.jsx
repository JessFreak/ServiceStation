import React, { useEffect, useState } from 'react';
import { axiosInstance, getDateString } from '@/utils';
import MyModal from '@UI/MyModal';
import ServiceForm from '@Components/pages/AdminPanel/ServiceForm';
import { toast } from 'react-toastify';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const fetchServices = async () => {
    setLoading(true);
    const response = await axiosInstance.get('services');
    if (response.error) return;

    setServices(response.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault()
    let response;

    if (selectedService?.id) {
      response = await axiosInstance.patch(`services/${selectedService.id}`, selectedService);
    } else {
      response = await axiosInstance.post('services', selectedService);
    }
    if (response.error) return;

    toast.success(`Послуга успішно ${selectedService?.id ? 'оновлена' : 'створена'}.`);

    await fetchServices();
    setIsModalOpen(false);
  };

  const openCreateModal = () => {
    setSelectedService(null);
    setIsModalOpen(true);
  };

  const openEditModal = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (loading) return <h1>Завантаження...</h1>;

  return (
    <div className="vehicles">
      <div className="vehicles-header">
        <h1 className="profile-title">Послуги</h1>
        <button className="red-button save-button" onClick={openCreateModal}>
          Створити послугу
        </button>
      </div>
      <div className="filters">
      </div>
      <table>
        <thead>
        <tr>
          <th>Id</th>
          <th>Зображення</th>
          <th>Назва</th>
          <th>Опис</th>
          <th>Ціна</th>
          <th>Створено</th>
          <th>Змінено</th>
          <th>Статус</th>
          <th>Змінити</th>
        </tr>
        </thead>
        <tbody>
        {services.map((service) => (
          <tr key={service.id}>
            {<td className="id">{service.id}</td>}
            <td>
              {service.imageUrl ? (
                <img
                  src={service.imageUrl} alt={service.name}/>
              ) : (
                <span>Без зображення</span>
              )}
            </td>
            {<td>{service.name}</td>}
            {<td>{service.description}</td>}
            {<td>{service.price}</td>}
            {<td>{getDateString(service.createdAt)}</td>}
            {<td>{getDateString(service.updatedAt)}</td>}
            {<td className="cell-status">
                <span className={`status ${service.isActive ? 'DONE' : 'CANCELED'}`}>
                  {service.isActive ? 'Активно' : 'Неактивно'}
                </span>
            </td>}
            {<td>
              <button className="service-button" onClick={() => openEditModal(service)}>
                <i className="bx bx-edit-alt"></i>
              </button>
            </td>}
          </tr>
        ))}
        {services.length === 0 && (
          <tr>
            <td colSpan="8" className="no-data">Користувачів не знайдено.</td>
          </tr>
        )}
        </tbody>
      </table>
      <MyModal isOpen={isModalOpen} onClose={closeModal}>
        <ServiceForm service={selectedService} onChange={setSelectedService} onSubmit={handleSubmit}/>
      </MyModal>
    </div>
  );
};

export default Services;
