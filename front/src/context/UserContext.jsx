import React, { createContext, useContext, useState, useEffect } from 'react';
import { axiosInstance, hasAccessToken, hasError } from '@/utils';

const UserContext = createContext({
  user: null,
  setUser: (user) => { user() },
  loading: true,
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!hasAccessToken()) {
        setLoading(false);
        return;
      }

      const response = await axiosInstance.get('auth/me');
      setUser(response.data);

      if (hasError(response)) document.cookie = '';

      setLoading(false);
    };

    fetchUserData().then();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};
