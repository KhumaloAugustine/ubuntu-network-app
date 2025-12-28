import { apiClient } from './apiClient';

/**
 * Authentication API service
 * Following SOLID: Single Responsibility - auth API calls only
 * Following DRY: Reusable auth methods
 */

interface OtpResponse {
  success: boolean;
  message: string;
  phone: string;
}

interface VerifyOtpResponse {
  success: boolean;
  token: string;
  user: {
    userId: string;
    phone: string;
  };
}

export const authApi = {
  /**
   * Request OTP for phone verification
   * @param phone - Phone number in +27... format
   */
  async requestOtp(phone: string): Promise<OtpResponse> {
    const response = await apiClient.post<OtpResponse>('/auth/request-otp', {
      phone,
    });
    return response.data;
  },

  /**
   * Verify OTP code
   * @param phone - Phone number
   * @param otp - 6-digit OTP code
   * @param deviceId - Optional device identifier
   */
  async verifyOtp(
    phone: string,
    otp: string,
    deviceId?: string
  ): Promise<VerifyOtpResponse> {
    const response = await apiClient.post<VerifyOtpResponse>('/auth/verify-otp', {
      phone,
      otp,
      deviceId,
    });
    return response.data;
  },
};
