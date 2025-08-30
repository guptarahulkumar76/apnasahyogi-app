import React, {useEffect, useState} from "react";
import { View, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ProfileButtonProps = {
  imageUrl?: string;
};

export default function ProfileButton({ imageUrl }: ProfileButtonProps) {
  const router = useRouter();
  const [imageUri, setImageUri] = useState<string | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const vendorJson = await AsyncStorage.getItem("vendorData");
        const userJson = await AsyncStorage.getItem("userData");
        const parsedData = vendorJson ? JSON.parse(vendorJson) : userJson ? JSON.parse(userJson) : null;
        if (parsedData) {
          
          if (parsedData.profileImageUrl) setImageUri(parsedData.profileImageUrl);
        }
      } catch (error) { console.log("Error loading profile image:", error); }
    };
    loadUserData();
  }, []);

  return (
    <TouchableOpacity
      style={styles.iconWrapper}
      onPress={() => router.push("/user/profile")}
    >
      <View style={styles.iconCircle}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.profileImage} />
        ) : (
          <Image
            source={require("../../../../assets/images/electrician.png")} // fallback image if no URL provided
            style={styles.profileImage}
          />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    marginLeft: 12,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#fff0e0",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f57c00",
    overflow: "hidden",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
    resizeMode: "cover",
  },
});
