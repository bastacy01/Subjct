import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: styles.container,
        animation: 'fade',
      }}
    >
      <Stack.Screen name="splash" />
      <Stack.Screen name="school-select" />
      <Stack.Screen name="lms-auth" />
      <Stack.Screen name="loading" />
      <Stack.Screen name="course-select" />
    </Stack>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});