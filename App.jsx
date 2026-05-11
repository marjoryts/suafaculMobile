import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useAppFonts } from './use-fonts';
import LoginScreen from './LoginScreen';
import MainScreen from './MainScreen'; 

const Stack = createNativeStackNavigator();

export default function App() {
  const { fontsLoaded } = useAppFonts();

  if (!fontsLoaded) {
    return null; 
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="Main" 
            component={MainScreen} 
            options={{ title: 'Início' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}