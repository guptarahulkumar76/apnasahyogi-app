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
  ImageSourcePropType,
  ActivityIndicator,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { vendors as allVendors } from "../data/vendorData";

interface Props {
  selectedCategory: string;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}
interface Vendor {
  id: string;
  name: string;
  image: ImageSourcePropType;
  rating: number;
  experience: string;
  category: string;
  isOnline: boolean;
}

const router = useRouter();
const screenWidth = Dimensions.get("window").width;
const cardMargin = 10;
const cardWidth = (screenWidth - cardMargin * 3) / 2;

const PAGE_SIZE = 10; // how many vendors to load at a time

const VendorCardList: React.FC<Props> = ({ selectedCategory, onScroll }) => {
  const [visibleVendors, setVisibleVendors] = useState<Vendor[]>([]);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  // Filter vendors according to category
  const filteredVendors =
    selectedCategory === "All"
      ? allVendors
      : allVendors.filter((v) => v.category === selectedCategory);

  // Initial load
  useEffect(() => {
    setPage(1);
    setVisibleVendors(filteredVendors.slice(0, PAGE_SIZE));
  }, [selectedCategory]);

  // Load more vendors when scrolling
  const loadMore = () => {
    if (loadingMore) return;

    if (visibleVendors.length < filteredVendors.length) {
      setLoadingMore(true);

      setTimeout(() => {
        const nextPage = page + 1;
        const newVendors = filteredVendors.slice(0, nextPage * PAGE_SIZE);
        setVisibleVendors(newVendors);
        setPage(nextPage);
        setLoadingMore(false);
      }, 800); // Simulate API delay
    }
  };

  const renderItem = ({ item }: { item: Vendor }) => (
    <LinearGradient colors={["#fff", "#ffe0b2"]} style={styles.card}>
      <View style={styles.imageWrapper}>
        <Image source={item.image} style={styles.image} />
        <View
          style={[
            styles.statusDot,
            { backgroundColor: item.isOnline ? "green" : "gray" },
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
        onPress={() =>
          router.push({
            pathname: "/user/components/connect/vendorConnect",
            params: {
              vendor: JSON.stringify(item),
            },
          })
        }
      >
        <Text style={styles.connectText}>Connect</Text>
      </TouchableOpacity>
    </LinearGradient>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={visibleVendors}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={
          visibleVendors.length === 0
            ? styles.emptyContainer
            : styles.listContent
        }
        columnWrapperStyle={
          visibleVendors.length > 0 ? styles.row : undefined
        }
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
          <Text style={styles.emptyText}>No vendors available.</Text>
        }
      />
    </View>
  );
};

export default VendorCardList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  listContent: {
    padding: cardMargin,
    paddingBottom: 100,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: cardMargin,
  },
  card: {
    width: cardWidth,
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  imageWrapper: {
    alignItems: "center",
    position: "relative",
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
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
  rating: {
    fontSize: 14,
    textAlign: "center",
    color: "#f57c00",
    marginTop: 6,
  },
  connectBtn: {
    marginTop: 10,
    backgroundColor: "#f57c00",
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "center",
    paddingHorizontal: 16,
  },
  connectText: {
    color: "#fff",
    fontWeight: "600",
  },
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
  loadingMore: {
    paddingVertical: 20,
    alignItems: "center",
  },
});
