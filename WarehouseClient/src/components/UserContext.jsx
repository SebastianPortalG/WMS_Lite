import React, { createContext, useContext, useEffect, useState } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    role: localStorage.getItem('role') || 'guest',
    username: localStorage.getItem('username') || null,
    token: localStorage.getItem('token') || null
  });

  useEffect(() => {
    const syncLogoutAcrossTabs = () => {
      updateUserData('guest', null);
    };

    window.addEventListener('storage', syncLogoutAcrossTabs);
    return () => window.removeEventListener('storage', syncLogoutAcrossTabs);
  }, []);

  const updateUserData = (role, username, token) => {
    localStorage.setItem('role', role);
    localStorage.setItem('username', username);
    localStorage.setItem('token', token);
    setUser({ role, username, token });
  };

  const logout = () => {
    localStorage.clear();
    setUser({ role: 'guest', username: null });
  };

  return (
    <UserContext.Provider value={{ ...user, updateUserData, logout }}>
      {children}
    </UserContext.Provider>
  );
};
