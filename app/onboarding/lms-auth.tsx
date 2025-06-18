import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Platform, Linking } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { universities, University } from '@/constants/Universities';
import Button from '@/components/common/Button';
import Colors from '@/constants/Colors';
import ProgressBar from '@/components/common/ProgressBar';
import { WebView } from 'react-native-webview';
import { ExternalLink } from 'lucide-react-native';

export default function LmsAuthScreen() {
  const { schoolId } = useLocalSearchParams<{ schoolId: string }>();
  const [school, setSchool] = useState<University | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isWebViewVisible, setIsWebViewVisible] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    if (schoolId) {
      const foundSchool = universities.find(uni => uni.id === schoolId);
      if (foundSchool) {
        setSchool(foundSchool);
      }
    }
    
    return () => {
      isMounted.current = false;
    };
  }, [schoolId]);

  const handleLoginWithLMS = () => {
    if (Platform.OS === 'web') {
      // For web, open in a new tab
      window.open(school?.lmsLoginUrl, '_blank');
      simulateSuccessfulLogin();
    } else {
      // For native, show WebView
      setIsWebViewVisible(true);
    }
  };

  const handleOpenExternalBrowser = () => {
    if (school?.lmsLoginUrl) {
      Linking.openURL(school.lmsLoginUrl);
      simulateSuccessfulLogin();
    }
  };

  // In a real app, this would be an actual authentication flow
  const simulateSuccessfulLogin = () => {
    setIsLoading(true);
    
    // Simulate authentication delay
    setTimeout(() => {
      if (isMounted.current) {
        setIsLoading(false);
        router.push('/onboarding/loading');
      }
    }, 2000);
  };

  const handleWebViewNavigationStateChange = (newNavState: any) => {
    // In a real app, you'd check for specific redirect URLs that indicate successful login
    // For this demo, we'll just simulate success after a delay
    setTimeout(() => {
      if (isMounted.current) {
        setIsWebViewVisible(false);
        simulateSuccessfulLogin();
      }
    }, 5000);
  };

  if (!school) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>School not found</Text>
        <Button 
          title="Go Back" 
          onPress={() => router.back()} 
          style={styles.button}
        />
      </View>
    );
  }

  return (
    <Animated.View 
      style={styles.container}
      entering={FadeIn.duration(400)}
      exiting={FadeOut.duration(200)}
    >
      {isWebViewVisible ? (
        <View style={styles.webViewContainer}>
          <View style={styles.webViewHeader}>
            <Button 
              title="Cancel" 
              variant="outline" 
              size="small"
              onPress={() => setIsWebViewVisible(false)} 
            />
            <Text style={styles.webViewTitle}>{getLmsDisplayName(school.lmsProvider)}</Text>
            <View style={{ width: 60 }} />
          </View>
          
          <WebView
            source={{ uri: school.lmsLoginUrl }}
            style={styles.webView}
            onNavigationStateChange={handleWebViewNavigationStateChange}
          />
        </View>
      ) : (
        <>
          <View style={styles.header}>
            <ProgressBar progress={0.5} style={styles.progressBar} />
            <Text style={styles.stepText}>Step 2 of 4</Text>
            <Text style={styles.title}>Connect to Your LMS</Text>
            <Text style={styles.subtitle}>
              Sign in to your university's Learning Management System to access your courses
            </Text>
          </View>
          
          <View style={styles.contentContainer}>
            <View style={styles.schoolInfoContainer}>
              <Text style={styles.schoolName}>{school.name}</Text>
              <View style={styles.lmsInfoContainer}>
                <Text style={styles.lmsProvider}>
                  {getLmsDisplayName(school.lmsProvider)}
                </Text>
              </View>
            </View>
          </View>
          
          <View style={styles.buttonContainer}>
            <Button
              title="Log in with LMS"
              onPress={handleLoginWithLMS}
              loading={isLoading}
              style={styles.button}
            />
            
            {Platform.OS !== 'web' && (
              <Button
                title="Open in Browser"
                variant="outline"
                onPress={handleOpenExternalBrowser}
                style={[styles.button, styles.secondaryButton]}
                textStyle={styles.secondaryButtonText}
                icon={<ExternalLink size={18} color={Colors.light.primary[600]} />}
              />
            )}
            
            <Button
              title="Back"
              variant="outline"
              onPress={() => router.back()}
              style={[styles.button, styles.secondaryButton]}
              textStyle={styles.secondaryButtonText}
            />
          </View>
        </>
      )}
    </Animated.View>
  );
}

// Helper function to get display name for LMS providers
function getLmsDisplayName(provider: string): string {
  switch (provider) {
    case 'canvas':
      return 'Canvas';
    case 'blackboard':
      return 'Blackboard Learn';
    case 'moodle':
      return 'Moodle';
    case 'brightspace':
      return 'D2L Brightspace';
    default:
      return provider.charAt(0).toUpperCase() + provider.slice(1);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    padding: 24,
    marginTop: Platform.OS === 'ios' ? 60 : 40,
    marginBottom: 24,
  },
  progressBar: {
    marginBottom: 8,
  },
  stepText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.light.neutral[500],
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: Colors.light.neutral[900],
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.light.neutral[600],
    lineHeight: 24,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  schoolInfoContainer: {
    alignItems: 'center',
  },
  schoolName: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: Colors.light.neutral[900],
    marginBottom: 8,
    textAlign: 'center',
  },
  lmsInfoContainer: {
    backgroundColor: Colors.light.primary[100],
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  lmsProvider: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.light.primary[700],
  },
  buttonContainer: {
    padding: 24,
    marginBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  button: {
    width: '100%',
    marginBottom: 12,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderColor: Colors.light.neutral[300],
  },
  secondaryButtonText: {
    color: Colors.light.neutral[700],
  },
  errorText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.light.error[500],
    textAlign: 'center',
    marginBottom: 24,
  },
  webViewContainer: {
    flex: 1,
  },
  webViewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.light.neutral[100],
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.neutral[200],
    paddingTop: Platform.OS === 'ios' ? 60 : 12,
  },
  webViewTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.light.neutral[900],
  },
  webView: {
    flex: 1,
  },
});