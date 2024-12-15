import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Header.css';
import axios from 'axios';

const Header = ({ setIsSignup }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate(); // Хук для навігації

  useEffect(() => {
    const token = document.cookie.includes('access_token');

    if (token) setIsLoggedIn(true);

    const fetchUserData = async () => {
      try {
        if (isLoggedIn) {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/auth/me`, {
            withCredentials: true,
          });

          setUserData(response.data);
        }
      } catch (error) {
        console.error('Помилка при отриманні даних користувача:', error);
      }
    };

    fetchUserData();
  }, [isLoggedIn]);

  const handleSignupClick = () => setIsSignup(false);
  const handleLoginClick = () => setIsSignup(true);

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <header className="header">
      <div className="header__logo">
        <NavLink to="/">
          <img src={`${process.env.PUBLIC_URL}/favicon.png`} alt="logo" />
        </NavLink>
        <NavLink to="/" className="header__title">
          <h1>FixTrack</h1>
        </NavLink>
      </div>
      <nav className="header__nav">
        <NavLink to="/" className="header__nav-link" activeClassName="active">
          Головна
        </NavLink>
        <NavLink to="/services" className="header__nav-link" activeClassName="active">
          Послуги
        </NavLink>
      </nav>
      {isLoggedIn && userData ? (
        <div className="header__user-info" onClick={handleProfileClick}>
          <div className="user-info__avatar">
            <img src={userData.avatarUrl} alt="Avatar" />
          </div>
          <div className="user-info__details">
            <strong>{userData.name} {userData.surname}</strong>
            <p className="user-info__role">{userData.role}</p>
          </div>
        </div>
      ) : (
        <div className="header__buttons">
          <NavLink to="/auth">
            <button className="auth-button" onClick={handleSignupClick}>
              Зареєструватись
            </button>
          </NavLink>
          <NavLink to="/auth">
            <button className="auth-button" onClick={handleLoginClick}>
              Увійти
            </button>
          </NavLink>
        </div>
      )}
    </header>
  );
};

export default Header;
