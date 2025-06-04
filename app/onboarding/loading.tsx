import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import Colors from '@/constants/Colors';
import ProgressBar from '@/components/common/ProgressBar';
import LoadingAnimation from '@/components/onboarding/LoadingAnimation';

export default function LoadingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  
  const loadingSteps = [
    'Authenticating with your university...',
    'Retrieving your student profile...',
    'Fetching your current courses...',
    'Getting semester data...',
    'Finalizing setup...'
  ];

  useEffect(() => {
    // Simulate a loading process with multiple steps
    const totalDuration = 5000; // 5 seconds total
    const stepsCount = loadingSteps.length;
    const stepDuration = totalDuration / stepsCount;
    
    let interval: NodeJS.Timeout;
    let progressInterval: NodeJS.Timeout;
    
    // Update progress smoothly
    progressInterval = setInterval(() => {
      setProgress(prev => {
        const nextTarget = (currentStep + 1) / stepsCount;
        const increment = 0.01;
        const next = Math.min(prev + increment, nextTarget);
        
        return next;
      });
    }, 50);
    
    // Update steps
    interval = setInterval(() => {
      setCurrentStep(prev => {
        const next = prev + 1;
        if (next >= stepsCount) {
          clearInterval(interval);
          
          // Navigate to next screen when done
          setTimeout(() => {
            router.replace('/onboarding/course-select');
          }, 500);
          
          return prev;
        }
        return next;
      });
    }, stepDuration);
    
    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
    };
  }, [currentStep]);

  return (
    <Animated.View
      style={styles.container}
      entering={FadeIn.duration(400)}
      exiting={FadeOut.duration(200)}
    >
      <View style={styles.contentContainer}>
        <LoadingAnimation 
          progress={progress} 
          message={loadingSteps[currentStep]} 
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 24,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});