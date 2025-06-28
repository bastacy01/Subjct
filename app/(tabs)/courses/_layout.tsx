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
          headerTitle: "", // Empty string to remove title completely
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: Colors.light.primary[600],
          },
          headerTintColor: 'white', // Keep back arrow white
          headerLeftContainerStyle: {
            paddingLeft: 24, // Align with text content below
            paddingTop: 8,
          },
          headerBackTitleVisible: false, // Hide back button title
        }}
      />
    </Stack>
  );
}