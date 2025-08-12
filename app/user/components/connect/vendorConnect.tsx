import React, { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function VendorDetails() {
  const { vendorId } = useLocalSearchParams();
  const [showMore, setShowMore] = useState(false);

  const vendorData = {
    name: "Vijay Electrician",
    rating: "4.3",
    ratingsCount: "1.5k",
    location: "Banda Locality",
    distance: "3.2 km",
    time: "30–35 mins",
    experience: "7+ years",
    languages: "Hindi, English",
    charge: "₹200 – ₹500 approx.",
    availability: "Mon–Sun, 9 AM–9 PM",
    certifications: "Certified Electrician, Govt Approved",
    services: ["Fan Repair", "Wiring", "Lighting Setup"],
    jobSuccessRate: "95%",
    responseTime: "Typically responds in 5 mins",
    joinedDate: "Jan 2022",
    visits: "10k+",
    image: require("../../../../assets/images/electrician.png"),
    reviews: [
      { user: "Ravi", comment: "Great service, quick and clean." },
      { user: "Anjali", comment: "Very professional and polite." },
    ],
    verified: true,
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.card}>
            <View style={styles.headerRow}>
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/user/components/connect/imageView",
                    params: { img: "electrician" },
                  })
                }
              >
                <Image source={vendorData.image} style={styles.profileImg} />
              </TouchableOpacity>

              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{vendorData.name}</Text>
                {vendorData.verified && (
                  <View style={styles.verifiedBadge}>
                    <FontAwesome name="check" size={10} color="white" />
                    <Text style={styles.verifiedText}> Verified</Text>
                  </View>
                )}
                <Text style={styles.meta}>
                  📍 {vendorData.distance} · {vendorData.location}
                </Text>
              </View>

              <View style={styles.ratingBox}>
                <Text style={styles.ratingText}>{vendorData.rating} ★</Text>
                <Text style={styles.ratingSub}>
                  {vendorData.ratingsCount} ratings
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            {[
              ["⏱ Time:", vendorData.time],
              ["🛠 Experience:", vendorData.experience],
              ["🌐 Languages:", vendorData.languages],
              ["💰 Charges:", vendorData.charge],
              ["🕘 Availability:", vendorData.availability],
              ["📜 Certifications:", vendorData.certifications],
              ["🧰 Services:", vendorData.services.join(", ")],
              ["📈 Job Success:", vendorData.jobSuccessRate],
              ["💬 Response Time:", vendorData.responseTime],
              ["📅 Joined:", vendorData.joinedDate],
              ["👁️ Visits:", vendorData.visits],
            ].map(([label, value], i) => (
              <View key={i}>
                <View style={styles.row}>
                  <Text style={styles.label}>{label}</Text>
                  <Text style={styles.value}>{value}</Text>
                </View>
                {i < 10 && <View style={styles.separator} />}
              </View>
            ))}
          </View>

          <View style={[styles.section, { marginBottom: 80 }]}>
            <Text style={styles.sectionTitle}>Reviews</Text>
            {vendorData.reviews.map((rev, i) => (
              <View key={i} style={styles.reviewRow}>
                <Text style={styles.reviewUser}>{rev.user}</Text>
                <Text style={styles.reviewText}>{rev.comment}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Fixed Book Now Button */}
        <View style={styles.bookBtnContainer}>
          <TouchableOpacity
            style={styles.bookBtn}
            onPress={() =>
              router.push("/user/components/connect/bookingScreen")
            }
          >
            <Text style={styles.bookBtnText}>Book Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1 },
  scrollContent: {
    paddingBottom: 100,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  separator: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 6,
    opacity: 0.6,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  title: { fontSize: 18, fontWeight: "bold", color: "#f57c00" },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "green",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 4,
    alignSelf: "flex-start",
  },
  verifiedText: { fontSize: 10, color: "#fff", marginLeft: 4 },
  meta: { fontSize: 13, color: "#555" },
  ratingBox: { alignItems: "flex-end" },
  ratingText: {
    backgroundColor: "#f57c00",
    color: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 14,
    fontWeight: "600",
  },
  ratingSub: { fontSize: 12, color: "#777", marginTop: 2 },
  section: {
    backgroundColor: "#fafafa",
    padding: 16,
    marginTop: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: { color: "#666", fontSize: 14, fontWeight: "500", flex: 1 },
  value: { color: "#333", fontSize: 14, flex: 2, textAlign: "right" },
 bookBtnContainer: {
  position: "absolute",
  bottom: 12, // 👈 Added bottom spacing
  left: 0,
  right: 0,
  backgroundColor: "#fff",
  padding: 10,
  borderTopWidth: 1,
  borderColor: "#eee",
},
  bookBtn: {
    backgroundColor: "#f57c00",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  bookBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  reviewRow: {
    backgroundColor: "#fff3e0",
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#ffe0b2",
  },
  reviewUser: { fontWeight: "600", fontSize: 13, color: "#333" },
  reviewText: { fontSize: 13, color: "#444" },
});
