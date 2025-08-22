import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const VendorDashboard: React.FC = () => {
  const router = useRouter();
  const [quickRequests, setQuickRequests] = React.useState([
    { id: 1, name: "Ramesh Kumar", time: "10:10 AM, 22 Aug" },
    { id: 2, name: "Sita Sharma", time: "11:30 AM, 22 Aug" },
    { id: 3, name: "Amit Singh", time: "12:00 PM, 22 Aug" },
  ]);

  const handleRequest = (id: number, accepted: boolean) => {
    setQuickRequests((prev) => prev.filter((req) => req.id !== id));
  };

  const BOTTOM_PADDING = Platform.OS === "android" ? 180 : 140;

  // Animated value to control bottom nav translateY
  const bottomNavTranslate = React.useRef(new Animated.Value(0)).current;

  // Functions to show and hide bottom nav
  const hideBottomNav = () => {
    Animated.timing(bottomNavTranslate, {
      toValue: 150,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const showBottomNav = () => {
    Animated.timing(bottomNavTranslate, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <Animated.ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: BOTTOM_PADDING }}
        scrollEventThrottle={16}
        onScrollBeginDrag={hideBottomNav} // Hide nav when scroll starts
        onScrollEndDrag={showBottomNav} // Show nav when scroll stops dragging
        onMomentumScrollEnd={showBottomNav} // Show nav when momentum scroll ends
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.profileWrapper}>
            <View style={styles.profilePic} />
            <Text style={styles.vendorName}>Vendor Name</Text>
          </View>
        </View>

        {/* Today's Summary */}
        <Text style={styles.sectionTitle}>Today's Summary</Text>
        <View style={styles.summaryContainer}>
          {[
            { number: "5", text: "Bookings" },
            { number: "$80", text: "Earnings" },
            { number: "4.5", text: "Rating" },
          ].map((item, index) => (
            <View key={index} style={styles.summaryCard}>
              <Text style={styles.summaryNumber}>{item.number}</Text>
              <Text style={styles.summaryText}>{item.text}</Text>
            </View>
          ))}
        </View>

        {/* Quick Requests */}
        <Text style={styles.sectionTitle}>Quick Requests</Text>
        {quickRequests.length === 0 && (
          <Text
            style={{
              color: "#777",
              fontStyle: "italic",
              marginBottom: 10,
              textAlign: "center",
            }}
          >
            No pending requests
          </Text>
        )}
        {quickRequests.map(({ id, name, time }) => (
          <View key={id} style={styles.requestCard}>
            <View style={styles.bookingAvatar} />
            <View style={styles.bookingInfo}>
              <Text style={styles.customerName}>{name}</Text>
              <Text style={styles.bookingTime}>{time}</Text>
            </View>
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.acceptBtn}
                onPress={() => handleRequest(id, true)}
              >
                <Ionicons name="checkmark" size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.rejectBtn}
                onPress={() => handleRequest(id, false)}
              >
                <Ionicons name="close" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Upcoming Bookings */}
        <Text style={styles.sectionTitle}>Upcoming & Pending Bookings</Text>
        {[1, 2, 3].map((_, index) => (
          <View key={index} style={styles.bookingCard}>
            <View style={styles.bookingAvatar} />
            <View style={styles.bookingInfo}>
              <TouchableOpacity
                onPress={() => router.push("/vendor/vendorApp/customerDetails")}
              >
                <Text style={styles.customerName}>Customer Name</Text>
              </TouchableOpacity>
              <Text style={styles.bookingTime}>10:10 AM, 22 Aug</Text>
            </View>
            <TouchableOpacity style={styles.statusBtn}>
              <Text style={styles.statusText}>
                {index === 1 ? "Accepted" : "Pending"}
              </Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* Earnings Overview */}
        <Text style={styles.sectionTitle}>Earnings Overview</Text>
        <View style={styles.summaryContainer}>
          {[
            { number: "$80", text: "Today" },
            { number: "$400", text: "Week" },
            { number: "$1600", text: "Month" },
          ].map((item, index) => (
            <View key={index} style={styles.summaryCard}>
              <Text style={styles.summaryNumber}>{item.number}</Text>
              <Text style={styles.summaryText}>{item.text}</Text>
            </View>
          ))}
        </View>
      </Animated.ScrollView>

      {/* Floating Bottom Navigation */}
      <Animated.View
        style={[
          styles.bottomNav,
          {
            bottom: Platform.OS === "android" ? 20 : 40,
            transform: [{ translateY: bottomNavTranslate }],
          },
        ]}
      >
        {[
          { name: "Dashboard", icon: "home-outline" },
          { name: "Bookings", icon: "calendar-outline" },
          { name: "Wallet", icon: "wallet-outline" },
        ].map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              if (item.name === "Dashboard") {
                router.push("/vendor/vendorApp/dashboard");
              } else if (item.name === "Bookings") {
                router.push("/vendor/bookings/bookingList");
              } else if (item.name === "Wallet") {
                router.push("/vendor/wallet/walletSummary");
              }
            }}
            style={styles.navItem}
          >
            <Ionicons name={item.icon} size={22} color="#FF7F00" />
            <Text style={styles.navText}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#FAFAFA" },
  container: { paddingHorizontal: 15 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  profileWrapper: { flexDirection: "row", alignItems: "center" },
  profilePic: {
    width: 55,
    height: 55,
    backgroundColor: "#ddd",
    borderRadius: 30,
    marginRight: 10,
  },
  vendorName: { fontSize: 20, fontWeight: "700", color: "#333" },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FF7F00",
    marginVertical: 12,
  },

  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  summaryCard: {
    flex: 1,
    margin: 5,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 3,
  },
  summaryNumber: { fontSize: 20, fontWeight: "700", color: "#FF7F00" },
  summaryText: { fontSize: 14, color: "#555", marginTop: 5 },

  bookingCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 2,
  },
  bookingAvatar: {
    width: 45,
    height: 45,
    backgroundColor: "#ddd",
    borderRadius: 22,
  },
  bookingInfo: { flex: 1, marginLeft: 12 },
  customerName: { fontSize: 16, fontWeight: "600", color: "#333" },
  bookingTime: { fontSize: 13, color: "#777", marginTop: 3 },

  statusBtn: {
    backgroundColor: "#FFF0E0",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: { fontSize: 13, color: "#FF7F00", fontWeight: "600" },

  // Quick Requests
  requestCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 2,
  },
  actionButtons: { flexDirection: "row", marginLeft: 10, gap: 10 },

  acceptBtn: { backgroundColor: "#4CAF50", padding: 10, borderRadius: 8 },
  rejectBtn: { backgroundColor: "#F44336", padding: 10, borderRadius: 8 },

  bottomNav: {
    position: "absolute",
    left: 0,
    right: 0,
    marginBottom: 30,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: -2 },
    elevation: 5,
  },
  navItem: { alignItems: "center" },
  navText: { fontSize: 13, color: "#FF7F00", marginTop: 4, fontWeight: "600" },
});

export default VendorDashboard;
