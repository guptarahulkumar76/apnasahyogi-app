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
import { LinearGradient } from "expo-linear-gradient";
import BottomTab from "../user/components/bottomTab";
import { useRouter } from "expo-router";

export default function BookingScreen() {
  const router = useRouter();
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

  const getStatusDetails = (status: string) => {
    switch (status) {
      case "Pending":
        return { color: "#ff9800", icon: "time-outline" };
      case "In Progress":
        return { color: "#2196f3", icon: "refresh-circle-outline" };
      case "Done":
        return { color: "#4caf50", icon: "checkmark-done-outline" };
      default:
        return { color: "#999", icon: "help-circle-outline" };
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Animated.ScrollView
        contentContainerStyle={styles.container}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {[...Array(6)].map((_, i) => {
          const statusOptions = ["Pending", "In Progress", "Done"];
          const status = statusOptions[i % 3];
          const { color, icon } = getStatusDetails(status);

          const vendorData = {
            name: `Plumber #${i + 1}`,
            email: `plumber${i + 1}@gmail.com`,
            location: "Sector 21, Noida",
            rating: "4.6",
            experience: "3+ years",
            category: "Plumber",
            price: "₹500",
            date: `July ${21 + i}, 2025`,
            time: "10:00 AM",
            service: "Tap Repair & Fitting",
            image: `https://i.pravatar.cc/150?img=${i + 10}`,
            status,
          };

          return (
            <TouchableOpacity
              key={i}
              style={styles.card}
              activeOpacity={0.9}
              onPress={() =>
                router.push("/user/components/ui/BookingDetail")
              }
            >
              <Image source={{ uri: vendorData.image }} style={styles.image} />
              <View style={styles.details}>
                <View style={styles.headerRow}>
                  <Text style={styles.name}>{vendorData.service}</Text>
                </View>

                <View style={styles.row}>
                  <Ionicons name="person-outline" size={16} color="#777" />
                  <Text style={styles.text}>Name: {vendorData.name}</Text>
                </View>

                <View style={styles.row}>
                  <Ionicons name="calendar-outline" size={16} color="#777" />
                  <Text style={styles.text}>
                    {vendorData.date} · {vendorData.time}
                  </Text>
                </View>

                <View style={styles.row}>
                  <Ionicons name="location-outline" size={16} color="#777" />
                  <Text style={styles.text}>{vendorData.location}</Text>
                </View>

                <View style={styles.row}>
                  <Ionicons name="cash-outline" size={16} color="#777" />
                  <Text style={styles.text}>Price: {vendorData.price}</Text>
                </View>

                <View style={styles.statusRow}>
                  <Ionicons name={icon} size={16} color={color} />
                  <Text style={[styles.statusText, { color }]}>
                    Status: {status}
                  </Text>
                </View>

                <View style={styles.buttonRow}>
                  <LinearGradient
                    colors={["#fb8c00", "#ef6c00"]}
                    style={styles.actionBtn}
                  >
                    <Ionicons name="eye-outline" size={16} color="#fff" />
                    <Text style={styles.btnText}>More Info</Text>
                  </LinearGradient>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </Animated.ScrollView>
      <BottomTab bottomBarAnim={bottomBarAnim} from="booking" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 120,
    backgroundColor: "#fff8f2",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff1dc",
    borderRadius: 16,
    padding: 14,
    marginBottom: 18,
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
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonRow: {
    marginTop: 10,
    alignItems: "flex-end",
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  btnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 6,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
  },
});