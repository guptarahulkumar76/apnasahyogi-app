import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather, MaterialIcons, Octicons, Entypo } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const HelpScreen = () => {
  const router = useRouter(); // ✅ required to navigate

  const helpOptions = [
    {
      id: "1",
      icon: <Feather name="help-circle" size={22} color="#ff7900" />,
      title: "Help Center",
      subtitle: "Get help, contact us",
      route: "/user/components/help/helpCenter",
    },
    {
      id: "2",
      icon: <MaterialIcons name="description" size={22} color="#ff7900" />,
      title: "Terms",
      route: "/user/components/help/terms",
    },
    {
      id: "3",
      icon: <Octicons name="report" size={22} color="#ff7900" />,
      title: "Channel Reports",
      route: "/user/components/help/channelReports",
    },
    {
      id: "4",
      icon: <Entypo name="info" size={22} color="#ff7900" />,
      title: "App Info",
      route: "/user/components/help/appInfo",
    },
  ];

  return (
    <View style={styles.container}>
      {helpOptions.map((item, index) => (
        <View key={item.id}>
          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => router.push(item.route)} // ✅ dynamic routing
          >
            <View style={styles.icon}>{item.icon}</View>
            <View>
              <Text style={styles.title}>{item.title}</Text>
              {item.subtitle && (
                <Text style={styles.subtitle}>{item.subtitle}</Text>
              )}
            </View>
          </TouchableOpacity>

          {/* Divider line */}
          {index !== helpOptions.length - 1 && <View style={styles.divider} />}
        </View>
      ))}
    </View>
  );
};

export default HelpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff6ee",
    paddingHorizontal: 20,
    paddingTop: 25,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },
  icon: {
    marginRight: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  subtitle: {
    fontSize: 13,
    color: "#888",
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: "#fcd9b6",
  },
});
