import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function BookingConfirmation() {
  const router = useRouter();

  const vendor = {
    name: "Ramesh Kumar",
    category: "Electrician",
    rating: "4.8",
    totalBookings: "132",
    bookingDate: "31 July 2025",
    bookingTime: "2:30 PM",
    image: "https://i.pravatar.cc/150?img=12",
  };

  return (
    <View style={styles.container}>
      <Ionicons name="checkmark-circle-outline" size={70} color="#ff9800" />
      <Text style={styles.title}>Booking Confirmed</Text>
      <Text style={styles.subtitle}>You're all set!</Text>

      {/* Vendor Card */}
      <View style={styles.vendorCard}>
        <Image source={{ uri: vendor.image }} style={styles.vendorImage} />
        <View style={styles.vendorInfo}>
          <Text style={styles.vendorName}>{vendor.name}</Text>
          <Text style={styles.vendorCategory}>{vendor.category}</Text>

          <View style={styles.vendorMeta}>
            <MaterialIcons name="star-rate" size={16} color="#ffa000" />
            <Text style={styles.metaText}>{vendor.rating}</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.metaText}>{vendor.totalBookings} Bookings</Text>
          </View>

          <View style={styles.bookingInfo}>
            <Text style={styles.bookingText}>📅 {vendor.bookingDate}</Text>
            <Text style={styles.bookingText}>⏰ {vendor.bookingTime}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.note}>
        The vendor will contact you shortly. Thank you for using ApnaSahyogi!
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace("/")}
      >
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff8f0",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ff9800",
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  vendorCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 14,
    marginBottom: 20,
    width: "100%",
    elevation: 3,
    shadowColor: "#aaa",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  vendorImage: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    marginRight: 14,
  },
  vendorInfo: {
    flex: 1,
    justifyContent: "center",
  },
  vendorName: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#333",
  },
  vendorCategory: {
    fontSize: 14,
    color: "#777",
    marginVertical: 2,
  },
  vendorMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  metaText: {
    fontSize: 13,
    color: "#555",
    marginLeft: 4,
    marginRight: 6,
  },
  dot: {
    fontSize: 14,
    color: "#999",
    marginHorizontal: 4,
  },
  bookingInfo: {
    marginTop: 4,
  },
  bookingText: {
    fontSize: 13,
    color: "#444",
  },
  note: {
    fontSize: 14,
    textAlign: "center",
    color: "#555",
    marginBottom: 28,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "#ff9800",
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
});
