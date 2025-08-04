import { StyleSheet, View } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import DashboardSkeleton from "./user/components/dashboardSkelton";
import OnboardingScreen from "./mainscreen/OnboardingScreen";

export default function MainLayout() {
  const [loading, setLoading] = useState(true); // for 2 sec skeleton

  useEffect(() => {
    const timer = setTimeout(async () => {
      const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");
      console.log("User logged in:", isLoggedIn);

      if (isLoggedIn === "true") {
        router.replace("/user/components/dashboardSkelton");
      } else {
        router.replace("/mainscreen/OnboardingScreen");
      }
    }, 500); // wait 2 seconds before checking login

    return () => clearTimeout(timer); // cleanup
  }, []);

  return (
    <View style={styles.whiteScreen}>
      {/* White skeleton loading screen for 2 seconds */}
    </View>
  );
}

const styles = StyleSheet.create({
  whiteScreen: {
    flex: 1,
    backgroundColor: "white",
  },
});
