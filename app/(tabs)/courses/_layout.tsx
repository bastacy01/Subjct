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
          headerTitle: "", // Remove the "index" text by setting empty title
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: Colors.light.primary[600],
          },
          headerTintColor: 'white',
          headerLeftContainerStyle: {
            paddingLeft: 16, // Increase padding to align with other text
            paddingTop: 8, // Add top padding to align vertically with text
          },
          headerBackTitleVisible: false,
        }}
      />
    </Stack>
  );
}