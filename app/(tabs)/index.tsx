import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';

import i18n from '../../lib/i18n'; // Make sure this is your initialized i18n instance

export default function MainLayout() {
  useEffect(() => {
    (async () => {
      const lang = await AsyncStorage.getItem('language');
      if (!lang) {
        router.replace('/language/select');
      } else {
        await i18n.changeLanguage(lang); // Set the language before navigating
        router.replace('/mainscreen/OnboardingScreen');
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007aff" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
