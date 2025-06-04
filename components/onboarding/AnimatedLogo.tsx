import React, { useEffect } from 'react';
import { View, StyleSheet, Image, ImageSourcePropType } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withRepeat, 
  withSequence,
  Easing
} from 'react-native-reanimated';

interface AnimatedLogoProps {
  source: ImageSourcePropType;
  size?: number;
  pulseEnabled?: boolean;
}

const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ 
  source,
  size = 120,
  pulseEnabled = true
}) => {
  // Animation values
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const rotate = useSharedValue(0);

  useEffect(() => {
    if (pulseEnabled) {
      // Subtle pulsing animation
      scale.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 1500, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }),
          withTiming(1, { duration: 1500, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }),
        ),
        -1, // Infinite repeat
        true // Reverse
      );
    }

    // Initial entrance animation
    opacity.value = withTiming(1, { duration: 800 });
    rotate.value = withTiming(0, { duration: 600 });

    return () => {
      // Cleanup animation when unmounted
      scale.value = 1;
      opacity.value = 1;
      rotate.value = 0;
    };
  }, [pulseEnabled]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotateZ: `${rotate.value}deg` }
      ],
      opacity: opacity.value,
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[animatedStyle, { width: size, height: size }]}>
        <Image 
          source={source} 
          style={[styles.logo, { width: size, height: size }]}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    borderRadius: 24,
  }
});

export default AnimatedLogo;