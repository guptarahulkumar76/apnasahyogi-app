import { StyleSheet, Text, View } from 'react-native';
import { t } from '../../lib/translate';

export default function ExploreScreen() {
  // const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Text>{t('home_title')}</Text>
      <Text style={styles.title}>🔍 Explore</Text>
      <Text style={styles.subtitle}>You are on the Explore screen. Discover nearby vendors and offers.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#AF52DE' },
  subtitle: { fontSize: 16, marginTop: 10, color: '#444' },
});

