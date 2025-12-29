import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * API Service
 * Centralizes all API calls with clean architecture
 * Implements DIP: controller depends on this abstraction
 */
class ApiService {
  private client: AxiosInstance;
  private baseURL: string;

  constructor(baseURL: string = 'http://localhost:3000/api/v1') {
    this.baseURL = baseURL;
    this.client = axios.create({
      baseURL,
      timeout: 10000,
    });

    // Add auth token to requests
    this.client.interceptors.request.use(async (config) => {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle response errors
    this.client.interceptors.response.use(
      (response) => response.data,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired - clear and redirect to login
          AsyncStorage.removeItem('authToken');
        }
        throw error.response?.data || error;
      },
    );
  }

  // ============ Auth =============
  async requestOtp(phone: string) {
    return this.client.post('/auth/request-otp', { phone });
  }

  async verifyOtp(phone: string, otp: string, deviceId: string) {
    return this.client.post('/auth/verify-otp', { phone, otp, deviceId });
  }

  // ============ Users =============
  async getUserProfile(userId: string) {
    return this.client.get(`/users/${userId}`);
  }

  // ============ Health =============
  async healthCheck() {
    return this.client.get('/health');
  }
}

// Export singleton instance
export default new ApiService();
