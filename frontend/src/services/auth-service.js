export const login = async (userData) => {
    try {
        const response = await fetch('/auth/login', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          credentials: 'include',
          body: JSON.stringify({
            email: userData.email,
            password: userData.password
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error);
        }
        
        return data;
    } catch (error) {
        throw error;
    }
};

export const logout = async () => {
    try {
        const response = await fetch('/auth/logout', {
          method: 'POST',
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Ошибка при выходе');
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const register = async (userData) => {
    try {
      const response = await fetch('/auth/registration', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify({
          email: userData.email,
          username: userData.username,
          password: userData.password
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }

      return data;
    } catch (error) {
      throw error;
    }
};
