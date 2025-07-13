import { StyleSheet, Text, View } from 'react-native';

export default function ServicesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧰 Services</Text>
      <Text style={styles.subtitle}>You are on the Services screen. Browse available service categories.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#FF9500' },
  subtitle: { fontSize: 16, marginTop: 10, color: '#444' },
});
