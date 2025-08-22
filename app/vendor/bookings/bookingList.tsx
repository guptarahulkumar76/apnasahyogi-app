import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

const bookings = [
  {
    id: "1",
    name: "Rahul Sharma",
    service: "Plumber",
    date: "25 Aug 2025",
    time: "10:30 AM",
    status: "Confirmed",
    location: "Delhi, India",
    phone: "+919876543210",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: "2",
    name: "Sneha Gupta",
    service: "Electrician",
    date: "27 Aug 2025",
    time: "03:00 PM",
    status: "Pending",
    location: "Noida, India",
    phone: "+919812345678",
    image: "https://randomuser.me/api/portraits/women/45.jpg",
  },
  {
    id: "3",
    name: "Amit Verma",
    service: "Carpenter",
    date: "29 Aug 2025",
    time: "11:00 AM",
    status: "Completed",
    location: "Gurugram, India",
    phone: "+919811223344",
    image: "https://randomuser.me/api/portraits/men/65.jpg",
  },
  {
    id: "4",
    name: "Priya Singh",
    service: "Beautician",
    date: "30 Aug 2025",
    time: "04:00 PM",
    status: "Pending",
    location: "Lucknow, India",
    phone: "+919955667788",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
  },
];

export default function CustomerBookingList() {
  const [filter, setFilter] = useState("All");
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  const filteredBookings =
    filter === "All" ? bookings : bookings.filter((b) => b.status === filter);

  const openMaps = (location: string) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      location
    )}`;
    Linking.openURL(url);
  };

  const callCustomer = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  // 🔹 Booking Card
  const renderBooking = ({ item }: any) => (
    <TouchableOpacity
      onPress={() => router.push({ pathname: "../vendorApp/customerDetails" })}
    >
      <View style={styles.card}>
        <View style={styles.row}>
          <Image source={{ uri: item.image }} style={styles.avatar} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.service}>{item.service}</Text>
            <Text style={styles.datetime}>
              {item.date} • {item.time}
            </Text>
            <Text style={[styles.status, getStatusStyle(item.status)]}>
              {item.status}
            </Text>
          </View>
        </View>

        <View style={styles.locationRow}>
          <Ionicons name="location" size={18} color="#f57c00" />
          <Text style={styles.location}>{item.location}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // 🔹 Booking List Screen
  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        {["All", "Confirmed", "Pending", "Completed"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, filter === tab && styles.activeTab]}
            onPress={() => setFilter(tab)}
          >
            <Text
              style={[styles.tabText, filter === tab && styles.activeTabText]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredBookings}
        keyExtractor={(item) => item.id}
        renderItem={renderBooking}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const getStatusStyle = (status: string) => {
  switch (status) {
    case "Confirmed":
      return { color: "green" };
    case "Pending":
      return { color: "#ff9800" };
    case "Completed":
      return { color: "blue" };
    default:
      return { color: "black" };
  }
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fafafa" },

  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#f5f5f5",
    paddingVertical: 10,
  },
  tab: { paddingVertical: 6, paddingHorizontal: 16, borderRadius: 20 },
  activeTab: { backgroundColor: "#f57c00" },
  tabText: { fontSize: 14, color: "#444" },
  activeTabText: { color: "#fff", fontWeight: "bold" },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 12,
    marginVertical: 8,
    padding: 15,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  row: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#f57c00",
  },
  name: { fontSize: 16, fontWeight: "bold", color: "#333" },
  service: { fontSize: 14, color: "#f57c00" },
  datetime: { fontSize: 13, color: "#666", marginTop: 2 },
  status: { fontSize: 13, fontWeight: "bold", marginTop: 2 },
  locationRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  location: { fontSize: 13, color: "#555", marginLeft: 5 },

  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  btnOutline: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#f57c00",
    borderWidth: 1,
    borderRadius: 25,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  btnOutlineText: { color: "#f57c00", marginLeft: 5, fontWeight: "bold" },
  btnFilled: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f57c00",
    borderRadius: 25,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  btnFilledText: { color: "#fff", marginLeft: 5, fontWeight: "bold" },

  // Detail Screen
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f57c00",
    padding: 10,
  },
  backText: { color: "#fff", marginLeft: 8, fontWeight: "bold" },
  detailCard: {
    flex: 1,
    alignItems: "center",
    margin: 20,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 15,
    elevation: 5,
  },
  detailImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#f57c00",
    marginBottom: 10,
  },
  detailName: { fontSize: 20, fontWeight: "bold", color: "#333" },
  detailService: { fontSize: 16, color: "#f57c00", marginVertical: 4 },
  detailInfo: { fontSize: 14, color: "#555", marginVertical: 2 },
});
