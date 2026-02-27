import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import Constants from 'expo-constants';

const API_BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl || 'http://localhost:3000/api';

const instance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
instance.interceptors.request.use(
  (config) => {
    // Add auth token if available
    // const token = AsyncStorage.getItem('authToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      // You can dispatch action to clear auth state
    }
    return Promise.reject(error);
  }
);

export const apiService = {
  get: (url: string, config?: AxiosRequestConfig) => instance.get(url, config),
  post: (url: string, data?: any, config?: AxiosRequestConfig) =>
    instance.post(url, data, config),
  put: (url: string, data?: any, config?: AxiosRequestConfig) =>
    instance.put(url, data, config),
  delete: (url: string, config?: AxiosRequestConfig) => instance.delete(url, config),
  patch: (url: string, data?: any, config?: AxiosRequestConfig) =>
    instance.patch(url, data, config),
};

export default instance;
