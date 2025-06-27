import { Stack } from 'expo-router';
import Colors from '@/constants/Colors';

export default function CoursesLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="back"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          headerTitle: "", // This ensures no title is shown
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: Colors.light.primary[600],
          },
          headerTintColor: 'white',
          headerLeftContainerStyle: {
            paddingLeft: 16, // Increase padding to align with other text
            paddingTop: 8, // Add top padding to align vertically with text
          },
          headerBackTitleVisible: false, // This hides the back button title
        }}
      />
    </Stack>
  );
}