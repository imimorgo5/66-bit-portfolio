import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/person/profile/my', {
      method: 'GET',
      credentials: 'include',
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.person) {
          setUser(data.person);
        } else {
          setUser(null);
        }
      })
      .catch((err) => setError(err))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
}
