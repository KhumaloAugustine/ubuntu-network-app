import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

interface WelcomeScreenProps {
  navigation: any;
}

/**
 * Welcome screen - first screen users see
 * Following SOLID: Single Responsibility - welcome UI only
 */
export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  const handleGetStarted = () => {
    navigation.navigate('PhoneVerification');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logo}>🤝</Text>
        <Text style={styles.title}>Ubuntu Network</Text>
        <Text style={styles.subtitle}>
          I am because we are
        </Text>
        <Text style={styles.description}>
          A digital community center that helps people safely connect, share
          skills, and support each other.
        </Text>

        <View style={styles.features}>
          <FeatureItem
            icon="✓"
            text="Community verified connections"
          />
          <FeatureItem
            icon="✓"
            text="Safe spaces for all interactions"
          />
          <FeatureItem
            icon="✓"
            text="Guardian oversight for safety"
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleGetStarted}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>
          By continuing, you agree to our community safety covenant
        </Text>
      </View>
    </SafeAreaView>
  );
};

const FeatureItem: React.FC<{ icon: string; text: string }> = ({ icon, text }) => (
  <View style={styles.featureItem}>
    <Text style={styles.featureIcon}>{icon}</Text>
    <Text style={styles.featureText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  logo: {
    fontSize: 72,
    textAlign: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2E7D32',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#444',
    lineHeight: 24,
    marginBottom: 32,
  },
  features: {
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    fontSize: 20,
    color: '#2E7D32',
    marginRight: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#444',
  },
  button: {
    backgroundColor: '#2E7D32',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    fontSize: 12,
    textAlign: 'center',
    color: '#999',
  },
});
