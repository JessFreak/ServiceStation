import React, { useState, useEffect } from 'react';
import './Auth.css';
import GoogleLogo from './GoogleLogo.svg';
import APIClient from '../../api/client';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom'; // Додаємо імпорт useNavigate
import 'react-toastify/dist/ReactToastify.css';

const Auth = ({ initialSignup = true }) => {
  const [isSignup, setIsSignup] = useState(initialSignup);
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Використовуємо useNavigate

  useEffect(() => {
    setIsSignup(initialSignup);
  }, [initialSignup]);

  const toggleForm = () => {
    setIsSignup(!isSignup);
  };

  const handleGoogleLogin = async () => {
    try {
      window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`;
      toast.success('Google login initiated!', { type: 'success', position: 'bottom-right' });
    } catch (error) {
      toast.error(`Google login failed: ${error.message}`, { type: 'error', position: 'bottom-right' });
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    const userData = { name, surname, email, phone, password };

    try {
      await APIClient.post('/auth/register', userData);
      toggleForm();
      toast.success('Реєстрація успішна. Ви можете увійти.', { type: 'success', position: 'bottom-right' });
    } catch (error) {
      toast.error(`Registration failed: ${error.message}`, { type: 'error', position: 'bottom-right' });
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    const loginData = { email, password };

    try {
      await APIClient.post('/auth/login', loginData);
      toast.success('Вхід успішний!', { type: 'success', position: 'bottom-right' });
      navigate('/');
    } catch (error) {
      toast.error(`Login failed: ${error.message}`, { type: 'error', position: 'bottom-right' });
    }
  };

  return (
    <div className="auth">
      <div className="main">
        <input type="checkbox" id="chk" aria-hidden="true" checked={isSignup} onChange={toggleForm} />
        <div className={isSignup ? 'signup active' : 'signup'}>
          <form onSubmit={handleSignupSubmit}>
            <label htmlFor="chk" aria-hidden="true">Реєстрація</label>
            <input
              type="text"
              name="name"
              placeholder="Ім'я"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="text"
              name="surname"
              placeholder="Прізвище"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="text"
              name="phone"
              placeholder="Телефон"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="auth-button">Зареєструватись</button>
          </form>
          <div className="google-login">
            <button className="auth-button google" onClick={handleGoogleLogin}>
              <img src={GoogleLogo} alt="Google Logo" className="google-logo" />
              Зареєструватись через Google
            </button>
          </div>
        </div>
        <div className={isSignup ? 'login' : 'login active'}>
          <form onSubmit={handleLoginSubmit}>
            <label htmlFor="chk" aria-hidden="true">Вхід</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="auth-button">Увійти</button>
          </form>
          <div className="google-login">
            <button className="auth-button google" onClick={handleGoogleLogin}>
              <img src={GoogleLogo} alt="Google Logo" className="google-logo" />
              Увійти через Google
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Auth;
