import React, { useEffect, useState } from "react";
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
import Constants from "expo-constants";
import { callApi } from "../../../../utils/api";
import { Skeleton } from "moti/skeleton";

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

type IconMap = Record<string, ReturnType<typeof require>>;

const categoryIconMap: IconMap = {
  'plumber.png': require('../../../../assets/images/plumber.png'),
  'electrician.png': require('../../../../assets/images/electrician.png'),
  'welder.jpg': require('../../../../assets/images/welder.jpg'),
  'carpenter.png': require('../../../../assets/images/carpenter.png'),
  'painter.png': require('../../../../assets/images/painter.png'),
  'caterer.png': require('../../../../assets/images/caterer.png'),
  'labour.png': require('../../../../assets/images/labour.png'),
};

const getLocalIcon = (iconUrl: string) => {
  return categoryIconMap[iconUrl] || require("../../../../assets/images/icon.png");
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

      const categoryList = Array.isArray(response?.data) ? response.data : [];
      setCategories([{ id: "0", name: "All" }, ...categoryList]);
    } catch (error: any) {
      console.error("Fetching categories failed:", error.message);
      alert(error.message);
    } finally {
      setLoading(false)
    }
  };
  // setCategories([
  //   { id: "0", name: "All", iconUrl: "icon.png" },
  //   { id: "1", name: "Labour", iconUrl: "labour.png" },
  //   { id: "2", name: "Plumber", iconUrl: "plumber.png" },
  //   { id: "3", name: "Electrician", iconUrl: "electrician.png" },
  //   { id: "4", name: "Carpenter", iconUrl: "carpenter.png" }, 
  //   { id: "5", name: "Painter", iconUrl: "painter.png" }, 
  //   { id: "6", name: "Caterer", iconUrl: "caterer.png" },
  //   { id: "7", name: "Welder", iconUrl: "welder.jpg" }
  // ]);
  // setLoading(false)

  fetchCategories();
}, []);


  const renderSkeletonItem = (_: any, index: number) => (
    <View key={index} style={styles.itemContainer}>
      <Skeleton
        radius="round"
        width={64}
        height={64}
        colorMode="light"
        transition={{ type: "timing" }}
      />
      <Skeleton
        width={50}
        height={12}
        radius={6}
        colorMode="light"
        style={{ marginTop: 8 }}
      />
    </View>
  );

  return (
    <View>
      <LinearGradient
        colors={["#fff3e0", "#ffe0b2"]}
        style={styles.gradientBackground}
      >
        {loading ? (
          <View style={styles.listContainer}>
            {[...Array(6)].map(renderSkeletonItem)}
          </View>
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
                  style={styles.itemContainer}
                  onPress={() => onSelectCategory(item.name)}
                >
                  <View
                    style={[
                      styles.iconWrapper,
                      isSelected && styles.selectedBorder,
                    ]}
                  >
                    <Image source={getLocalIcon(item.iconUrl || "")} style={styles.icon} />
                  </View>
                  <Text
                    style={[styles.label, isSelected && styles.selectedText]}
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

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
  },
  itemContainer: {
    alignItems: "center",
    marginHorizontal: 8,
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedBorder: {
    borderColor: "#ff9800",
  },
  icon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    resizeMode: "cover",
  },
  label: {
    marginTop: 6,
    fontSize: 13,
    color: "#444",
  },
  selectedText: {
    color: "#ff9800",
    fontWeight: "600",
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
