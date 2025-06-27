import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { router } from 'expo-router';
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
import Colors from '@/constants/Colors';

export default function SplashScreen() {
  // Animation values
  const logoScale = useSharedValue(0.8);
  const opacity = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const subtitleOpacity = useSharedValue(0);

  useEffect(() => {
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

    // Auto-navigate after splash screen displays
    const timer = setTimeout(() => {
      router.replace('/onboarding/school-select');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

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

  return (
    <Animated.View 
      style={styles.container}
      entering={FadeIn.duration(800)}
      exiting={FadeOut.duration(500)}
    >
      <Animated.View style={[styles.logoContainer, logoStyle]}>
        <Image 
          source={require('@/assets/images/graduationcap.png')}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    padding: 24,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 30,
    overflow: 'hidden',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 80,
    height: 80,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: Colors.light.primary[600],
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Inter-Medium', // Changed from 'Inter-Regular' to 'Inter-Medium' for more weight
    fontSize: 18,
    color: Colors.light.neutral[900], // Changed from neutral[700] to neutral[900] for darker/black color
    textAlign: 'center',
    maxWidth: '80%',
  },
});