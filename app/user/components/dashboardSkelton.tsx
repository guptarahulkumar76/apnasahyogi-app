import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  Dimensions,
} from "react-native";
import { Skeleton } from "moti/skeleton";
import Dashboard from "../dashboard"; // or adjust the path to your actual Dashboard component

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2;

const DashboardSkeleton = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Simulated loading

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) {
    return <Dashboard />;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView
        style={{ flex: 1 }}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {/* Categories */}
        <View style={styles.categoryRow}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton
              key={i}
              width={60}
              height={60}
              radius={30}
              colorMode="light"
              transition={{ type: "timing" }}
            />
          ))}
        </View>

        {/* Vendor Cards */}
        <View style={styles.cardGrid}>
          {Array.from({ length: 6 }).map((_, index) => (
            <View key={index} style={styles.vendorCard}>
              {/* Image and Status Dot */}
              <View style={styles.avatarSection}>
                <Skeleton
                  width={60}
                  height={60}
                  radius={30}
                  colorMode="light"
                />
                {/* <Skeleton
                  width={10}
                  height={10}
                  radius={5}
                  colorMode="light"
                  style={styles.statusDot}
                /> */}
              </View>

              {/* Text Lines */}
              {/* Text Lines */}
              <View style={styles.textBlock}>
                <Skeleton
                  width="80%"
                  height={12}
                  radius={4}
                  colorMode="light"
                  style={styles.skeletonLine}
                />
                <Skeleton
                  width="50%"
                  height={10}
                  radius={4}
                  colorMode="light"
                  style={[styles.skeletonLine, { marginTop: 6 }]} // spacing
                />
                <Skeleton
                  width="30%"
                  height={10}
                  radius={4}
                  colorMode="light"
                  style={[styles.skeletonLine, { marginTop: 6 }]} // spacing
                />
              </View>

              {/* Single Button */}
              <View style={styles.singleButtonWrapper}>
                <Skeleton
                  width="40%"
                  height={26}
                  radius={6}
                  colorMode="light"
                />
              </View>
            </View>
          ))}
        </View>

        {/* Bottom Navigation Placeholder */}
        <View style={{ marginTop: 24 }}>
          <Skeleton
            width="100%"
            height={60}
            radius={16}
            colorMode="light"
            style={styles.bottomTab}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default DashboardSkeleton;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },
  categoryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  cardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  vendorCard: {
    width: CARD_WIDTH,
    backgroundColor: "#FFF1DE",
    borderRadius: 16,
    padding: 16, // Increased from 12 to 16
    marginBottom: 20, // Slightly more spacing below
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    minHeight: 220, // Added fixed minimum height
  },
  avatarSection: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  statusDot: {
    position: "absolute",
    bottom: 6,
    right: 0,
    borderWidth: 2,
    borderColor: "#FFF1DE",
  },
  textBlock: {
    marginTop: 12,
    alignItems: "center",
  },
  skeletonLine: {
    marginTop: 8,
  },
  singleButtonWrapper: {
    alignItems: "center",
    marginTop: 16,
  },
  bottomTab: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
});
