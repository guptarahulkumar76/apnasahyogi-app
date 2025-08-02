import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Constants from "expo-constants";
import { callApi } from "../../../../utils/api"; // Adjust path if needed

const API_BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl ?? "";

interface Category {
  id: string;
  name: string;
  iconUrl?: string;
}

interface Props {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

// Explicit type for image map
type IconMap = Record<string, ReturnType<typeof require>>;

const categoryIconMap: IconMap = {
  'plumber.jpg': require('../../../../assets/images/plumber.jpg'),
  'electrician.jpg': require('../../../../assets/images/electrician.jpg'),
  'welder.jpg': require('../../../../assets/images/welder.jpg'),
  'carpenter.jpg': require('../../../../assets/images/plumber.jpg'),
  'painter.jpg': require('../../../../assets/images/plumber.jpg'),
  'caterer.jpg': require('../../../../assets/images/plumber.jpg'),
};

const getLocalIcon = (iconUrl: string) => {
  return categoryIconMap[iconUrl] || require('../../../../assets/images/icon.png');
};

const CategorySelector: React.FC<Props> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await callApi("/user/categories", {
          method: "GET",
        });

        console.log("Categories fetched:", response);

        const categoryList = Array.isArray(response) ? response : [];
        setCategories([{ id: "0", name: "All" }, ...categoryList]);
      } catch (error: any) {
        console.error("Fetching categories failed:", error.message);
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
      <View>
        <LinearGradient
          colors={["#fff3e0", "#ffe0b2"]}
          style={styles.gradientBackground}
        >
          
            {loading ? (
              <ActivityIndicator size="large" color="#ff9800" />
            ) : (
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
                        <Image
                          source={getLocalIcon(item.iconUrl || "")}
                          style={styles.icon}
                        />
                      </View>
                      <Text
                        style={[styles.name, isSelected && styles.selectedText]}
                      >
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
              />
            )}
         
        </LinearGradient>
        <View style={styles.separatorLine} />
      </View>
  );
};

const CARD_SIZE = Dimensions.get("window").width / 4.2;

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
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
