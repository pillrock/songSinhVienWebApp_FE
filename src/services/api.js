import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers['x-auth-token'] = token;
  return config;
});

export const login = (data) => API.post('/auth/login', data);
export const createPayment = (data) => API.post('/payments', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const getPayments = () => API.get('/payments');

export default API;