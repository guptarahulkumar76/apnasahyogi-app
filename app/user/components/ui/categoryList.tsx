import React from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const categories = [
  { id: "0", name: "All", icon: require("../../../../assets/images/icon.png") },
  {
    id: "1",
    name: "Plumber",
    icon: require("../../../../assets/images/plumber.jpg"),
  },
  {
    id: "2",
    name: "Electrician",
    icon: require("../../../../assets/images/electrician.jpg"),
  },
  {
    id: "3",
    name: "Labour",
    icon: require("../../../../assets/images/welder.jpg"),
  },
  {
    id: "4",
    name: "Carpenter",
    icon: require("../../../../assets/images/plumber.jpg"),
  },
  {
    id: "5",
    name: "Painter",
    icon: require("../../../../assets/images/plumber.jpg"),
  },
  {
    id: "6",
    name: "Caterer",
    icon: require("../../../../assets/images/plumber.jpg"),
  },
];

interface Props {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategorySelector: React.FC<Props> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <View>
      <LinearGradient
        colors={["#fff3e0", "#ffe0b2"]}
        style={styles.gradientBackground}
      >
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => {
            const isSelected = selectedCategory === item.name;
            return (
              <TouchableOpacity
                style={[styles.card, isSelected && styles.selectedCard]}
                onPress={() => onSelectCategory(item.name)}
              >
                <View style={styles.iconWrapper}>
                  <Image source={item.icon} style={styles.icon} />
                </View>
                <Text style={[styles.name, isSelected && styles.selectedText]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </LinearGradient>
      <View style={styles.separatorLine} />
    </View>
  );
};

const CARD_SIZE = Dimensions.get("window").width / 4.2;

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  card: {
    alignItems: "center",
    marginHorizontal: 8,
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 1, height: 2 },
    shadowRadius: 6,
    width: CARD_SIZE,
    borderWidth: 1,
    borderColor: "#fff",
  },
  selectedCard: {
    borderColor: "#ff9800",
    borderWidth: 2,
    backgroundColor: "#fffaf0",
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 999,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#ff9800",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  icon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    resizeMode: "cover",
  },
  name: {
    fontSize: 13,
    fontWeight: "600",
    color: "#555",
    textAlign: "center",
  },
  selectedText: {
    color: "#ff9800",
    fontWeight: "700",
  },
  gradientBackground: {
    borderRadius: 0,
  },
  separatorLine: {
    height: 6,
    backgroundColor: "#fff",
    width: "100%",
  },
});

export default CategorySelector;
