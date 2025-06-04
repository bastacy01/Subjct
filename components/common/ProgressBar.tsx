import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  Easing
} from 'react-native-reanimated';
import Colors from '@/constants/Colors';

interface ProgressBarProps {
  progress: number; // 0 to 1
  color?: string;
  height?: number;
  style?: ViewStyle;
  animated?: boolean;
  duration?: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = Colors.light.primary[600],
  height = 8,
  style,
  animated = true,
  duration = 500,
}) => {
  // Clamp progress between 0 and 1
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  
  // Animation value
  const widthProgress = useSharedValue(0);
  
  // Update animation when progress changes
  useEffect(() => {
    if (animated) {
      widthProgress.value = withTiming(clampedProgress, {
        duration,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    } else {
      widthProgress.value = clampedProgress;
    }
  }, [clampedProgress, animated, duration]);
  
  // Animated style for progress bar
  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${widthProgress.value * 100}%`,
    };
  });

  return (
    <View 
      style={[
        styles.container, 
        { height }, 
        style
      ]}
    >
      <Animated.View 
        style={[
          styles.progress, 
          { backgroundColor: color },
          animatedStyle
        ]} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: Colors.light.neutral[200],
    borderRadius: 4,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
  },
});

export default ProgressBar;