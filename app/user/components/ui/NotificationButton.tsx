// components/NotificationButton.tsx
import React from "react";
import { TouchableOpacity, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getNotification } from "../../notification";

export default function NotificationButton() {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={{ padding: 6, marginLeft: 12 }}
      onPress={() => {
        const { title, message } = getNotification(
          "JOB_COMPLETED",
          "Ramesh Plumber"
        );
        Alert.alert(title, message);
        router.push("/user/notification");
      }}
    >
      <Feather name="bell" size={20} color="#f57c00" />
    </TouchableOpacity>
  );
}
