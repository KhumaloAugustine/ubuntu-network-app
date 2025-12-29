import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Main App Component
 * Implements clean architecture: screens, services, utils separation
 */

const Stack = createNativeStackNavigator();

// Placeholder screens (to be implemented)
function OnboardingScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.center}>
        <Text style={styles.title}>Ubuntu Network</Text>
        <Text style={styles.subtitle}>Safety-First Community Platform</Text>
        <ActivityIndicator size="large" color="#6200EE" style={styles.loader} />
        <Text style={styles.note}>Loading onboarding flow...</Text>
      </View>
    </SafeAreaView>
  );
}

function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.center}>
        <Text style={styles.title}>Home</Text>
        <Text style={styles.subtitle}>Authenticated user home screen</Text>
      </View>
    </SafeAreaView>
  );
}

/**
 * Root Navigator
 * Conditional rendering: onboarded vs authenticated
 */
export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState<string | null>(null);

  useEffect(() => {
    // Check if user has auth token
    const bootstrapAsync = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        setUserToken(token);
      } catch (e) {
        console.error('Failed to restore token:', e);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#6200EE" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {userToken == null ? (
          // Onboarding stack (not authenticated)
          <Stack.Group
            screenOptions={{
              headerShown: false,
              animationEnabled: false,
            }}
          >
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          </Stack.Group>
        ) : (
          // App stack (authenticated)
          <Stack.Group>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ title: 'Ubuntu Network' }}
            />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F1F1F',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  loader: {
    marginVertical: 20,
  },
  note: {
    fontSize: 14,
    color: '#999',
    marginTop: 20,
  },
});
