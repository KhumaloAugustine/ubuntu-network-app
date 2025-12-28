import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { authApi } from '../services/api/authApi';

interface PhoneVerificationScreenProps {
  navigation: any;
}

/**
 * Phone verification screen
 * Following SOLID: Single Responsibility - phone input and OTP request
 */
export const PhoneVerificationScreen: React.FC<PhoneVerificationScreenProps> = ({
  navigation,
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const formatPhoneNumber = (text: string): string => {
    // Remove all non-digits
    const digits = text.replace(/\D/g, '');
    
    // If starts with 0, replace with +27
    if (digits.startsWith('0')) {
      return '+27' + digits.substring(1);
    }
    
    // If starts with 27, add +
    if (digits.startsWith('27')) {
      return '+' + digits;
    }
    
    return digits;
  };

  const handleSendOtp = async () => {
    const formattedPhone = formatPhoneNumber(phoneNumber);
    
    // Validate format
    if (!/^\+27\d{9}$/.test(formattedPhone)) {
      Alert.alert(
        'Invalid Number',
        'Please enter a valid South African phone number (e.g., 0821234567)'
      );
      return;
    }

    setLoading(true);
    try {
      await authApi.requestOtp(formattedPhone);
      
      // Navigate to OTP screen
      navigation.navigate('OtpVerification', { phone: formattedPhone });
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.message || 'Failed to send verification code. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Verify Your Phone</Text>
        <Text style={styles.subtitle}>
          We'll send you a verification code to confirm your number
        </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="0821234567"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            maxLength={10}
            editable={!loading}
          />
          <Text style={styles.hint}>
            South African number (will be formatted as +27...)
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSendOtp}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Sending...' : 'Send Verification Code'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.info}>
          📱 By providing your phone number, you agree to receive SMS
          verification codes. Standard message rates may apply.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 32,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    fontSize: 18,
    backgroundColor: '#f9f9f9',
  },
  hint: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  button: {
    backgroundColor: '#2E7D32',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  info: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 18,
  },
});
