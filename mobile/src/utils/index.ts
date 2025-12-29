/**
 * Phone Utility - South African number formatting and validation
 */
export class PhoneUtil {
  static readonly SOUTH_AFRICA_PREFIX = '+27';
  static readonly LOCAL_PREFIX = '0';

  /**
   * Format phone number to international format (+27...)
   */
  static formatToInternational(phone: string): string {
    let cleaned = phone.replace(/[^\d+]/g, '');

    if (cleaned.startsWith('+27')) {
      return cleaned;
    }

    if (cleaned.startsWith('0')) {
      return '+27' + cleaned.substring(1);
    }

    if (/^\d{10,}$/.test(cleaned)) {
      return '+27' + cleaned;
    }

    throw new Error('Invalid phone number format');
  }

  /**
   * Validate South African phone number
   */
  static isValidSouthAfricanNumber(phone: string): boolean {
    try {
      const formatted = this.formatToInternational(phone);
      return /^\+27\d{9}$/.test(formatted);
    } catch {
      return false;
    }
  }

  /**
   * Format for display (local format: 0XXXXXXXXXX)
   */
  static formatToLocal(phone: string): string {
    const international = this.formatToInternational(phone);
    const number = international.replace('+27', '');
    return '0' + number;
  }

  /**
   * Format for display (formatted: +27 XX XXX XXXX)
   */
  static formatForDisplay(phone: string): string {
    const international = this.formatToInternational(phone);
    const cleaned = international.replace('+27', '');
    return `+27 ${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5)}`;
  }
}

/**
 * Validation Utility
 */
export class ValidationUtil {
  /**
   * Validate 6-digit OTP
   */
  static isValidOtp(otp: string): boolean {
    return /^\d{6}$/.test(otp);
  }

  /**
   * Validate email format
   */
  static isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}

/**
 * Device Utility
 */
export class DeviceUtil {
  /**
   * Generate or retrieve unique device ID
   * In production, use react-native-device-info
   */
  static async getOrGenerateDeviceId(): Promise<string> {
    // TODO: Implement with react-native-device-info
    // For now, generate a UUID
    return 'device-' + Math.random().toString(36).substr(2, 9);
  }
}
