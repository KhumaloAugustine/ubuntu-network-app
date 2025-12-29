import axios from 'axios';
import { Platform } from 'react-native';

/**
 * API configuration
 * Following SOLID: Single Responsibility - API client configuration
 */

// Android emulator uses 10.0.2.2 to access localhost
// iOS simulator uses localhost
const getApiUrl = () => {
  if (__DEV__) {
    return Platform.OS === 'android'
      ? 'http://10.0.2.2:3000/api'
      : 'http://localhost:3000/api';
  }
  return 'https://your-production-api.com/api';
};

export const apiClient = axios.create({
  baseURL: getApiUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth token
apiClient.interceptors.request.use(
  (config) => {
    // TODO: Add auth token from storage
    // const token = await getAuthToken();
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      const message = error.response.data?.message || 'An error occurred';
      return Promise.reject(new Error(message));
    } else if (error.request) {
      // No response received
      return Promise.reject(new Error('Network error. Please check your connection.'));
    } else {
      return Promise.reject(error);
    }
  }
);
