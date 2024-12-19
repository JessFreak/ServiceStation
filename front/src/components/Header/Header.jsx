import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Header.css';
import { useUser } from '@/context/UserContext';
import { roles } from '@/utils';

const Header = ({ setIsSignup }) => {
  const { user } = useUser();
  const navigate = useNavigate();

  const handleSignupClick = () => setIsSignup(false);
  const handleLoginClick = () => setIsSignup(true);

  const handleProfileClick = () => navigate('/profile');

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
        <NavLink to="/" className="header__nav-link">
          Головна
        </NavLink>
        <NavLink to="/services" className="header__nav-link">
          Послуги
        </NavLink>
        { user?.role === 'WORKER' && <NavLink to="/assigned-orders" className="header__nav-link">
          Призначені замовлення
        </NavLink> }
        { user?.role === 'ADMIN' && <NavLink to="/admin-panel" className="header__nav-link">
          Адмін панель
        </NavLink> }
      </nav>
      {user ? (
        <div className="header__user-info" onClick={handleProfileClick}>
          <div className="user-info__avatar">
            <img
              src={user.avatarUrl || ''}
              alt="Avatar"
              onError={(e) => (e.target.src = `${process.env.PUBLIC_URL}/user.svg`)}
            />
          </div>
          <div className="user-info__details">
            <strong>
              {user.name} {user.surname}
            </strong>
            <p className="user-info__role">{roles.get(user.role)}</p>
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
