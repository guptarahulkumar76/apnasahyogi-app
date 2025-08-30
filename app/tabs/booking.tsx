import React, { useEffect, useState, useRef } from "react";
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
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import BottomTab from "../user/components/bottomTab";
import { useRouter } from "expo-router";
import auth from "@react-native-firebase/auth";
import Constants from "expo-constants";
import { Skeleton } from "moti/skeleton";

const API_BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl as string;

export default function BookingScreen() {
  const router = useRouter();
  const bottomBarAnim = useRef(new Animated.Value(0)).current;

  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  // scroll offset track karne ke liye
  const offsetRef = useRef(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    if (offsetY > offsetRef.current + 10) {
      Animated.timing(bottomBarAnim, {
        toValue: 100,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else if (offsetY < offsetRef.current - 10) {
      Animated.timing(bottomBarAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
    offsetRef.current = offsetY;
  };

  const getStatusDetails = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return { color: "#ff9800", icon: "time-outline" };
      case "in progress":
        return { color: "#2196f3", icon: "refresh-circle-outline" };
      case "done":
        return { color: "#4caf50", icon: "checkmark-done-outline" };
      default:
        return { color: "#999", icon: "help-circle-outline" };
    }
  };

  // 🔹 Fetch bookings (with cursor)
  const fetchBookings = async (cursor: string | null = null) => {
    try {
      if (cursor) setLoadingMore(true);
      else setLoading(true);

      const user = auth().currentUser;
      const token = await user?.getIdToken();

      const url = `${API_BASE_URL}/bookings/user?limit=6${
        cursor ? `&cursor=${cursor}` : ""
      }`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json();

      if (json.status === "success") {
        if (cursor) {
          setBookings((prev) => [...prev, ...json.data]);
        } else {
          setBookings(json.data);
        }
        setNextCursor(json.nextCursor || null);
        setHasMore(!!json.nextCursor);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      if (cursor) setLoadingMore(false);
      else setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // 🔹 Render Booking Card
  const renderBooking = ({ item }: { item: any }) => {
    const { color, icon } = getStatusDetails(item.status);
    const vendor = item.vendor || {
      name: "Unknown Vendor",
      email: "N/A",
      category: "N/A",
      price: "N/A",
      image: "https://via.placeholder.com/70",
    };

    const location = item.vendor.location || {
      address: "Address not available",
      city: "",
      pincode: "",
    };

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.9}
        onPress={() =>
          router.push({
            pathname: "/user/components/ui/BookingDetail",
            params: {
              vendor: JSON.stringify(item.vendor),
              date: item.date ? new Date(item.date).toISOString() : "",
              service: item.service || "No Service",
              description: item.description?.trim() || "",
              bookingId: item.bookingId ?? "",
              location: JSON.stringify(location), // 👈 pass location also
            },
          })
        }
      >
        <Image source={{ uri: vendor.profileImageUrl === ""? "https://i.pravatar.cc/150?img=25" : vendor.profileImageUrl }} style={styles.image} />
        <View style={styles.details}>
          <View style={styles.headerRow}>
            <Text style={styles.name}>{vendor.category || "No Service"}</Text>
          </View>

          <View style={styles.row}>
            <Ionicons name="person-outline" size={16} color="#777" />
            <Text style={styles.text}>Name: {vendor.name}</Text>
          </View>

          <View style={styles.row}>
            <Ionicons name="calendar-outline" size={16} color="#777" />
            <Text style={styles.text}>
              {item.date ? new Date(item.date).toDateString() : "Date not set"}
            </Text>
          </View>

          {/* ✅ Corrected Location */}
          <View style={styles.row}>
            <Ionicons name="location-outline" size={16} color="#777" />
            <Text style={styles.text}>
              {location.address}, {location.city} - {location.pincode}
            </Text>
          </View>

          <View style={styles.row}>
            <Ionicons name="cash-outline" size={16} color="#777" />
            <Text style={styles.text}>Price: 500 Rs</Text>
          </View>

          <View style={styles.statusRow}>
            <Ionicons name={icon} size={16} color={color} />
            <Text style={[styles.statusText, { color }]}>
              Status: {item.status}
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
  };


  // 🔹 Skeleton Loader
  const renderSkeleton = () => {
    return (
      <View style={styles.card}>
        <Skeleton radius="round" height={70} width={70} colorMode="light" />
        <View style={{ flex: 1, marginLeft: 14 }}>
          <Skeleton height={20} width={"60%"} colorMode="light" />
          <Skeleton height={15} width={"40%"} colorMode="light" style={{ marginTop: 8 }} />
          <Skeleton height={15} width={"50%"} colorMode="light" style={{ marginTop: 8 }} />
          <Skeleton height={15} width={"30%"} colorMode="light" style={{ marginTop: 8 }} />
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={{ flex: 1, padding: 16, backgroundColor: "#fff8f2" }}>
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <React.Fragment key={i}>{renderSkeleton()}</React.Fragment>
          ))}
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <FlatList
        data={bookings}
        renderItem={renderBooking}
        keyExtractor={(item) => item.bookingId}
        contentContainerStyle={styles.container}
        onEndReached={() => {
          if (hasMore && !loadingMore) {
            fetchBookings(nextCursor);
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator size="small" color="#ff9800" style={{ margin: 10 }} />
          ) : null
        }
        onScroll={handleScroll}       // 👈 scroll se hide/show
        scrollEventThrottle={16}      // 👈 smooth animation ke liye
      />
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
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 14,
    borderWidth: 2,
    borderColor: "#ff9800",
  },
  details: { flex: 1 },
  name: { fontSize: 16, fontWeight: "600", color: "#333" },
  row: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  text: { marginLeft: 6, fontSize: 14, color: "#444" },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonRow: { marginTop: 10, alignItems: "flex-end" },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 30,
  },
  btnText: { color: "#fff", fontSize: 14, fontWeight: "bold", marginLeft: 6 },
  statusRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  statusText: { fontSize: 14, fontWeight: "600", marginLeft: 4 },
});
