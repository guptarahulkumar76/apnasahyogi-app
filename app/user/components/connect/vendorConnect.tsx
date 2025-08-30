import React from "react";
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

// Category-based images mapping
const categoryImages: Record<string, any> = {
  Labour: require("../../../../assets/images/labour.png"),
  Plumber: require("../../../../assets/images/plumber.png"),
  Electrician: require("../../../../assets/images/electrician.png"),
  Carpenter: require("../../../../assets/images/carpenter.png"),
  Painter: require("../../../../assets/images/painter.png"),
  Caterer: require("../../../../assets/images/caterer.png"),
  Welder: require("../../../../assets/images/welder.jpg"),
};

export default function VendorDetails() {
  const { vendorData } = useLocalSearchParams();
  const vendorRaw = vendorData ? JSON.parse(vendorData as string) : {};

  // Helper for safe value with default
  const getValue = (value: any, defaultVal: any) =>
    value !== undefined && value !== null && value !== "" ? value : defaultVal;

  const vendor = {
    name: getValue(vendorRaw.name, "-"),
    verified: getValue(vendorRaw.verified, false),
    distance: getValue(Math.round(vendorRaw.distance), "-"),
    location: vendorRaw.location
      ? {
          address: getValue(vendorRaw.location.address, "-"),
          city: getValue(vendorRaw.location.city, "-"),
          lat: getValue(vendorRaw.location.lat, "-"),
          lng: getValue(vendorRaw.location.lng, "-"),
          pincode: getValue(vendorRaw.location.pincode, "-"),
        }
      : { address: "-", city: "-", lat: "-", lng: "-", pincode: "-" },
    rating: getValue(vendorRaw.rating, "-"),
    ratingsCount: getValue(vendorRaw.ratingsCount, "0"),
    time: getValue(vendorRaw.time, "-"),
    experience: getValue(vendorRaw.experience, "-"),
    // languages: getValue(vendorRaw.languages, "-"),
    charge: getValue(vendorRaw.charge, "500"),
    // availability: getValue(vendorRaw.availability, "-"),
     certification: getValue(vendorRaw.certification, "-"),
    services: getValue(vendorRaw.subcategories, []),
     jobSuccess: getValue(vendorRaw.jobSuccess, "-"),
    responseTime: getValue(vendorRaw.responseTime, "-"),
    joinedDate: getValue(vendorRaw.createdAt, "-"),
    visits: getValue(vendorRaw.visits, "0"),
    category: getValue(vendorRaw.category, "Labour"),
     reviews: getValue(vendorRaw.reviews, []),
    image: getValue(vendorRaw.profileImageUrl, null),
    // geohash: getValue(vendorRaw.geohash, "-"),
    gender: getValue(vendorRaw.gender, "-"),
    mobile: getValue(vendorRaw.mobile, "-"),
    // role: getValue(vendorRaw.role, "-"),
    serviceAreaRadius: getValue(vendorRaw.serviceAreaRadius, "-"),
    uid: getValue(vendorRaw.uid, "-"),
    // createdAt: getValue(vendorRaw.createdAt, "-"),
    // updatedAt: getValue(vendorRaw.updatedAt, "-"),
  };

  const vendorImage =
    vendor.image ||
    categoryImages[vendor.category] ||
    require("../../../../assets/images/icon.png");

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Vendor Card */}
          <View style={styles.card}>
            <View style={styles.headerRow}>
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/user/components/connect/imageView",
                    params: { img: vendor.category.toLowerCase() },
                  })
                }
              >
                <Image source={vendorImage} style={styles.profileImg} />
              </TouchableOpacity>

              <View style={{ flex: 1, alignItems: "flex-start" }}>
  <Text style={styles.title}>{vendor.name}</Text>
  {vendor.verified && (
    <View style={styles.verifiedBadge}>
      <FontAwesome name="check" size={10} color="white" />
      <Text style={styles.verifiedText}> Verified</Text>
    </View>
  )}
  <Text style={styles.meta}>{vendor.category}</Text>
  <Text style={styles.meta}>📍 {vendor.distance} km</Text>
</View>


              {/* <View style={styles.ratingBox}>
                <Text style={styles.ratingText}>{vendor.rating} ★</Text>
                <Text style={styles.ratingSub}>
                  {vendor.ratingsCount} ratings
                </Text>
              </View> */}
            </View>
          </View>

          {/* Info Section */}
          <View style={styles.section}>
            {[
              ["📍 Address:", `${vendor.location.address}, ${vendor.location.city}`],
              
              // ["🏙 City:", vendor.location.city],
              // ["📌 Pincode:", vendor.location.pincode],
              // ["🌍 Latitude:", vendor.location.lat],
              // ["🌍 Longitude:", vendor.location.lng],
              // ["🗺 Geohash:", vendor.geohash],
              // ["⏱ Time:", vendor.time],
              ["🛠 Experience:", vendor.experience],
              ["★ Rating:",vendor.rating],
              // ["🌐 Languages:", vendor.languages],
              ["💰 Charges:", vendor.charge],
              // ["🕘 Availability:", vendor.availability],
             
              ["🧰 Services:", vendor.services?.length ? vendor.services.join(", ") : "-"],
               ["📈 Job Success:", vendor.jobSuccess],
                 ["📜 Certifications:", vendor.certification],
              ["💬 Response Time:", `${vendor.responseTime} minute`],
              ["📅 Joined:", vendor.joinedDate],
              ["👁️ Visits:", vendor.visits],
              // ["📱 Mobile:", vendor.mobile],
              // ["👤 Gender:", vendor.gender],
              // ["🛡 Role:", vendor.role],
              // ["📏 Service Area Radius:", vendor.serviceAreaRadius],
              // ["🆔 UID:", vendor.uid],
              // ["📅 Created At:", vendor.createdAt],
              // ["📅 Updated At:", vendor.updatedAt],
            ].map(([label, value], i, arr) => (
              <View key={i}>
                <View style={styles.row}>
                  <Text style={styles.label}>{label}</Text>
                  <Text style={styles.value}>{value}</Text>
                </View>
                {i < arr.length - 1 && <View style={styles.separator} />}
              </View>
            ))}
          </View>

          {/* Reviews */}
          {vendor.reviews?.length > 0 && (
            <View style={[styles.section, { marginBottom: 80 }]}>
              <Text style={styles.sectionTitle}>Reviews</Text>
              {vendor.reviews.map((rev: any, i: number) => (
                <View key={i} style={styles.reviewRow}>
                  <Text style={styles.reviewUser}>{getValue(rev.user, "-")}</Text>
                  <Text style={styles.reviewText}>{getValue(rev.comment, "-")}</Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Fixed Book Now Button */}
        <View style={styles.bookBtnContainer}>
          <TouchableOpacity
            style={styles.bookBtn}
            onPress={() =>
              router.push({
                    pathname: "/user/components/connect/bookingScreen",
                    params: { vendorData: JSON.stringify(vendor) },
              })
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
  scrollContent: { paddingBottom: 100 },
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
  headerRow: { flexDirection: "row", alignItems: "center" },
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
    bottom: 12,
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
