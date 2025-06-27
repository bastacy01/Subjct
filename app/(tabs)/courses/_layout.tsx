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
          headerTitle: "", // Keep empty title
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: Colors.light.primary[600],
          },
          headerTintColor: 'white', // Keep back arrow white
          headerTitleStyle: {
            color: Colors.light.primary[600], // Make title text same color as background (invisible)
          },
          headerLeftContainerStyle: {
            paddingLeft: 54, // Align with other text content
            paddingTop: 8,
          },
          headerBackTitleVisible: false, // Hide back button title
        }}
      />
    </Stack>
  );
}