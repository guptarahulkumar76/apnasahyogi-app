import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import '../lib/i18n'; // initialize before anything
import i18n from '../lib/i18n';
import LogoTitle from './mainscreen/LogoTitle'; // Adjust the import path as necessary
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import LocationBar from './user/components/ui/locationBar';


export default function RootLayout() {
  return (
    <I18nextProvider i18n={i18n}>
      <Stack screenOptions={{
        headerStyle: { backgroundColor: '#ffffff' },
        headerTintColor: '#333',
        headerTitleStyle: { fontWeight: 'bold' }}}>
       <Stack.Screen
          name={"language/select"}
          options={{headerTitle: () => <LogoTitle showTranslateButton={false}/>,  headerTitleAlign: 'left' }}
        />
        <Stack.Screen
          name={"mainscreen/OnboardingScreen"}
          options={{headerTitle: () => <LogoTitle />,  headerTitleAlign: 'left' }}
        />
        <Stack.Screen
          name={"auth/login"}
          options={{headerTitle: () => <LogoTitle />,  headerTitleAlign: 'left',  headerBackVisible: false }}
        />
        <Stack.Screen
          name={"auth/otp"}
          options={{headerTitle: () => <LogoTitle showTranslateButton={false}/>,  headerTitleAlign: 'left', headerBackVisible: false }}
        />
        <Stack.Screen
        name="user/dashboard"
        options={{ headerShown: true, headerTitle: () => <LocationBar />, headerTitleAlign: 'left', headerBackVisible: false }}
      />
        <Stack.Screen name="+not-found" />
  </Stack>
    </I18nextProvider>
  );
}


