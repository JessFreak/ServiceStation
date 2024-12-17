import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = document.cookie.includes('access_token');

    const fetchUserData = async () => {
      if (token) {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/auth/me`, {
          withCredentials: true,
        });
        if (response.error) {
          document.cookie = '';
          return;
        }

        setUser(response.data);
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
