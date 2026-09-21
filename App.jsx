import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAppFonts } from './use-fonts';
import AuthNavigator from './navigation/AuthNavigator';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';

export default function App() {
  const { fontsLoaded } = useAppFonts();
  if (!fontsLoaded) return null;

  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <AuthProvider>
          <FavoritesProvider>
            <AuthNavigator />
          </FavoritesProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
