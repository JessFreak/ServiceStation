import React from 'react';
import Dropdown from '@UI/Dropdown/Dropdown';

const ServiceForm = ({ service, onChange, onSubmit }) => {
  const changeHandler = (e) => {
    onChange({
      ...service,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <h1>{service?.id ? 'Редагування послуги' : 'Створення послуги'}</h1>
      <form className='service-form' onSubmit={onSubmit}>
        <div className="input-container">
          <label htmlFor="name">Назва</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Назва"
            value={service?.name || ''}
            onChange={changeHandler}
            required
          />
        </div>
        <div className="input-container">
          <label htmlFor="price">Ціна</label>
          <input
            type="number"
            id="name"
            name="price"
            placeholder="Ціна"
            min={0}
            value={service?.price}
            onChange={changeHandler}
            required
            defaultValue={0}
          />
        </div>
        <div className="input-container">
          <label htmlFor="imageUrl">Посилання на зображення</label>
          <input
            type="url"
            id="imageUrl"
            name="imageUrl"
            placeholder="Посилання"
            value={service?.imageUrl || ''}
            onChange={changeHandler}
          />
        </div>
        <div className="input-container">
          <label htmlFor="is-active">Статус</label>
          <Dropdown
            options={['Активно', 'Неактивно']}
            active={service?.isActive ? 'Активно' : 'Неактивно'}
            setActive={(status) => onChange({ ...service, isActive: status === 'Активно' })}
            placeholder="Статус"
          />
        </div>
        <div className="input-container">
          <label htmlFor="description">Опис</label>
          <textarea
            id="description"
            name="description"
            placeholder="Опис"
            value={service?.description || ''}
            onChange={changeHandler}
          />
        </div>
        <button className="service-button" type="submit">
          {service?.id ? 'Змінити' : 'Створити послугу'}
        </button>
      </form>
    </>
  );
}

export default ServiceForm;