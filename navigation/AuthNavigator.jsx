import React, { useEffect } from 'react';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import VerifyEmailScreen from '../screens/VerifyEmailScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import MainScreen from '../MainScreen';
import CourseScreen from '../CourseScreen';
import ProfileScreen from '../ProfileScreen';
import VocationalTestScreen from '../screens/VocationalTestScreen';
import VocationalResultScreen from '../screens/VocationalResultScreen';
import VestibularesScreen from '../screens/VestibularesScreen';
import VocationalIntroScreen from '../screens/VocationalIntroScreen';
import FavoritesScreen from '../FavoritesScreen';
import EditProfileScreen from '../EditProfileScreen';
import VestibularScreen from '../VestibularScreen';
import { LoadingView } from '../components/StateViews';
import { useAuth } from '../context/AuthContext';

const Stack = createNativeStackNavigator();
const navigationRef = createNavigationContainerRef();
const ROTAS_PUBLICAS = ['Welcome', 'Login', 'Register', 'VerifyEmail', 'ForgotPassword'];

export default function AuthNavigator() {
  const { status } = useAuth();

  // Sessão encerrada (logout, ou token expirado no servidor) -> volta para a tela inicial.
  useEffect(() => {
    if (status === 'anonymous' && navigationRef.isReady()) {
      const atual = navigationRef.getCurrentRoute()?.name;
      if (atual && !ROTAS_PUBLICAS.includes(atual)) {
        navigationRef.reset({ index: 0, routes: [{ name: 'Welcome' }] });
      }
    }
  }, [status]);

  // Enquanto restaura a sessão salva (rápido), mostra um carregando em vez de tela em branco.
  if (status === 'loading') return <LoadingView message="Carregando..." style={{ flex: 1 }} />;

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName={status === 'authenticated' ? 'MainScreen' : 'Welcome'}
        screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
      >
        <Stack.Screen name="MainScreen" component={MainScreen} />
        <Stack.Screen name="CourseScreen" component={CourseScreen} />
        <Stack.Screen name="VestibularScreen" component={VestibularScreen} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="VocationalTest" component={VocationalTestScreen} />
        <Stack.Screen name="VocationalResult" component={VocationalResultScreen} />
        <Stack.Screen name="Vestibulares" component={VestibularesScreen} />
        <Stack.Screen name="VocationalIntro" component={VocationalIntroScreen} />
        <Stack.Screen name="Favorites" component={FavoritesScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
