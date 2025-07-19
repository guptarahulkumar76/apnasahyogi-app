import React, { useState } from "react";
import { View, StyleSheet, BackHandler, Platform } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import SearchBar from "./components/ui/searchBar";
import VendorCardList from "./components/ui/vendorList";
import CategorySelector from "./components/ui/categoryList";

export default function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Exit app on Android back button
 useFocusEffect(
  React.useCallback(() => {
    const onBackPress = () => {
      if (Platform.OS === 'android') {
        BackHandler.exitApp(); // 👈 exits the app
        return true;
      }
      return false;
    };

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress
    );

    return () => subscription.remove(); // ✅ Modern way to clean up
  }, [])
);

  return (
    <>
      <View style={styles.fixedHeader}>
        <SearchBar />
        <CategorySelector
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </View>
      <VendorCardList selectedCategory={selectedCategory} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  fixedHeader: {
    backgroundColor: "#fff",
    paddingBottom: 2,
    zIndex: 100,
  },
});
