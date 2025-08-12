import React from "react";
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Share,
  Alert,
  Platform,
  StatusBar,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default function ImageView() {
  const router = useRouter();
  const { img } = useLocalSearchParams();

  const imageMap: Record<string, any> = {
    electrician: require("../../../../assets/images/electrician.png"),
  };

  const imageSource = imageMap[img as string];

  const handleShare = async () => {
    try {
      await Share.share({
        message: "Check out this vendor's profile image!",
      });
    } catch (error) {
      Alert.alert("Share failed", (error as Error).message);
    }
  };

  const handleEdit = () => {
    Alert.alert("Edit Image", "Image editing functionality coming soon!");
  };

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.iconWrapper}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.rightIcons}>
          <TouchableOpacity style={styles.iconWrapper} onPress={handleShare}>
            <Feather name="share-2" size={22} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconWrapper} onPress={handleEdit}>
            <MaterialIcons name="edit" size={22} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Full Image */}
      <Image
        source={imageSource}
        style={styles.fullImage}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: {
    width: width,
    height: height,
  },
  topBar: {
    position: "absolute",
    top: Platform.OS === "android" ? StatusBar.currentHeight || 20 : 50,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  iconWrapper: {
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 10,
    borderRadius: 50,
    marginHorizontal: 6,
  },
  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
});
