import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Image,
  NativeSyntheticEvent,
  NativeScrollEvent,
  StatusBar,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import BottomTab from "../user/components/bottomTab";

export default function BookingScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const bottomBarAnim = useRef(new Animated.Value(0)).current;
  let currentOffset = 0;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;

    if (offsetY > currentOffset + 10) {
      Animated.timing(bottomBarAnim, {
        toValue: 100,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else if (offsetY < currentOffset - 10) {
      Animated.timing(bottomBarAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }

    currentOffset = offsetY;
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <Animated.ScrollView
        contentContainerStyle={styles.container}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* <Text style={styles.title}>Your Bookings</Text> */}

        {[...Array(6)].map((_, i) => (
          <View key={i} style={styles.card}>
            <Image
              source={{ uri: `https://i.pravatar.cc/150?img=${i + 10}` }}
              style={styles.image}
            />
            <View style={styles.details}>
              <View style={styles.headerRow}>
                <Text style={styles.vendorName}>Plumber #{i + 1}</Text>
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
                    {i % 2 === 0 ? "Completed" : "Upcoming"}
                  </Text>
                </View>
              </View>

              <View style={styles.row}>
                <Ionicons name="calendar-outline" size={16} color="#777" />
                <Text style={styles.text}>July {21 + i}, 2025 · 10:00 AM</Text>
              </View>

              <View style={styles.row}>
                <Ionicons name="location-outline" size={16} color="#777" />
                <Text style={styles.text}>Sector 21, Noida</Text>
              </View>

              <TouchableOpacity style={styles.contactBtn}>
                <MaterialIcons name="phone-in-talk" size={16} color="#fff" />
                <Text style={styles.contactText}>Contact</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </Animated.ScrollView>

      <BottomTab bottomBarAnim={bottomBarAnim} from="booking" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 120,
    backgroundColor: "#fff8f2", // light peach background
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#ff9800", // orange headline
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff1dc", // soft orange card
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
  vendorName: {
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
