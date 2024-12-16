import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MainPage.css';

export const MainPage = () => {
  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate('/services');
  };

  return (
    <div className="main-page">
      <div className="main-page__background"></div>
      <div className="main-page__text">
        <h1>Хто ми?</h1>
        <p>FixTrack: Ваш партнер у сфері автосервісу. <br /> Професійний підхід до кожного автомобіля.</p>
        <button className="red-button" onClick={handleStartClick}>Розпочати</button>
      </div>
      <div className="main-page__actions">
        <div className="action">
          <h2>Запис на послуги</h2>
          <p>Легко запишіться на обслуговування вашого автомобіля.</p>
        </div>
        <div className="action">
          <h2>Відстеження статусу</h2>
          <p>Стежте за прогресом вашого авто та отримуйте своєчасні оновлення.</p>
        </div>
        <div className="action">
          <h2>Історія послуг</h2>
          <p>Переглядайте минулі записи про обслуговування та технічні деталі.</p>
        </div>
      </div>
    </div>
  );
};
