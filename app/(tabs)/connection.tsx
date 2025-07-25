import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function ConnectionScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Your Connections</Text>

      {[...Array(8)].map((_, i) => (
        <View key={i} style={styles.card}>
          {/* Avatar */}
          <Image
            source={{ uri: `https://i.pravatar.cc/150?img=${i + 20}` }}
            style={styles.image}
          />

          <View style={styles.details}>
            {/* Header with name and status */}
            <View style={styles.headerRow}>
              <Text style={styles.name}>Electrician #{i + 1}</Text>
              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor: i % 2 === 0 ? "#d0f0c0" : "#fff3cd",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    { color: i % 2 === 0 ? "#2e7d32" : "#ff9800" },
                  ]}
                >
                  {i % 2 === 0 ? "Active" : "Pending"}
                </Text>
              </View>
            </View>

            {/* Email */}
            <View style={styles.row}>
              <Ionicons name="mail-outline" size={16} color="#777" />
              <Text style={styles.text}>user{i + 1}@gmail.com</Text>
            </View>

            {/* City */}
            <View style={styles.row}>
              <Ionicons name="location-outline" size={16} color="#777" />
              <Text style={styles.text}>Gurugram, Haryana</Text>
            </View>

            {/* Contact Button */}
            <TouchableOpacity style={styles.contactBtn}>
              <MaterialIcons name="phone-in-talk" size={16} color="#fff" />
              <Text style={styles.contactText}>Message</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 120,
    backgroundColor: "#fff8f2", // light peach like BookingScreen
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#ff9800", // orange title
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff1dc", // same card as BookingScreen
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 14,
    borderWidth: 2,
    borderColor: "#ff9800",
  },
  details: {
    flex: 1,
    justifyContent: "space-between",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  text: {
    marginLeft: 6,
    fontSize: 14,
    color: "#444",
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  contactBtn: {
    flexDirection: "row",
    backgroundColor: "#ff9800",
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignItems: "center",
    alignSelf: "flex-start",
  },
  contactText: {
    color: "#fff",
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "600",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});