import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  ActivityIndicator,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Skeleton } from "moti/skeleton";
import Constants from "expo-constants";
import auth from "@react-native-firebase/auth";

const API_BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl;

interface Props {
  selectedCategory: string;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

interface Vendor {
  id: string;
  name: string;
  profileImageUrl: string;
  rating: number;
  experience: string;
  category: string;
  isAvailable: boolean;
}

const router = useRouter();
const screenWidth = Dimensions.get("window").width;
const cardMargin = 10;
const cardWidth = (screenWidth - cardMargin * 3) / 2;
const LIMIT = 6;
const categoryImages: Record<string, any> = {
  Labour: require("../../../../assets/images/labour.png"),
  Plumber: require("../../../../assets/images/plumber.png"),
  Electrician: require("../../../../assets/images/electrician.png"),
  Carpenter: require("../../../../assets/images/carpenter.png"),
  Painter: require("../../../../assets/images/painter.png"),
  Caterer: require("../../../../assets/images/caterer.png"),
  Welder: require("../../../../assets/images/welder.jpg"),
};

const VendorCardList: React.FC<Props> = ({ selectedCategory, onScroll }) => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  const lat = 25.6139;
  const lng = 80.209;

  const fetchVendors = async (isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      let url = `${API_BASE_URL}/user/nearbyVendors?lat=${lat}&lng=${lng}&radius=50&limit=${LIMIT}`;
      if (nextPageToken && isLoadMore) {
        url += `&offset=${nextPageToken}`;
      }

      const user = auth().currentUser;
      const idToken = await user?.getIdToken();

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      const json = await res.json();

      if (json.status && Array.isArray(json.data)) {
        const filteredData =
          selectedCategory === "All"
            ? json.data
            : json.data.filter((v: any) => v.category === selectedCategory);

        setVendors((prev) =>
          isLoadMore ? [...prev, ...filteredData] : filteredData
        );
        setNextPageToken(json.nextPageToken || null);
      }
    } catch (error) {
      console.error("Error fetching vendors:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setNextPageToken(null);
    setVendors([]);
    fetchVendors(false);
  }, [selectedCategory]);

  const loadMore = () => {
    if (!loadingMore && nextPageToken) {
      fetchVendors(true);
    }
  };

  const handleConnect = async (item: any) => {
    try {
      setConnecting(true);

      const user = auth().currentUser;
      const idToken = await user?.getIdToken();

      const res = await fetch(`${API_BASE_URL}/connections/connectVendor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ vendorID: item.uid }),
      });

      const json = await res.json();

      if (json.status) {
        router.push({
          pathname: "/user/components/connect/vendorConnect",
          params: { vendorData: JSON.stringify(item) },
        });
      } else {
        console.error("API failed:", json.message);
      }
    } catch (err) {
      console.error("Error connecting vendor:", err);
    } finally {
      setConnecting(false);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <LinearGradient colors={["#fff", "#ffe0b2"]} style={styles.card}>
      <View style={styles.imageWrapper}>
        <Image
          source={
            item.profileImageUrl
              ? { uri: item.profileImageUrl }
              : categoryImages[item.category] ||
                require("../../../../assets/images/icon.png")
          }
          style={styles.image}
        />
        <View
          style={[
            styles.statusDot,
            { backgroundColor: item.isAvailable ? "green" : "gray" },
          ]}
        />
      </View>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.subtext}>
        {item.category} • {item.experience}
      </Text>
      <Text style={styles.rating}>⭐ {item.rating}</Text>

      <TouchableOpacity
        style={styles.connectBtn}
        onPress={() => handleConnect(item)}
      >
        <Text style={styles.connectText}>Connect</Text>
      </TouchableOpacity>
    </LinearGradient>
  );

  const renderSkeleton = () => (
    <View style={styles.skeletonContainer}>
      {Array.from({ length: 6 }).map((_, index) => (
        <View key={index} style={styles.card}>
          <View style={styles.imageWrapper}>
            <Skeleton width={60} height={60} radius={30} colorMode="light" />
          </View>
          <View style={{ alignItems: "center", marginTop: 12 }}>
            <Skeleton width="80%" height={12} radius={4} colorMode="light" />
            <Skeleton
              width="50%"
              height={10}
              radius={4}
              colorMode="light"
              style={{ marginTop: 6 }}
            />
            <Skeleton
              width="30%"
              height={10}
              radius={4}
              colorMode="light"
              style={{ marginTop: 6 }}
            />
          </View>
          <View style={{ alignItems: "center", marginTop: 16 }}>
            <Skeleton width="40%" height={26} radius={6} colorMode="light" />
          </View>
        </View>
      ))}
    </View>
  );

  if (loading && vendors.length === 0) {
    return renderSkeleton();
  }

  return (
    <View style={styles.container}>
      {/* Full-screen loading modal */}
      <Modal transparent={true} animationType="fade" visible={connecting}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ActivityIndicator size="large" color="#f57c00" />
            <Text style={styles.modalText}>Connecting vendor...</Text>
          </View>
        </View>
      </Modal>

      <FlatList
        data={vendors}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={
          vendors.length === 0 ? styles.emptyContainer : styles.listContent
        }
        columnWrapperStyle={vendors.length > 0 ? styles.row : undefined}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore && (
            <View style={styles.loadingMore}>
              <ActivityIndicator size="large" color="#f57c00" />
              <Text style={{ color: "#f57c00", marginTop: 5 }}>
                Loading more vendors...
              </Text>
            </View>
          )
        }
        ListEmptyComponent={
          !loading && (
            <Text style={styles.emptyText}>No vendors available.</Text>
          )
        }
      />
    </View>
  );
};

export default VendorCardList;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  listContent: { padding: cardMargin, paddingBottom: 100 },
  row: { justifyContent: "space-between", marginBottom: cardMargin },
  card: {
    width: cardWidth,
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#FFF1DE",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
    marginBottom: cardMargin,
    minHeight: 220,
  },
  skeletonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: cardMargin,
  },
  imageWrapper: { alignItems: "center", position: "relative" },
  image: { width: 70, height: 70, borderRadius: 35 },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    position: "absolute",
    bottom: 4,
    right: 10,
    borderWidth: 2,
    borderColor: "white",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
    textAlign: "center",
    color: "#333",
  },
  subtext: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
    marginTop: 4,
  },
  rating: { fontSize: 14, textAlign: "center", color: "#f57c00", marginTop: 6 },
  connectBtn: {
    marginTop: 10,
    backgroundColor: "#f57c00",
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "center",
    paddingHorizontal: 16,
  },
  connectText: { color: "#fff", fontWeight: "600" },
  emptyText: {
    fontSize: 18,
    textAlign: "center",
    color: "#999",
    marginTop: 50,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  loadingMore: { paddingVertical: 20, alignItems: "center" },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    elevation: 5,
  },
  modalText: {
    marginTop: 10,
    fontSize: 16,
    color: "#f57c00",
    fontWeight: "600",
  },
});
