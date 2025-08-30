import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  BackHandler,
  Alert,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";

const BookingDetail = () => {
  const params = useLocalSearchParams();
  const navigation = useNavigation();

  const vendor = params.vendor ? JSON.parse(params.vendor as string) : null;
  const vendorImage = vendor?.imageUrl || "https://i.pravatar.cc/150?img=12";
  const vendorName = vendor?.name || "Unknown Vendor";

  const locationObj = vendor?.location || null;
  const location =
    locationObj && typeof locationObj === "object"
      ? `${locationObj.address || "No Address"}, ${locationObj.city || ""} `
      : "No Location Provided";

  const bookingDate = params.date
    ? new Date(params.date as string).toDateString()
    : "Not Available";
  const bookingTime = params.date
    ? new Date(params.date as string).toLocaleTimeString()
    : "Not Available";
  
  // Ensure service is fetched properly, fallback to string "Not Provided"
  const service = vendor.category || "Not Provided";

  const description = (params.description as string) || "No description available";
  const bookingId = (params.bookingId as string) || "";

  const rating = params.rating ? Number(params.rating) : 0;
  const feedback = (params.feedback as string) || "No feedback yet";

  const status =  vendor?.status || "pending";

  // ✅ FIXED: Using preformatted date string
  const startTime = (params.startDate as string) || "—";

  const invoice = { visit: 200, labor: 300, total: 500 };

  useFocusEffect(
    React.useCallback(() => {
      const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
        router.replace("/tabs/booking");
        return true;
      });
      return () => subscription.remove();
    }, [])
  );

  useEffect(() => {
    navigation.setOptions?.({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => router.replace("/tabs/booking")}
          style={{ marginLeft: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
          <Image source={{ uri: vendorImage }} style={styles.image} />
          <Text style={styles.name}>{vendorName}</Text>
          <Text
            style={[
              styles.statusText,
              status == "completed" ? styles.statusCompleted : styles.statusPending,
            ]}
          >
            {status}
          </Text>
          <Text style={styles.bookingId}>Booking ID: {bookingId}</Text>

          <View style={styles.detailsWrapper}>
            <DetailRow label="📅 Booking Date" value={bookingDate} />
            {/* <DetailRow label="🕙 Booking Time" value={bookingTime} /> */}
            <DetailRow label="📍 Location" value={location} />
            <DetailRow label="🛠 Service Type" value={service} />
            {/* <DetailRow label="▶ Service Start" value={startTime} /> */}
          </View>

          <View style={styles.sectionBox}>
            <Text style={styles.sectionTitle}>🔧 Service Summary</Text>
            <Text style={styles.sectionValue}>{description}</Text>
          </View>

          {/* <View style={styles.sectionBox}>
            <Text style={styles.sectionTitle}>⭐ User Rating</Text>
            <Text style={styles.sectionValue}>
              {"★".repeat(rating)}{"☆".repeat(5 - rating)}
            </Text>
          </View>

          <View style={styles.sectionBox}>
            <Text style={styles.sectionTitle}>💬 Feedback</Text>
            <Text style={styles.sectionValue}>{feedback}</Text>
          </View>

          <View style={styles.invoiceBox}>
            <Text style={styles.invoiceTitle}>Invoice Summary</Text>
            <Text style={styles.invoiceText}>Service: {service}</Text>
            <Text style={styles.invoiceText}>Booking Date: {bookingDate}</Text>
            <Text style={styles.invoiceText}>Start Date: {startTime}</Text>
            <Text style={styles.invoiceText}>Description: {description || "N/A"}</Text>
            <Text style={styles.invoiceText}>Rating: {rating} ⭐</Text>
            <Text style={styles.invoiceText}>Feedback: {feedback || "N/A"}</Text>
            <Text style={styles.invoiceAmount}>Total: ₹{invoice.total}</Text>
          </View> */}
        </ScrollView>

        <View style={styles.buttonRowFixed}>
          <TouchableOpacity
  style={[styles.button, status === "pending" && { opacity: 0.5 }]}
  onPress={() => Alert.alert("Calling...")}
  disabled={status === "pending"}
>
  <Ionicons name="call" size={18} color="#fff" />
  <Text style={styles.buttonText}>Contact</Text>
</TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.replace("/tabs/booking")}
          >
            <Ionicons name="book" size={18} color="#fff" />
            <Text style={styles.buttonText}>My Bookings</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.detailRow}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

export default BookingDetail;

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: "#ffffff" },
  container: { flex: 1, position: "relative" },
  scrollView: { flex: 1 },
  content: { padding: 10, paddingBottom: 120 },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
    marginBottom: 10,
  },
  name: { fontSize: 22, fontWeight: "bold", textAlign: "center", color: "#222" },
  bookingId: {
    fontSize: 12,
    textAlign: "center",
    color: "#888",
    marginTop: 2,
  },
  statusText: { fontSize: 14, textAlign: "center", marginTop: 4, fontWeight: "bold" },
  statusPending: { color: "#f57c00" },
  statusCompleted: { color: "#388e3c" },
  detailsWrapper: { marginTop: 25, borderTopWidth: 1, borderColor: "#eee" },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  label: { fontSize: 15, color: "#666", width: "50%" },
  value: {
    fontSize: 15,
    color: "#111",
    fontWeight: "600",
    width: "50%",
    textAlign: "right",
  },
  sectionBox: {
    marginTop: 5,
    backgroundColor: "#fff3e0",
    padding: 15,
    paddingTop: 10,
    paddingBottom: 5,
    borderRadius: 10,
  },
  sectionTitle: { fontSize: 16, fontWeight: "bold", color: "#f57c00" },
  sectionValue: { fontSize: 15, color: "#333", marginTop: 6, lineHeight: 22 },
  invoiceBox: {
    marginTop: 15,
    backgroundColor: "#fff3e0",
    padding: 15,
    borderRadius: 10,
  },
  invoiceTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#f57c00",
    marginBottom: 10,
  },
  invoiceText: {
    fontSize: 15,
    color: "#333",
    marginBottom: 6,
  },
  invoiceAmount: {
    fontSize: 18,
    fontWeight: "700",
    color: "#f57c00",
    marginTop: 10,
  },
  buttonRowFixed: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 11,
    left: 0,
    right: 0,
  },
  button: {
    flex: 1,
    backgroundColor: "#f57c00",
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  buttonText: { color: "#fff", fontSize: 15, fontWeight: "600" },
});
