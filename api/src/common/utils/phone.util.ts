/**
 * Phone number utility functions for South African numbers
 */
export class PhoneUtil {
  private static readonly SOUTH_AFRICA_PREFIX = '+27';
  private static readonly LOCAL_PREFIX = '0';

  /**
   * Format phone number to international format (+27...)
   * @param phone Raw phone number (e.g., 0821234567 or +27821234567)
   * @returns Formatted phone number
   */
  static formatToInternational(phone: string): string {
    // Remove all non-digit characters except +
    let cleaned = phone.replace(/[^\d+]/g, '');

    // Remove leading +27 if present
    if (cleaned.startsWith('+27')) {
      return cleaned;
    }

    // Convert 0XXXXXXXXXX to +27XXXXXXXXXX
    if (cleaned.startsWith('0')) {
      return '+27' + cleaned.substring(1);
    }

    // If it's just digits, assume it's already formatted without +
    if (/^\d{10,}$/.test(cleaned)) {
      return '+27' + cleaned;
    }

    throw new Error('Invalid phone number format');
  }

  /**
   * Format phone number to local format (0...)
   * @param phone International phone number
   * @returns Local format phone number
   */
  static formatToLocal(phone: string): string {
    const international = this.formatToInternational(phone);
    const number = international.replace('+27', '');
    return '0' + number;
  }

  /**
   * Validate phone number format
   * @param phone Phone number to validate
   * @returns true if valid South African number
   */
  static isValidSouthAfricanNumber(phone: string): boolean {
    try {
      const formatted = this.formatToInternational(phone);
      // South African numbers: +27 followed by 9 digits
      return /^\+27\d{9}$/.test(formatted);
    } catch {
      return false;
    }
  }

  /**
   * Get phone carrier type (mobile, landline, etc.)
   * @param phone Phone number
   * @returns Carrier type
   */
  static getCarrierType(phone: string): 'mobile' | 'landline' | 'unknown' {
    const formatted = this.formatToInternational(phone);
    const number = formatted.replace('+27', '');

    // SA mobile prefixes: 7, 6, 8
    const mobilePrefix = number[0];
    if (['6', '7', '8'].includes(mobilePrefix)) {
      return 'mobile';
    }

    return 'unknown';
  }
}
