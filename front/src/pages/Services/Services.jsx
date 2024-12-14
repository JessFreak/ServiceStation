import React, { useEffect, useState } from 'react';
import './Services.css';
import APIClient from '../../api/client';

export const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const data = await APIClient.get('/services');
        setServices(data);
      } catch (err) {
        console.error('Error fetching services:', err);
        setError('Не вдалося завантажити послуги');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return <div className="services__loading">Завантаження...</div>;
  }

  if (error) {
    return <div className="services__error">{error}</div>;
  }

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
              <button className="service-card__button">Замовити</button>
            </div>
            <div className="service-card__image">
              <img src={service.imageUrl} alt={service.name} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
