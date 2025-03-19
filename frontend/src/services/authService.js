export const login = async (credentials) => {
    try {
        const response = await fetch('/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
            username: credentials.email,
            password: credentials.password
        }),
        });

        if (!response.ok) {
        throw new Error('Ошибка авторизации');
        }

        return await response.json();
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
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: userData.email,
          username: userData.userName,
          password: userData.password
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errors?.join(', ') || 'Ошибка регистрации');
      }
  
      return await response.json();
    } catch (error) {
      throw error;
    }
};
