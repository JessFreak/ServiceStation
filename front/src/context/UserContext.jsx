import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = document.cookie.includes('access_token');
    setIsLoggedIn(token);

    const fetchUserData = async () => {
      try {
        if (token) {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/auth/me`, {
            withCredentials: true,
          });
          setUser(response.data);
        }
      } catch (error) {
        console.error('Помилка при отриманні даних користувача:', error);
        setIsLoggedIn(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
