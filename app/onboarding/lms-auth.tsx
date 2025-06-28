import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Platform, Linking, TextInput, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { universities, University } from '@/constants/Universities';
import Button from '@/components/common/Button';
import Colors from '@/constants/Colors';
import ProgressBar from '@/components/common/ProgressBar';
import { WebView } from 'react-native-webview';
import { Eye, EyeOff } from 'lucide-react-native';

export default function LmsAuthScreen() {
  const { schoolId } = useLocalSearchParams<{ schoolId: string }>();
  const [school, setSchool] = useState<University | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isWebViewVisible, setIsWebViewVisible] = useState(false);
  const [showDemoLogin, setShowDemoLogin] = useState(false);
  const [demoEmail, setDemoEmail] = useState('');
  const [demoPassword, setDemoPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
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
    if (school?.id === 'demo-university') {
      // For demo university, simulate the external sign-in first
      setShowDemoLogin(true);
      return;
    }

    if (Platform.OS === 'web') {
      // For web, open in a new tab
      window.open(school?.lmsLoginUrl, '_blank');
      simulateSuccessfulLogin();
    } else {
      // For native, show WebView
      setIsWebViewVisible(true);
    }
  };

  const handleDemoLogin = () => {
    // Clear any previous error
    setLoginError('');
    
    // Validate credentials
    if (demoEmail !== 'demo@university.edu' || demoPassword !== 'bolt') {
      setLoginError('Invalid email or password. Please try again.');
      return;
    }
    
    setIsLoading(true);
    // Simulate login process
    setTimeout(() => {
      if (isMounted.current) {
        setIsLoading(false);
        router.push('/onboarding/loading');
      }
    }, 1500);
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

  // Clear error when user starts typing
  const handleEmailChange = (text: string) => {
    setDemoEmail(text);
    if (loginError) {
      setLoginError('');
    }
  };

  const handlePasswordChange = (text: string) => {
    setDemoPassword(text);
    if (loginError) {
      setLoginError('');
    }
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
      ) : showDemoLogin && school.id === 'demo-university' ? (
        // Demo login modal that simulates the external sign-in experience
        <View style={styles.demoModalContainer}>
          <View style={styles.demoModalHeader}>
            <Button 
              title="Cancel" 
              variant="outline" 
              size="small"
              onPress={() => setShowDemoLogin(false)} 
            />
            <Text style={styles.demoModalTitle}>Canvas</Text>
            <View style={{ width: 60 }} />
          </View>
          
          <View style={styles.demoModalContent}>
            <Text style={styles.demoLoginTitle}>Demo University</Text>
            <Text style={styles.demoLoginSubtitle}>
              Enter your university credentials to continue
            </Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.textInput}
                value={demoEmail}
                onChangeText={handleEmailChange}
                placeholder="demo@university.edu"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.textInput, styles.passwordInput]}
                  value={demoPassword}
                  onChangeText={handlePasswordChange}
                  placeholder="Enter password"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={20} color={Colors.light.neutral[500]} />
                  ) : (
                    <Eye size={20} color={Colors.light.neutral[500]} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {loginError ? (
              <Text style={styles.errorMessage}>{loginError}</Text>
            ) : null}

            <Button
              title="Log In"
              onPress={handleDemoLogin}
              loading={isLoading}
              disabled={!demoEmail || !demoPassword}
              style={styles.loginButton}
            />
            
            <TouchableOpacity style={styles.forgotPasswordButton}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <>
          <View style={styles.header}>
            <ProgressBar progress={0.5} style={styles.progressBar} />
            <Text style={styles.title}>Connect to LMS</Text>
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
              title="Log in"
              onPress={handleLoginWithLMS}
              loading={isLoading}
              style={styles.button}
            />
            
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
    marginBottom: 24,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: Colors.light.neutral[900],
    marginBottom: 8,
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
  // Demo modal styles that mimic the WebView experience
  demoModalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  demoModalHeader: {
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
  demoModalTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.light.neutral[900],
  },
  demoModalContent: {
    flex: 1,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.neutral[50],
  },
  demoLoginTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: Colors.light.neutral[900],
    textAlign: 'center',
    marginBottom: 8,
  },
  demoLoginSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.light.neutral[600],
    textAlign: 'center',
    marginBottom: 32,
  },
  inputContainer: {
    width: '100%',
    maxWidth: 320,
    marginBottom: 16,
  },
  inputLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.light.neutral[700],
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: Colors.light.neutral[300],
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.light.neutral[900],
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 48,
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    padding: 4,
  },
  errorMessage: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.light.error[500],
    textAlign: 'center',
    marginBottom: 16,
    width: '100%',
    maxWidth: 320,
  },
  loginButton: {
    width: '100%',
    maxWidth: 320,
    marginTop: 8,
    marginBottom: 16,
  },
  forgotPasswordButton: {
    padding: 8,
  },
  forgotPasswordText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.light.primary[600],
    textAlign: 'center',
  },
});