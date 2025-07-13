import { StyleSheet, Text, View } from 'react-native';
import { t } from '../../lib/translate';
export default function HomeScreen() {
  // Debugging log
  return (
    <View style={styles.container}>
      <Text>{t('home_title')}</Text>
      <Text style={styles.title}>🏠 Home</Text>
      <Text style={styles.subtitle}>You are on the Home screen of ApnaSahyogi.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#007AFF' },
  subtitle: { fontSize: 16, marginTop: 10, color: '#444' },
});
