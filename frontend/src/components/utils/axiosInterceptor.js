// axiosInstance.js

import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://localhost:5000', 
  timeout: 10000, 
});


axiosInstance.interceptors.request.use(
  function (config) {

    const token = localStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default axiosInstance;
