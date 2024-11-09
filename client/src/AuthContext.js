import React, { createContext, useState, useEffect, useLayoutEffect } from 'react';
import axios from 'axios';
import { redirect } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);

  const login = async (username, password) => {
    const response = await axios.post('http://localhost:4000/api/login', { username, password }, { withCredentials: true });
    setAccessToken(response.data.accessToken);
  };

  const logout = async () => {
    await axios.post('http://localhost:4000/api/logout', {}, { withCredentials: true });
    setAccessToken(null);
  };

  const refreshAccessToken = async () => {
    try {
      const response = await axios.post('http://localhost:4000/api/refresh-token', {}, { withCredentials: true });
      setAccessToken(response.data.accessToken);
      return response.data.accessToken;
    } catch (err) {
      logout();
      return null;
    }
  };

  useLayoutEffect(() => {
    const initializeAuth = async () => {
      const token = await refreshAccessToken();
      if (token) {
        setAccessToken(token);
      }
    };
    initializeAuth();
  }, []);

  useLayoutEffect(() => {
   if(accessToken){
    redirect('/dashboard');
   }
  }, [accessToken]);

  useLayoutEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        if (accessToken) {
          config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 403 && !originalRequest._retry) {
          originalRequest._retry = true;
          const newAccessToken = await refreshAccessToken();
          if (newAccessToken) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            return axios(originalRequest);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [accessToken]);

  return (
    <AuthContext.Provider value={{ accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
