import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAppFonts } from './use-fonts';
import AuthNavigator from './navigation/AuthNavigator';

export default function App() {
  const { fontsLoaded } = useAppFonts();
  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <AuthNavigator />
    </SafeAreaProvider>
  );
}