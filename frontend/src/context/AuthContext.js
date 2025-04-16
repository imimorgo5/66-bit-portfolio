import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('/showUserInfo', {
      method: 'GET',
      credentials: 'include',
    })
      .then(async (response) => {
        if (response.ok) {
          return await response.json();
        }
        return null;
      })
      .then((data) => {
        if (data) {
          setUser(data);
        } else {
          setUser(null);
        }
      })
      .catch((error) => {
        console.error('Ошибка проверки сессии:', error);
        setUser(null);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
