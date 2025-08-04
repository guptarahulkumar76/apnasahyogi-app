import React, { useRef } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";

export default function NotificationButton() {
  const router = useRouter();
  const pathname = usePathname();
  const lastTap = useRef(0);

  const unreadCount = 3;

  const handlePress = () => {
    const now = Date.now();
    if (now - lastTap.current < 800) return; // debounce multiple taps
    lastTap.current = now;

    if (pathname !== "/user/notification") {
      router.push("/user/notification"); // ✅ back button will work
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Feather name="bell" size={24} color="#f57c00" />
      {unreadCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 6,
    marginLeft: 12,
  },
  badge: {
    position: "absolute",
    right: 2,
    top: 2,
    backgroundColor: "red",
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
});
