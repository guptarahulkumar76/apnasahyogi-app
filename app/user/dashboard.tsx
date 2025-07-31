import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Text,
  Platform,
  BackHandler,
  NativeSyntheticEvent,
  NativeScrollEvent,
  StatusBar,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import SearchBar from "./components/ui/searchBar";
import VendorCardList from "./components/ui/vendorList";
import CategorySelector from "./components/ui/categoryList";
import BottomTab from "./components/bottomTab";

export default function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const router = useRouter();

  const scrollY = useRef(new Animated.Value(0)).current;
  const bottomBarAnim = useRef(new Animated.Value(0)).current;

  let currentOffset = 0;

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

  const searchBarTranslateY = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [0, -70],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/*       
        <SearchBar /> */}

      <CategorySelector
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      {/* ✅ Vendor List with Sticky CategorySelector */}
      <VendorCardList
        selectedCategory={selectedCategory}
        onScroll={(e) => {
          scrollY.setValue(e.nativeEvent.contentOffset.y);
          handleScroll(e);
        }}
      />

      <BottomTab bottomBarAnim={bottomBarAnim} from="userDashborad" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  searchBarWrapper: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 16,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,

    // shadow / elevation
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  categorySticky: {
    backgroundColor: "#fff",
    paddingBottom: 8,
    paddingTop: 4,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  bottomTab: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: "#fbf7f2ff",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 4,
  },
  tabSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
  },
  tabLabel: {
    fontSize: 13,
    color: "#3c3c3c",
    fontWeight: "500",
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: "60%",
    backgroundColor: "#e0e0e0",
  },
});
