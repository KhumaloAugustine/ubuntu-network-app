import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WelcomeScreen } from './src/screens/WelcomeScreen';
import { PhoneVerificationScreen } from './src/screens/PhoneVerificationScreen';
import { OtpVerificationScreen } from './src/screens/OtpVerificationScreen';

const Stack = createNativeStackNavigator();

/**
 * Main App component
 * Following SOLID: Single Responsibility - navigation setup
 */
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#2E7D32',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ title: 'Ubuntu Network' }}
        />
        <Stack.Screen
          name="PhoneVerification"
          component={PhoneVerificationScreen}
          options={{ title: 'Phone Verification' }}
        />
        <Stack.Screen
          name="OtpVerification"
          component={OtpVerificationScreen}
          options={{ title: 'Enter Code' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
