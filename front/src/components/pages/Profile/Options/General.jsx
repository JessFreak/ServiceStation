import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useUser } from '@/context/UserContext';
import { axiosInstance } from '@/utils';

const General = () => {
  const { user, setUser } = useUser();
  const [userData, setUserData] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
    avatarUrl: '',
  });

  useEffect(() => {
    if (user) {
      setUserData({
        name: user.name || '',
        surname: user.surname || '',
        email: user.email || '',
        phone: user.phone || '',
        avatarUrl: user.avatarUrl || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${process.env.REACT_APP_IMGBB_API_KEY}`,
        formData,
      );

      setUserData((prevData) => ({ ...prevData, avatarUrl: response.data.data.url }));
      toast.success('Файл завантажено успішно. Збережіть зміни.');
    } catch (error) {
      toast.error('Помилка завантаження файлу.');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const response = await axiosInstance.patch(`users`, userData);
    if (response.error) return;

    setUser(response.data);

    toast.success('Дані успішно збережено.');
  };

  return (
    <>
      <h1 className="profile-title">Дані профілю</h1>
      <div className="profile-card">
        <form className="profile-section" onSubmit={handleSave}>
          <div className="input-container">
            <label htmlFor="name">Ім'я</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Ім'я"
              value={userData.name}
              onChange={handleChange}
            />
          </div>
          <div className="input-container">
            <label htmlFor="surname">Прізвище</label>
            <input
              type="text"
              id="surname"
              name="surname"
              placeholder="Прізвище"
              value={userData.surname}
              onChange={handleChange}
            />
          </div>
          <div className="input-container">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              value={userData.email}
              onChange={handleChange}
            />
          </div>
          <div className="input-container">
            <label htmlFor="phone">Номер телефону</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="0686969696"
              pattern="[0]{1}[0-9]{9}"
              maxLength={10}
              value={userData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <button className="red-button save-button" type='submit'>
            Зберегти
          </button>
        </form>
        <div className="avatar-section">
          <div className="avatar-placeholder">
            <img
              src={userData.avatarUrl || `${process.env.PUBLIC_URL}/user.svg`}
              className="avatar-image"
              alt="Avatar"
              onError={(e) => (e.target.src = `${process.env.PUBLIC_URL}/user.svg`)}
            />
          </div>
          <label htmlFor="file-upload" className="red-button">
            Змінити аватар
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
        </div>
      </div>
    </>
  );
};

export default General;