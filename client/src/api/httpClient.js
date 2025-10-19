import axios from 'axios';

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

httpClient.interceptors.request.use((config) => {
  const userId = localStorage.getItem('mockUserId');
  if (userId) {
    config.headers['x-user-id'] = userId;
  }
  return config;
});

export default httpClient;
