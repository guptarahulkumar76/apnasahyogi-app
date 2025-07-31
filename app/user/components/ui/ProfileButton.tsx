// components/ProfileButton.tsx
import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function ProfileButton() {
  const router = useRouter();

  return (
    <TouchableOpacity style={styles.iconWrapper} onPress={() => router.push("/user/profile")}>
      <View style={styles.iconCircle}>
        <Feather name="user" size={18} color="#f57c00" />
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
  },
});
