import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Provide your live Render URL here! (e.g., 'https://pawcare-backend-xyz.onrender.com/api')
// For local Android emulator, use 'http://10.0.2.2:3001/api'
const BASE_URL = 'https://pawcare-ai.onrender.com/api'; // Live Render backend

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
