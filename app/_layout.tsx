import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import '../lib/i18n'; // initialize before anything
import i18n from '../lib/i18n';

import LogoTitle from './mainscreen/LogoTitle'; // Adjust the import path as necessary


export default function RootLayout() {
  const [langSelected, setLangSelected] = useState<boolean | null>(null);

  useEffect(() => {
    AsyncStorage.getItem('language').then(async (lang) => {
      if (lang) {
        console.log('Language selected:', lang);
        await i18n.changeLanguage(lang);
      }
      setLangSelected(!!lang);
    });
  }, []);

  if (langSelected === null) return null; // splash or loader

  return (
    <I18nextProvider i18n={i18n}>
      <Stack initialRouteName={langSelected ? 'mainscreen/OnboardingScreen' : 'language/select'} >
       <Stack.Screen
        name="mainscreen/OnboardingScreen"
        options={{headerTitle: () => <LogoTitle />,  headerTitleAlign: 'left' }}
      />
      <Stack.Screen
        name="language/select"
        options={{ title: 'Choose Language' }}
      />
  </Stack>
    </I18nextProvider>
  );
}


