import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const BottomTab = ({
  bottomBarAnim,
}: {
  bottomBarAnim: Animated.Value;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  // Determine which tab is active
  const isBooking = pathname.includes("/tabs/booking");
  const isConnection = pathname.includes("/tabs/connection");
  const isDashboard = pathname.includes("/user/dashboard") || pathname.includes("/user/components/dashboardSkelton");

  const handleNavigation = (targetPath: string, isActive: boolean) => {
    if (!isActive) {
      router.push(targetPath);
    }
  };

  return (
    <Animated.View
      style={[
        styles.bottomTab,
        {
          transform: [{ translateY: bottomBarAnim }],
          paddingBottom: insets.bottom + 4,
        },
      ]}
    >
      {/* Booking */}
      <TouchableOpacity
        style={styles.tabSection}
        onPress={() => handleNavigation("/tabs/booking", isBooking)}
        activeOpacity={isBooking ? 1 : 0.7}
      >
        <MaterialCommunityIcons
          name={isBooking ? "calendar-check" : "calendar-check-outline"}
          size={24}
          color={isBooking ? "#FF6600" : "#999"}
        />
        <Text style={[styles.tabLabel, isBooking && styles.activeLabel]}>
          Booking
        </Text>
      </TouchableOpacity>

      {/* Dashboard (center) */}
      <TouchableOpacity
        style={[styles.tabSection, styles.centerTab]}
        onPress={() => handleNavigation("/user/dashboard", isDashboard)}
        activeOpacity={isDashboard ? 1 : 0.7}
      >
        <MaterialCommunityIcons
          name={isDashboard ? "home" : "home-outline"}
          size={28}
          color={isDashboard ? "#FF6600" : "#999"}
        />
        <Text style={[styles.tabLabel, isDashboard && styles.activeLabel]}>
          Dashboard
        </Text>
      </TouchableOpacity>

      {/* Connection */}
      <TouchableOpacity
        style={styles.tabSection}
        onPress={() => handleNavigation("/tabs/connection", isConnection)}
        activeOpacity={isConnection ? 1 : 0.7}
      >
        <MaterialCommunityIcons
          name={
            isConnection ? "account-multiple" : "account-multiple-outline"
          }
          size={24}
          color={isConnection ? "#FF6600" : "#999"}
        />
        <Text style={[styles.tabLabel, isConnection && styles.activeLabel]}>
          Connection
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default BottomTab;

const styles = StyleSheet.create({
  bottomTab: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderColor: "#eee",
    zIndex: 100,
    elevation: 10,
    justifyContent: "space-around",
  },
  tabSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
  },
  centerTab: {
    marginHorizontal: 12,
    transform: [{ translateY: -4 }],
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 2,
    color: "#666",
  },
  activeLabel: {
    color: "#FF6600",
    fontWeight: "600",
  },
});
