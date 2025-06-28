import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { View, Text, StyleSheet, Image } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSequence,
  withDelay,
  Easing,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { useAuth } from '@/contexts/AuthContext';
import Colors from '@/constants/Colors';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  // Animation values
  const logoScale = useSharedValue(0.8);
  const opacity = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const subtitleOpacity = useSharedValue(0);

  useEffect(() => {
    // Only start splash animation after auth loading is complete
    if (!isLoading) {
      // If user is not authenticated, skip the splash screen and go directly to onboarding
      if (!isAuthenticated) {
        setShowSplash(false);
        setShouldRedirect(true);
        return;
      }

      // For authenticated users, show the splash screen
      // Entrance animations sequence
      logoScale.value = withTiming(1, { 
        duration: 800, 
        easing: Easing.bezier(0.25, 0.1, 0.25, 1)
      });
      
      opacity.value = withTiming(1, { 
        duration: 800, 
        easing: Easing.bezier(0.25, 0.1, 0.25, 1)
      });
      
      titleOpacity.value = withDelay(
        400, 
        withTiming(1, { duration: 600 })
      );
      
      subtitleOpacity.value = withDelay(
        800, 
        withTiming(1, { duration: 600 })
      );

      // Show splash for 2.5 seconds, then redirect
      const timer = setTimeout(() => {
        setShowSplash(false);
        setShouldRedirect(true);
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [isLoading, isAuthenticated]);

  // Animated styles
  const logoStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: logoScale.value }],
      opacity: opacity.value,
    };
  });

  const titleStyle = useAnimatedStyle(() => {
    return {
      opacity: titleOpacity.value,
      transform: [
        { translateY: withTiming(titleOpacity.value * 0 + (1 - titleOpacity.value) * 20, { duration: 600 }) }
      ],
    };
  });

  const subtitleStyle = useAnimatedStyle(() => {
    return {
      opacity: subtitleOpacity.value,
      transform: [
        { translateY: withTiming(subtitleOpacity.value * 0 + (1 - subtitleOpacity.value) * 20, { duration: 600 }) }
      ],
    };
  });

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        {/* The splash screen will be visible during this time */}
      </View>
    );
  }

  // Show splash screen only for authenticated users
  if (showSplash && isAuthenticated) {
    return (
      <Animated.View 
        style={styles.container}
        entering={FadeIn.duration(800)}
        exiting={FadeOut.duration(500)}
      >
        <Animated.View style={[styles.logoContainer, logoStyle]}>
          <Image 
            source={require('@/assets/images/graduationcap1.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>
        
        <Animated.Text style={[styles.title, titleStyle]}>
          Subjct
        </Animated.Text>
        
        <Animated.Text style={[styles.subtitle, subtitleStyle]}>
          Listen to Lectures
        </Animated.Text>
      </Animated.View>
    );
  }

  // Redirect after splash screen or immediately if not authenticated
  if (shouldRedirect) {
    if (isAuthenticated) {
      return <Redirect href="/(tabs)" />;
    } else {
      return <Redirect href="/onboarding/splash" />;
    }
  }

  // Fallback (shouldn't reach here)
  return (
    <View style={styles.loadingContainer}>
      {/* The splash screen will be visible during this time */}
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.light.primary[600],
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    padding: 24,
  },
  logoContainer: {
    width: 180,
    height: 180,
    borderRadius: 50,
    marginBottom: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 180,
    height: 180,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: Colors.light.primary[600],
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
    color: Colors.light.neutral[900],
    textAlign: 'center',
    maxWidth: '80%',
  },
});