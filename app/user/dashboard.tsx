import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import SearchBar from "./components/ui/searchBar";
import VendorCardList from "./components/ui/vendorList";
import CategorySelector from "./components/ui/categoryList";

export default function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  return (
    <React.Fragment>
      <View style={styles.fixedHeader}>
        <SearchBar />
        <CategorySelector
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </View>
      <VendorCardList selectedCategory={selectedCategory} />
    </React.Fragment>
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
  }, // ✅ Yeh comma important tha
});
