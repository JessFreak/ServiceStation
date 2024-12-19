import React, { useEffect, useState } from 'react';
import './Auth.css';
import GoogleLogo from './GoogleLogo.svg';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { axiosInstance, hasError } from '@/utils';
import RegisterForm from '@Components/pages/Auth/RegisterForm';

const Auth = ({ isSignup, setIsSignup }) => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
    password: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    setIsSignup(isSignup);
  }, [isSignup, setIsSignup]);

  const toggleForm = () => {
    setIsSignup(!isSignup);
  };

  const handleGoogleLogin = async () => {
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`;
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    const response = await axiosInstance.post('auth/register', formData);
    if (hasError(response)) return;

    toggleForm();
    toast.success('Реєстрація успішна. Ви можете увійти.');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = formData;

    const loginData = { email, password };

    const response = await axiosInstance.post('auth/login', loginData);
    if (hasError(response)) return;

    const { token } = response.data;
    document.cookie = `access_token=${token};`;
    navigate('/');
    window.location.reload();
  };

  return (
    <div className="auth">
      <div className="main">
        <input type="checkbox" id="chk" aria-hidden="true" checked={isSignup} onChange={toggleForm}/>
        <div className={isSignup ? 'signup active' : 'signup'}>
          <label htmlFor="chk" aria-hidden="true">Реєстрація</label>
          <RegisterForm
            formData={formData}
            setFormData={setFormData}
            onRegister={handleSignupSubmit}
          />
          <div className="google-login">
            <button className="auth-button google" onClick={handleGoogleLogin}>
              <img src={GoogleLogo} alt="Google Logo" className="google-logo"/>
              Зареєструватись через Google
            </button>
          </div>
        </div>
        <div className={isSignup ? 'login' : 'login active'}>
          <form onSubmit={handleLoginSubmit}>
            <label htmlFor="chk" aria-hidden="true">Вхід</label>
            <input
              className="form-input"
              type="email"
              name="email"
              placeholder="email@gmail.com"
              value={formData.email}
              onChange={(e) => setFormData(prevData => ({ ...prevData, email: e.target.value }))}
              required
            />
            <input
              className="form-input"
              type="password"
              name="password"
              placeholder="Пароль"
              value={formData.password}
              onChange={(e) => setFormData(prevData => ({ ...prevData, password: e.target.value }))}
              required
            />
            <button type="submit" className="auth-button">Увійти</button>
          </form>
          <div className="google-login">
            <button className="auth-button google" onClick={handleGoogleLogin}>
              <img src={GoogleLogo} alt="Google Logo" className="google-logo"/>
              Увійти через Google
            </button>
          </div>
        </div>
      </div>
      <ToastContainer/>
    </div>
  );
};

export default Auth;
