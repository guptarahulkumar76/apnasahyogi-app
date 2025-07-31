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
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import BottomTab from "../user/components/bottomTab";
import { useRouter } from "expo-router";

export default function ConnectionScreen() {
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

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <Animated.ScrollView
        contentContainerStyle={styles.container}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {[...Array(8)].map((_, i) => {
          const vendorData = {
            name: `Electrician #${i + 1}`,
            email: `user${i + 1}@gmail.com`,
            location: "Gurugram, Haryana",
            rating: "4.5",
            experience: "5+ years",
            category: "Electrician",
            image: `https://i.pravatar.cc/150?img=${i + 20}`,
          };

          return (
            <TouchableOpacity
              key={i}
              style={styles.card}
              onPress={() =>
                router.push({
                  pathname: "/user/components/connect/vendorConnect",
                  params: vendorData,
                })
              }
              activeOpacity={0.9}
            >
              <Image source={{ uri: vendorData.image }} style={styles.image} />

              <View style={styles.details}>
                <View style={styles.headerRow}>
                  <Text style={styles.name}>{vendorData.name}</Text>
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

                <View style={styles.row}>
                  <Ionicons name="briefcase-outline" size={16} color="#777" />
                  <Text style={styles.text}>
                    Experience: {vendorData.experience}
                  </Text>
                </View>

                <View style={styles.row}>
                  <Ionicons name="construct-outline" size={16} color="#777" />
                  <Text style={styles.text}>
                    Category: {vendorData.category}
                  </Text>
                </View>

                <View style={styles.row}>
                  <Ionicons name="star" size={16} color="#ffa000" />
                  <Text style={styles.text}>Rating: {vendorData.rating}</Text>
                </View>

                <View style={styles.row}>
                  <Ionicons name="location-outline" size={16} color="#777" />
                  <Text style={styles.text}>{vendorData.location}</Text>
                </View>

                <View style={styles.buttonRow}>
                  <View style={{ flex: 1, alignItems: "flex-end" }}>
                    <LinearGradient
                      colors={["#fb8c00", "#ef6c00"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.actionBtn}
                    >
                      <Ionicons
                        name="checkmark-done-outline"
                        size={16}
                        color="#fff"
                      />
                      <Text style={styles.btnText}>Book Now</Text>
                    </LinearGradient>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </Animated.ScrollView>

      <BottomTab bottomBarAnim={bottomBarAnim} from="connection" />
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
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "flex-end",
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
});
