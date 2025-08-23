import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  Linking,
  Platform,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";

const { width } = Dimensions.get("window");

export default function CustomerDetailsScreen() {
  const { name, time, status } = useLocalSearchParams();

  // Dummy coordinates (Backend se aayenge in future)
  const customerLocation = {
    latitude: 28.6139, // Delhi
    longitude: 77.209,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const openMaps = () => {
    const scheme = Platform.select({
      ios: "maps:0,0?q=",
      android: "geo:0,0?q=",
    });
    const latLng = `${customerLocation.latitude},${customerLocation.longitude}`;
    const label = name || "Customer Location";
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });
    Linking.openURL(url!);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Customer Profile */}
        <View style={styles.profileCard}>
          <Image
            source={{ uri: "https://randomuser.me/api/portraits/men/32.jpg" }}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.customerName}>{name || "Amit Sharma"}</Text>
            <Text style={styles.bookingTime}>{time || "10:10 AM, 22 Aug"}</Text>
          </View>
        </View>

        {/* Booking Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Booking Information</Text>
          <View style={styles.row}>
            <FontAwesome name="calendar" size={20} color="#f57c00" />
            <Text style={styles.infoText}>
              Date & Time: {time || "22 Aug, 10:10 AM"}
            </Text>
          </View>
          <View style={styles.row}>
            <FontAwesome name="map-marker" size={20} color="#f57c00" />
            <Text style={styles.infoText}>Location: Near City Center Mall</Text>
          </View>
          <View style={styles.row}>
            <FontAwesome name="tasks" size={20} color="#f57c00" />
            <Text style={styles.infoText}>Service: Plumbing Repair</Text>
          </View>
          <View style={styles.row}>
            <FontAwesome name="info-circle" size={20} color="#f57c00" />
            <Text style={styles.infoText}>Status: {status || "Pending"}</Text>
          </View>
        </View>

        {/* Contact Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Customer Contact</Text>
          <View style={styles.row}>
            <Ionicons name="call" size={20} color="#f57c00" />
            <Text style={styles.infoText}>+91 98765 43210</Text>
          </View>
          <View style={styles.row}>
            <Ionicons name="mail" size={20} color="#f57c00" />
            <Text style={styles.infoText}>customer@email.com</Text>
          </View>
        </View>

        {/* Payment Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Payment Details</Text>
          <View style={styles.row}>
            <Ionicons name="cash" size={20} color="#f57c00" />
            <Text style={styles.infoText}>Amount: ₹1200</Text>
          </View>
          <View style={styles.row}>
            <Ionicons name="card" size={20} color="#f57c00" />
            <Text style={styles.infoText}>Payment Method: UPI</Text>
          </View>
          <View style={styles.row}>
            <Ionicons name="checkmark-circle" size={20} color="green" />
            <Text style={styles.infoText}>Payment Status: Paid</Text>
          </View>
        </View>

        {/* Map + Directions */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Location on Map</Text>
          <MapView style={styles.mapBox} initialRegion={customerLocation}>
            <Marker coordinate={customerLocation} title="Customer Location" />
          </MapView>

          <TouchableOpacity style={styles.mapButton} onPress={openMaps}>
            <Ionicons name="navigate-outline" size={20} color="white" />
            <Text style={styles.mapButtonText}> Get Directions</Text>
          </TouchableOpacity>
        </View>

        {/* CTA */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Accept & Start Job</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,

    backgroundColor: "#f57c00",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginLeft: 10,
  },
  scrollContent: { padding: 16 },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 15,
  },
  avatar: { width: 60, height: 60, borderRadius: 30, marginRight: 15 },
  customerName: { fontSize: 18, fontWeight: "bold", color: "#333" },
  bookingTime: { fontSize: 14, color: "#777" },
  infoCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderLeftWidth: 5,
    borderLeftColor: "#f57c00",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#f57c00",
    marginBottom: 10,
  },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  infoText: { marginLeft: 8, fontSize: 15, color: "#444" },
  mapBox: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 10,
  },
  mapButton: {
    width: "50%",
    flexDirection: "row",
    backgroundColor: "#f57c00",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  mapButtonText: { color: "white", fontSize: 15, fontWeight: "600" },
  button: {
    backgroundColor: "#f57c00",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
