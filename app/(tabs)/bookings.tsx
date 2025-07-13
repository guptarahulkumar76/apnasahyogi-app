import { StyleSheet, Text, View } from 'react-native';

export default function BookingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📋 Bookings</Text>
      <Text style={styles.subtitle}>You are on the Bookings screen. View your current and past bookings here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#34C759' },
  subtitle: { fontSize: 16, marginTop: 10, color: '#444' },
});
