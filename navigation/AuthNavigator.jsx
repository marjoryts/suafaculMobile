import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
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

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
      >
        <Stack.Screen name="MainScreen" component={MainScreen} />
        <Stack.Screen name="CourseScreen" component={CourseScreen} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="VocationalTest" component={VocationalTestScreen} />
        <Stack.Screen name="VocationalResult" component={VocationalResultScreen} />
        <Stack.Screen name="Vestibulares" component={VestibularesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
