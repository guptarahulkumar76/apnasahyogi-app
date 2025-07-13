import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router'; // ✅ useRouter imported
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SettingsScreen() {
  const router = useRouter(); // ✅ Hook initialized here

  const resetLanguage = async () => {
    await AsyncStorage.removeItem('language');
    router.replace('/language/select'); // ✅ now this will work
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <TouchableOpacity style={styles.btn} onPress={resetLanguage}>
        <Text style={styles.btnText}>Change Language</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold' },
  btn: {
    backgroundColor: '#FF9500',
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
    width: '80%',
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontSize: 18 },
});
