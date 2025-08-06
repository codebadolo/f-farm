import axios from 'axios';

// Base URL of your Django backend API
const API_BASE_URL = 'http://localhost:8000/api';  // adjust as needed

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add a request interceptor to attach auth token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');  // or wherever you store token
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
