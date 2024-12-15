import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css';

const Header = ({ setIsSignup }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('access_token='))
      ?.split('=')[1];

    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleSignupClick = () => setIsSignup(true);
  const handleLoginClick = () => setIsSignup(false);

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
      {!isLoggedIn && (
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
