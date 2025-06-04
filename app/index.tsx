import { useEffect } from 'react';
import { Redirect } from 'expo-router';

export default function Index() {
  // This is just a redirect page to the onboarding flow
  // In a real app, you might check if the user has already completed onboarding
  return <Redirect href="/onboarding/splash" />;
}