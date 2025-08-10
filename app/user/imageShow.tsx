import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Share,
  Alert,
  Platform,
  StatusBar,
  FlatList,
  ListRenderItemInfo,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Feather, Ionicons, MaterialIcons, Entypo } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

type ProfileOption = {
  id: string;
  icon: string;
  label: string;
  iconSet: "Feather" | "Ionicons" | "MaterialIcons" | "Entypo" | "none";
};

// Profile options
const rawOptions: ProfileOption[] = [
  { id: "1", icon: "users", label: "Your Connections", iconSet: "Feather" },
  {
    id: "2",
    icon: "bookmark-outline",
    label: "Your Bookings",
    iconSet: "Ionicons",
  },
  {
    id: "3",
    icon: "subscriptions",
    label: "Subscription",
    iconSet: "MaterialIcons",
  },
  { id: "4", icon: "language", label: "Language", iconSet: "MaterialIcons" },
  { id: "5", icon: "help-circle", label: "Help", iconSet: "Feather" },
  { id: "6", icon: "log-out", label: "Log Out", iconSet: "Feather" },
];

const profileOptions: ProfileOption[] = [];
profileOptions.push({
  id: "divider-initial",
  icon: "",
  label: "__divider__",
  iconSet: "none",
});
rawOptions.forEach((item, index) => {
  profileOptions.push(item);
  const isLogOut = item.label === "Log Out";
  if ((index + 1) % 2 === 0 && !isLogOut) {
    profileOptions.push({
      id: `divider-${index}`,
      icon: "",
      label: "__divider__",
      iconSet: "none",
    });
  }
  if (isLogOut) {
    profileOptions.push({
      id: `divider-logout`,
      icon: "",
      label: "__divider__",
      iconSet: "none",
    });
  }
});

// Icon mapping
const getIcon = (item: ProfileOption) => {
  switch (item.iconSet) {
    case "Feather":
      return <Feather name={item.icon as any} size={22} color="#ff7900" />;
    case "Ionicons":
      return <Ionicons name={item.icon as any} size={22} color="#ff7900" />;
    case "MaterialIcons":
      return (
        <MaterialIcons name={item.icon as any} size={22} color="#ff7900" />
      );
    case "Entypo":
      return <Entypo name={item.icon as any} size={22} color="#ff7900" />;
    default:
      return null;
  }
};

// Main Component
const Profile = () => {
  const router = useRouter();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [isImageView, setIsImageView] = useState(false);

  // Load profile data
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const vendorJson = await AsyncStorage.getItem("vendorData");
        const userJson = await AsyncStorage.getItem("userData");
        const parsedData = vendorJson
          ? JSON.parse(vendorJson)
          : userJson
          ? JSON.parse(userJson)
          : null;
        if (parsedData) {
          setUserData(parsedData);
          if (parsedData.profileImageUrl)
            setImageUri(parsedData.profileImageUrl);
        }
      } catch (error) {
        console.log("Error loading profile data:", error);
      }
    };
    loadUserData();
  }, []);

  // Logout
  const handleLogout = async () => {
    await AsyncStorage.setItem("isLoggedIn", "false");
    router.replace("/mainscreen/OnboardingScreen");
  };

  // Profile option press
  const handleOptionPress = async (item: ProfileOption) => {
    if (isNavigating) return;
    setIsNavigating(true);
    switch (item.label) {
      case "Your Connections":
        router.push("/tabs/connection");
        break;
      case "Your Bookings":
        router.push("/tabs/booking");
        break;
      case "Subscription":
        router.push("/user/components/ui/subscription");
        break;
      case "Help":
        router.push("/user/components/ui/help");
        break;
      case "Language":
        router.push("/user/components/ui/language");
        break;
      case "Log Out":
        handleLogout();
        break;
    }
    setTimeout(() => setIsNavigating(false), 500);
  };

  // Pick image
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.6,
    });
    if (!result.canceled && result.assets.length > 0)
      setImageUri(result.assets[0].uri);
  };

  // Render each option
  const renderItem = ({ item }: ListRenderItemInfo<ProfileOption>) => {
    if (item.label === "__divider__")
      return <View key={item.id} style={styles.divider} />;
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.optionRow}
        onPress={() => handleOptionPress(item)}
      >
        {getIcon(item)}
        <Text style={styles.optionText}>{item.label}</Text>
        <Feather
          name="chevron-right"
          size={20}
          color="#999"
          style={{ marginLeft: "auto" }}
        />
      </TouchableOpacity>
    );
  };

  // ImageView full-screen component
  const ImageView = () => {
    const handleShare = async () => {
      try {
        await Share.share({ message: "Check out this profile image!" });
      } catch (error) {
        Alert.alert("Share failed", (error as Error).message);
      }
    };
    return (
      <View style={styles.imageViewContainer}>
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.iconWrapper}
            onPress={() => setIsImageView(false)}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconWrapper} onPress={handleShare}>
            <Feather name="share-2" size={22} color="white" />
          </TouchableOpacity>
        </View>
        <Image
          source={{ uri: imageUri! }}
          style={styles.fullImage}
          resizeMode="contain"
        />
      </View>
    );
  };

  // If ImageView mode, show full-screen
  if (isImageView && imageUri) return <ImageView />;

  return (
    <View style={styles.container}>
      <View style={styles.profileCard}>
        <View style={styles.imageWrapper}>
          <TouchableOpacity onPress={() => setIsImageView(true)}>
            <Image
              source={
                imageUri
                  ? { uri: imageUri }
                  : require("../../assets/images/icon.png")
              }
              style={styles.profileImage}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.cameraIcon} onPress={pickImage}>
            <Feather name="camera" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.name}>{userData?.name || "No Name"}</Text>
          <Text style={styles.email}>{userData?.mobile || "No Phone"}</Text>
        </View>
      </View>

      <FlatList
        data={profileOptions}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 10 }}
      />

      <Text style={styles.footer}>App Version 1.0</Text>
    </View>
  );
};

export default Profile;

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fffaf5",
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 1,
  },
  imageWrapper: { position: "relative", marginLeft: 15 },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 25,
    backgroundColor: "#ffcc99",
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#ff7900",
    borderRadius: 12,
    padding: 4,
    borderWidth: 2,
    borderColor: "#fff",
  },
  profileInfo: { marginLeft: 16, flex: 1, justifyContent: "center" },
  name: { fontSize: 18, fontWeight: "600", color: "#333", marginLeft: 65 },
  email: { fontSize: 15, color: "#666", marginVertical: 3, marginLeft: 60 },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  optionText: { fontSize: 15, marginLeft: 15, color: "#333" },
  divider: { height: 1, backgroundColor: "#fcd9b6", marginVertical: 6 },
  footer: {
    textAlign: "center",
    fontSize: 12,
    color: "#aaa",
    marginTop: 1,
    marginBottom: 95,
  },
  // Full screen image styles
  imageViewContainer: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: { width: width, height: height },
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
});
