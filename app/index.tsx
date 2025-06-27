import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import Colors from '@/constants/Colors';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        {/* The splash screen will be visible during this time */}
      </View>
    );
  }

  // Redirect based on authentication status
  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  } else {
    return <Redirect href="/onboarding/splash" />;
  }
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.light.primary[600],
  },
});