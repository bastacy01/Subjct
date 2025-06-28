import { Stack } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import Colors from '@/constants/Colors';

export default function CoursesLayout() {
  const router = useRouter();

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
          headerTitle: "", // Empty title
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: Colors.light.primary[600],
          },
          headerBackVisible: false, // Hide the default back button completely
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                paddingLeft: 34, // Align with course content below
                paddingRight: 16,
                paddingVertical: 12,
                marginTop: 4,
              }}
              hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
            >
              <ChevronLeft size={32} color="white" strokeWidth={2.5} />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}