import React from 'react';
import Dropdown from '@UI/Dropdown/Dropdown';
import { roles } from '@/utils';

const RegisterForm = ({ formData, setFormData, onRegister, byAdmin = false }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  return (
    <form onSubmit={onRegister}>
      <input
        className="form-input"
        type="text"
        name="name"
        placeholder="Ім'я"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <input
        className="form-input"
        type="text"
        name="surname"
        placeholder="Прізвище"
        value={formData.surname}
        onChange={handleChange}
        required
      />
      <input
        className="form-input"
        type="email"
        name="email"
        placeholder="email@gmail.com"
        value={formData.email}
        onChange={handleChange}
        required
      />
      {byAdmin &&
        <Dropdown
          options={Array.from(roles.values())}
          active={formData.role}
          setActive={(role) => setFormData(prevData => ({ ...prevData, role }))}
          placeholder='Оберіть роль'
        />}
      <input
        className="form-input"
        type="tel"
        id="phone"
        name="phone"
        placeholder="0686969696"
        pattern="[0]{1}[0-9]{9}"
        maxLength={10}
        value={formData.phone}
        onChange={handleChange}
        required
      />
      <input
        className="form-input"
        type="password"
        name="password"
        placeholder="Пароль"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <button type="submit"
              className="auth-button">{byAdmin ? 'Створити нового користувача' : 'Зареєструватись'}</button>
    </form>
  );
};

export default RegisterForm;
