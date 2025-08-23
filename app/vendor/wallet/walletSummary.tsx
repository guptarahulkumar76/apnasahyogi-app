import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const WalletSummary: React.FC = () => {
  const router = useRouter();

  return (
    <LinearGradient colors={['#ffffff', '#ffe5cc']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Balance Card */}
        <View style={styles.glassCard}>
          <Text style={styles.balanceLabel}>Balance</Text>
          <Text style={styles.balanceAmount}>₹ 0.00</Text>
        </View>

        {/* Earnings List */}
        <View style={styles.earningsSection}>
          {[
            { label: "Total Earnings", amount: "₹ 0.00" },
            { label: "Today's Earnings", amount: "₹ 0.00" },
            { label: "Weekly Earnings", amount: "₹ 0.00" },
            { label: "Monthly Earnings", amount: "₹ 0.00" }
          ].map((item, index) => (
            <View key={index} style={styles.earningRow}>
              <Text style={styles.earningLabel}>{item.label}</Text>
              <Text style={styles.earningAmount}>{item.amount}</Text>
            </View>
          ))}
        </View>

        {/* Withdraw Button */}
        {/* <TouchableOpacity style={styles.withdrawButton} onPress={() => router.push('/vendor/wallet/withdraw')}>
          <LinearGradient
            colors={['#ef4014ff', '#feb47b']}
            style={styles.withdrawGradient}
          >
            <Text style={styles.withdrawText}>Withdraw</Text>
          </LinearGradient>
        </TouchableOpacity> */}

      </ScrollView>
    </LinearGradient>
  );
};

export default WalletSummary;

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  headerText: { fontSize: 22, fontWeight: 'bold', color: '#333', marginLeft: 10 },
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center',
  },
  balanceLabel: { fontSize: 20, color: '#444' },
  balanceAmount: { fontSize: 26, fontWeight: 'bold', color: '#ff7e5f', marginTop: 5 },
  earningsSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  earningRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8 },
  earningLabel: { fontSize: 16, color: '#333' },
  earningAmount: { fontSize: 16, fontWeight: '600', color: '#ff7e5f' },
  withdrawButton: { marginTop: 20, borderRadius: 25, overflow: 'hidden' },
  withdrawGradient: { paddingVertical: 12, alignItems: 'center', borderRadius: 25 },
  withdrawText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});