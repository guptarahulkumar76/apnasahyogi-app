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
} from "react-native";
import {
  Feather,
  MaterialIcons,
  Ionicons,
  Entypo,
  FontAwesome5,
  FontAwesome,
} from "@expo/vector-icons";

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
    image: require("../../../../assets/images/electrician.jpg"),
    reviews: [
      { user: "Ravi", comment: "Great service, quick and clean." },
      { user: "Anjali", comment: "Very professional and polite." },
    ],
    verified: true,
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.infoContainer}>
        {/* Header Info */}
        <View style={styles.rowBetween}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
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

            <View>
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
          </View>
          <View style={styles.ratingBox}>
            <Text style={styles.ratingText}>{vendorData.rating} ★</Text>
            <Text style={styles.ratingSub}>
              {vendorData.ratingsCount} ratings
            </Text>
          </View>
        </View>

        <Text style={styles.meta}>
          ⏱ {vendorData.time} · Schedule for later
        </Text>

        <Text style={styles.detailTitle}>Details</Text>
        <View style={styles.detailRow}>
          <MaterialIcons name="engineering" size={18} color="gray" />
          <Text style={styles.detailText}>{vendorData.experience}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="language" size={18} color="gray" />
          <Text style={styles.detailText}>Speaks {vendorData.languages}</Text>
        </View>
        <View style={styles.detailRow}>
          <Entypo name="wallet" size={18} color="gray" />
          <Text style={styles.detailText}>Charges: {vendorData.charge}</Text>
        </View>
        <View style={styles.detailRow}>
          <Feather name="clock" size={18} color="gray" />
          <Text style={styles.detailText}>
            Availability: {vendorData.availability}
          </Text>
        </View>

        {/* Read More Toggle Section */}
        {showMore && (
          <>
            <View style={styles.detailRow}>
              <FontAwesome5 name="certificate" size={16} color="gray" />
              <Text style={styles.detailText}>{vendorData.certifications}</Text>
            </View>
            <View style={styles.detailRow}>
              <Feather name="trending-up" size={18} color="gray" />
              <Text style={styles.detailText}>
                Job Success: {vendorData.jobSuccessRate}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Feather name="message-circle" size={18} color="gray" />
              <Text style={styles.detailText}>{vendorData.responseTime}</Text>
            </View>
            <View style={styles.detailRow}>
              <Feather name="calendar" size={18} color="gray" />
              <Text style={styles.detailText}>
                Joined: {vendorData.joinedDate}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Feather name="eye" size={18} color="gray" />
              <Text style={styles.detailText}>
                {vendorData.visits} profile visits
              </Text>
            </View>
          </>
        )}

        <TouchableOpacity
          onPress={() => setShowMore(!showMore)}
          style={{ marginTop: 10 }}
        >
          <Text style={{ color: "orange", fontWeight: "bold" }}>
            {showMore ? "Show Less ▲" : "Read More ▼"}
          </Text>
        </TouchableOpacity>

        {/* Services */}
        <Text style={styles.detailTitle}>Services</Text>
        <View style={styles.badgesContainer}>
          {vendorData.services.map((s, i) => (
            <View key={i} style={styles.badge}>
              <Text style={styles.badgeText}>{s}</Text>
            </View>
          ))}
        </View>

        {/* Book Now Button */}
        <TouchableOpacity
          style={styles.bookBtn}
          onPress={() => router.push("/user/components/connect/bookingScreen")}
        >
          <Text style={styles.bookBtnText}>Book Now</Text>
        </TouchableOpacity>

        {/* Reviews */}
        <Text style={styles.detailTitle}>Reviews</Text>
        {vendorData.reviews.map((rev, i) => (
          <View key={i} style={styles.reviewRow}>
            <Text style={styles.reviewUser}>{rev.user}</Text>
            <Text style={styles.reviewText}>{rev.comment}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#fff", flex: 1 },
  infoContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 90,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  title: { fontSize: 20, fontWeight: "700", color: "orange" },
  profileImg: {
    width: 55,
    height: 55,
    borderRadius: 50,
    marginRight: 12,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "green",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 4,
  },
  verifiedText: { fontSize: 10, color: "#fff", marginLeft: 4 },
  ratingBox: { alignItems: "flex-end" },
  ratingText: {
    backgroundColor: "orange",
    color: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 14,
  },
  ratingSub: { fontSize: 12, color: "#777" },
  meta: { fontSize: 13, color: "#555", marginVertical: 4 },
  detailTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 16,
    marginBottom: 6,
  },
  detailRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  detailText: { marginLeft: 8, color: "#444", fontSize: 14 },
  badgesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 10,
  },
  badge: {
    backgroundColor: "orange",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: { color: "#fff", fontSize: 13, fontWeight: "600" },
  reviewRow: {
    backgroundColor: "#fff6f0",
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  reviewUser: { fontWeight: "600", marginBottom: 4, fontSize: 13 },
  reviewText: { fontSize: 13, color: "#333" },
  bookBtn: {
    marginTop: 24,
    backgroundColor: "orange",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    width: "100%",
  },
  bookBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});
