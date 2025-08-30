import React, { useRef, useState, useEffect, useCallback } from "react";
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
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import BottomTab from "../user/components/bottomTab";
import { useRouter } from "expo-router";
import Constants from "expo-constants";
import auth from "@react-native-firebase/auth";
import { Skeleton } from "moti/skeleton";

const API_BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl;
const LIMIT = 4;

export default function ConnectionScreen() {
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;
  const bottomBarAnim = useRef(new Animated.Value(0)).current;
  let currentOffset = 0;

  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Scroll hide/show bottom tab
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

  // Fetch vendor list
  const fetchConnections = useCallback(
    async (pageNum: number, append = false) => {
      try {
        if (append) {
          setLoadingMore(true);
        } else {
          setLoading(true);
        }

        const user = auth().currentUser;
        const idToken = await user?.getIdToken();

        const res = await fetch(
          `${API_BASE_URL}/connections/fetchList?page=${pageNum}&limit=${LIMIT}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${idToken}`,
            },
          }
        );

        const data = await res.json();

        if (data.status === "success" && Array.isArray(data.data)) {
          if (append) {
            setVendors((prev) => [...prev, ...data.data]);
          } else {
            setVendors(data.data);
          }
          setHasMore(data.pagination?.hasMore ?? false);
        } else {
          setHasMore(false);
        }
      } catch (err) {
        console.error("Error fetching vendors:", err);
        setHasMore(false);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    []
  );


  // Initial load
  useEffect(() => {
    fetchConnections(1);
  }, [fetchConnections]);

  // Load more on scroll
  const handleEndReached = () => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchConnections(nextPage, true);
    }
  };

  const SkeletonCard = () => (
    <View style={styles.card}>
      <Skeleton radius="round" height={70} width={70} colorMode="light" />
      <View style={{ flex: 1, marginLeft: 14 }}>
        <Skeleton width={"60%"} height={16} radius={6} colorMode="light" />
        <View style={{ marginTop: 8 }}>
          <Skeleton width={"80%"} height={14} radius={6} colorMode="light" />
        </View>
        <View style={{ marginTop: 8 }}>
          <Skeleton width={"40%"} height={14} radius={6} colorMode="light" />
        </View>
        <View style={{ marginTop: 8 }}>
          <Skeleton width={"50%"} height={14} radius={6} colorMode="light" />
        </View>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {loading ? (
        <Animated.ScrollView
          contentContainerStyle={styles.container}
          scrollEventThrottle={16}
        >
          {Array.from({ length: LIMIT }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </Animated.ScrollView>
      ) : (
        <Animated.FlatList
          data={vendors}
          keyExtractor={(item, i) => item.id?.toString() || i.toString()}
          contentContainerStyle={styles.container}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore ? (
              <View style={styles.footer}>
                <ActivityIndicator size="small" color="#fb8c00" />
                <Text style={styles.footerText}>Loading more...</Text>
              </View>
            ) : null
          }
          renderItem={({ item: vendor, index }) => {
            const name = vendor?.name || `Vendor #${index + 1}`;
            const category = vendor?.category || "N/A";
            const experience = vendor?.experience || "0 years";
            const rating = vendor?.rating?.toString() || "0";
            const location =
              vendor?.location?.city ||
              vendor?.location?.address ||
              "No location";
            const image = vendor?.profileImageUrl
              ? vendor.profileImageUrl
              : `https://i.pravatar.cc/150?img=${index + 20}`;
            const isAvailable = vendor?.isAvailable ?? false;

            return (
              <TouchableOpacity
                style={styles.card}
                onPress={() =>
                  router.push({
                    pathname: "/user/components/connect/bookingScreen",
                    params: { vendorData: JSON.stringify(vendor) },
                  })
                }
                activeOpacity={0.9}
              >
                <Image source={{ uri: image }} style={styles.image} />

                <View style={styles.details}>
                  <View style={styles.headerRow}>
                    <Text style={styles.name}>{name}</Text>
                    <View
                      style={[
                        styles.badge,
                        {
                          backgroundColor: isAvailable ? "#d0f0c0" : "#fff3cd",
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.badgeText,
                          { color: isAvailable ? "#2e7d32" : "#ff9800" },
                        ]}
                      >
                        {isAvailable ? "Active" : "Pending"}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.row}>
                    <Ionicons name="briefcase-outline" size={16} color="#777" />
                    <Text style={styles.text}>Experience: {experience}</Text>
                  </View>

                  <View style={styles.row}>
                    <Ionicons name="construct-outline" size={16} color="#777" />
                    <Text style={styles.text}>Category: {category}</Text>
                  </View>

                  <View style={styles.row}>
                    <Ionicons name="star" size={16} color="#ffa000" />
                    <Text style={styles.text}>Rating: {rating}</Text>
                  </View>

                  <View style={styles.row}>
                    <Ionicons name="location-outline" size={16} color="#777" />
                    <Text style={styles.text}>{location}</Text>
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
          }}
        />
      )}

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
    alignItems: "center",
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
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
  },
  footerText: {
    marginLeft: 8,
    color: "#fb8c00",
    fontWeight: "500",
  },
});
