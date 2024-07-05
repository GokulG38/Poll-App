// axiosInstance.js

import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;


const axiosInstance = axios.create({
  baseURL: `${API_URL}`, 
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
