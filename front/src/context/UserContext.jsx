import React, { createContext, useContext, useState, useEffect } from 'react';
import { axiosInstance, hasAccessToken, hasError } from '@/utils';

const UserContext = createContext(null);

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const has = hasAccessToken();

    const fetchUserData = async () => {
      if (has) {
        const response = await axiosInstance.get('auth/me');
        if (hasError(response)) {
          document.cookie = '';
          return;
        }

        setUser(response.data);
      }
    };

    fetchUserData().then();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
