import React, { useState, useEffect, useRef } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  Platform,
  BackHandler,
  Animated,
  Dimensions,
} from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder-expo";
import { useFocusEffect } from "expo-router";
import Dashboard from "../dashboard";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2; // padding + spacing between cards

export default function AppSkeletonExample() {
  const [isLoading, setIsLoading] = useState(true);
  const scrollY = useRef(new Animated.Value(0)).current;
  const bottomBarAnim = useRef(new Animated.Value(0)).current;

  let currentOffset = 0;

  const handleScroll = (event: any) => {
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

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (Platform.OS === "android") {
          BackHandler.exitApp();
          return true;
        }
        return false;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );
      return () => subscription.remove();
    }, [])
  );

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <ScrollView style={{ flex: 1 }} scrollEnabled={false}>
          <SkeletonPlaceholder backgroundColor="#f2f2f2" highlightColor="#ffffff">
            <View style={{ padding: 16 }}>

              {/* Category Selector */}
              <View style={styles.categoryContainer}>
                {[...Array(5)].map((_, index) => (
                  <View key={index} style={styles.categoryCircle} />
                ))}
              </View>

              {/* Vendor Cards Grid */}
              <View style={styles.cardGrid}>
                {[...Array(6)].map((_, index) => (
                  <View key={index} style={styles.vendorCard}>
                    <View style={styles.avatarWrapper}>
                      <View style={styles.avatar} />
                      <View style={styles.statusDot} />
                    </View>
                    <View style={styles.textLineShort} />
                    <View style={styles.textLineSmaller} />
                    <View style={styles.ratingLine} />
                    <View style={styles.button} />
                  </View>
                ))}
              </View>
            </View>
          </SkeletonPlaceholder>

          {/* Bottom Tab */}
          <SkeletonPlaceholder backgroundColor="#fbf7f2">
            <View style={styles.bottomTab} />
          </SkeletonPlaceholder>
        </ScrollView>
      </View>
    );
  }

  return <Dashboard />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  searchBar: {
    height: 45,
    borderRadius: 10,
    marginBottom: 20,
    width: "100%",
  },
  categoryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  categoryCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  cardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  vendorCard: {
    width: CARD_WIDTH,
    height: 200,
    borderRadius: 16,
    marginBottom: 16,
    padding: 12,
  },
  avatarWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignSelf: "center",
    marginBottom: 10,
  },
  statusDot: {
    position: "absolute",
    bottom: 6,
    right: width > 360 ? 16 : 10,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  textLineShort: {
    height: 12,
    width: "70%",
    borderRadius: 6,
    marginBottom: 6,
    alignSelf: "center",
  },
  textLineSmaller: {
    height: 10,
    width: "50%",
    borderRadius: 5,
    marginBottom: 6,
    alignSelf: "center",
  },
  ratingLine: {
    height: 10,
    width: 30,
    borderRadius: 5,
    alignSelf: "center",
    marginBottom: 12,
  },
  button: {
    height: 28,
    width: 80,
    borderRadius: 14,
    alignSelf: "center",
  },
  bottomTab: {
    height: 60,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    marginTop: 20,
  },
});
