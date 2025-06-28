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
            color: Colors.light.primary[600], // Make title same color as background (invisible)
            fontSize: 0, // Make font size 0 to completely hide
          },
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