import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const VendorDashboard: React.FC = () => {
  const router = useRouter();
  const [isOnline, setIsOnline] = React.useState(true);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileWrapper}>
          <View style={styles.profilePic} />
          <Text style={styles.vendorName}>Vendor Name</Text>
        </View>
        <Switch
          value={isOnline}
          onValueChange={() => setIsOnline(!isOnline)}
          thumbColor={isOnline ? "#FFA500" : "#f4f3f4"}
          trackColor={{ false: "#d1d1d1", true: "#FFD580" }}
        />
      </View>

      {/* Today's Summary */}
      <Text style={styles.sectionTitle}>Today's Summary</Text>
      <View style={styles.summaryContainer}>
        {[
          { number: "5", text: "Bookings" },
          { number: "$80", text: "Earnings" },
          { number: "4.5", text: "Rating" }
        ].map((item, index) => (
          <View key={index} style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>{item.number}</Text>
            <Text style={styles.summaryText}>{item.text}</Text>
          </View>
        ))}
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actionsContainer}>
        {["Accept", "Reject"].map((label, index) => (
          <TouchableOpacity key={index} style={styles.actionBtn}>
            <LinearGradient
              colors={label === "Accept" ? ["#FF7F00", "#FF9F40"] : ["#FF5C5C", "#FF7F7F"]}
              style={styles.gradientBtn}
            >
              <Text style={styles.btnText}>{label}</Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>

      {/* Upcoming Bookings */}
      <Text style={styles.sectionTitle}>Upcoming & Pending Bookings</Text>
      {[1, 2, 3].map((_, index) => (
        <View key={index} style={styles.bookingCard}>
          <View style={styles.bookingAvatar} />
          <View style={styles.bookingInfo}>
            <Text style={styles.customerName}>Customer Name</Text>
            <Text style={styles.bookingTime}>10:10 AM, 20 Aug</Text>
          </View>
          <TouchableOpacity style={styles.statusBtn}>
            <Text style={styles.statusText}>{index === 1 ? 'Accepted' : 'Pending'}</Text>
          </TouchableOpacity>
        </View>
      ))}

      {/* Earnings Overview */}
      <Text style={styles.sectionTitle}>Earnings Overview</Text>
      <View style={styles.summaryContainer}>
        {[
          { number: "$80", text: "Today" },
          { number: "$400", text: "Week" },
          { number: "$1600", text: "Month" }
        ].map((item, index) => (
          <View key={index} style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>{item.number}</Text>
            <Text style={styles.summaryText}>{item.text}</Text>
          </View>
        ))}
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {["Dashboard", "Bookings", "Wallet"].map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => router.push(`/${item.toLowerCase()}`)}
            style={styles.navItem}
          >
            <Text style={styles.navText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA', padding: 15 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  profileWrapper: { flexDirection: 'row', alignItems: 'center' },
  profilePic: { width: 55, height: 55, backgroundColor: '#ddd', borderRadius: 30, marginRight: 10 },
  vendorName: { fontSize: 20, fontWeight: '700', color: '#333' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#FF7F00', marginVertical: 12 },
  summaryContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  summaryCard: {
    flex: 1,
    margin: 5,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 3,
  },
  summaryNumber: { fontSize: 20, fontWeight: '700', color: '#FF7F00' },
  summaryText: { fontSize: 14, color: '#555', marginTop: 5 },
  actionsContainer: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 12 },
  actionBtn: { flex: 1, marginHorizontal: 10 },
  gradientBtn: { paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  bookingCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 2,
  },
  bookingAvatar: { width: 45, height: 45, backgroundColor: '#ddd', borderRadius: 22 },
  bookingInfo: { flex: 1, marginLeft: 12 },
  customerName: { fontSize: 16, fontWeight: '600', color: '#333' },
  bookingTime: { fontSize: 13, color: '#777', marginTop: 3 },
  statusBtn: { backgroundColor: '#FFF0E0', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 8 },
  statusText: { fontSize: 13, color: '#FF7F00', fontWeight: '600' },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderColor: '#eee',
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    ...Platform.select({
      android: { elevation: 3 },
      ios: { shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 3, shadowOffset: { width: 0, height: 2 } }
    })
  },
  navItem: { paddingHorizontal: 10 },
  navText: { fontSize: 15, color: '#FF7F00', fontWeight: '600' },
});

export default VendorDashboard;
