import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import '../../lib/i18n';
import i18n from '../../lib/i18n';

export default function LanguageSelect({ onDone }: { onDone?: () => void }) {
  const selectLanguage = async (lang: string) => {
    await AsyncStorage.setItem('language', lang);
    await i18n.changeLanguage(lang);

    if (onDone) {
      onDone(); // for modal-based use
    } else {
      router.replace('/mainscreen/OnboardingScreen'); // fallback for full screen
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>अपनी भाषा चुनें / Choose Your Language</Text>

      <TouchableOpacity style={[styles.btn, styles.hindi]} onPress={() => selectLanguage('hi')}>
        <Text style={styles.btnText}>हिंदी</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.btn, styles.english]} onPress={() => selectLanguage('en')}>
        <Text style={styles.btnText}>English</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.btn, styles.hinglish]} onPress={() => selectLanguage('hn')}>
        <Text style={styles.btnText}>Hinglish</Text>
      </TouchableOpacity>

      {onDone && (
        <TouchableOpacity style={styles.closeBtn} onPress={onDone}>
          <Text style={styles.closeText}>Close ✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f2f9ff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  btn: {
    width: '80%',
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  btnText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  hindi: { backgroundColor: '#007bff' },
  english: { backgroundColor: '#28a745' },
  hinglish: { backgroundColor: '#ff9500' },
  closeBtn: {
    marginTop: 30,
  },
  closeText: {
    color: '#007bff',
    fontSize: 16,
  },
});
