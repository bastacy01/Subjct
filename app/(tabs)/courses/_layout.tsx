import { Stack } from 'expo-router';
import Colors from '@/constants/Colors';

export default function CoursesLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          headerTitle: "", // Empty string
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: Colors.light.primary[600],
          },
          headerTintColor: 'white', // Keep back arrow white
          headerTitleStyle: {
            color: 'transparent', // Make title completely transparent
            fontSize: 0, // Make font size 0 to completely hide
            opacity: 0, // Additional opacity to ensure invisibility
          },
          headerLeftContainerStyle: {
            paddingLeft: 24, // Align with course content padding
            paddingTop: 0, // Remove top padding for better alignment
          },
          headerBackTitleVisible: false, // Hide back button title
          headerBackVisible: true, // Ensure back button is visible
        }}
      />
    </Stack>
  );
}