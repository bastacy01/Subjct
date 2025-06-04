import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withRepeat, 
  withDelay,
  Easing
} from 'react-native-reanimated';
import Colors from '@/constants/Colors';
import ProgressBar from '../common/ProgressBar';

interface LoadingAnimationProps {
  progress: number;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ progress }) => {
  // Animation values for loading dots
  const opacity1 = useSharedValue(0);
  const opacity2 = useSharedValue(0);
  const opacity3 = useSharedValue(0);

  useEffect(() => {
    // Sequential animation for the dots
    opacity1.value = withRepeat(
      withTiming(1, { duration: 500 }),
      -1,
      true
    );
    
    opacity2.value = withDelay(
      200,
      withRepeat(
        withTiming(1, { duration: 500 }),
        -1,
        true
      )
    );
    
    opacity3.value = withDelay(
      400,
      withRepeat(
        withTiming(1, { duration: 500 }),
        -1,
        true
      )
    );
  }, []);

  // Animated styles for the loading dots
  const dot1Style = useAnimatedStyle(() => ({
    opacity: opacity1.value,
  }));
  
  const dot2Style = useAnimatedStyle(() => ({
    opacity: opacity2.value,
  }));
  
  const dot3Style = useAnimatedStyle(() => ({
    opacity: opacity3.value,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.message}>Loading student data...</Text>
        
        <View style={styles.dotsContainer}>
          <Animated.View style={[styles.dot, dot1Style]} />
          <Animated.View style={[styles.dot, dot2Style]} />
          <Animated.View style={[styles.dot, dot3Style]} />
        </View>
        
        <View style={styles.progressContainer}>
          <ProgressBar 
            progress={progress} 
            height={8} 
            color={Colors.light.primary[600]}
            animated={true}
            duration={800}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 300,
  },
  message: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
    color: Colors.light.neutral[800],
    marginBottom: 24,
    textAlign: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    marginBottom: 32,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.light.primary[600],
    marginHorizontal: 4,
  },
  progressContainer: {
    width: '100%',
  },
});

export default LoadingAnimation;