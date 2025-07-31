import { StyleSheet, View, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import i18n from "../lib/i18n"; // Adjust path if needed

export default function MainLayout() {
  useEffect(() => {
    (async () => {
      const lang = await AsyncStorage.getItem("language");
      const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");

      console.log("Selected language:", lang);
      console.log("User logged in:", isLoggedIn);

      if (!lang) {
        router.replace("/language/select");
      } else {
        await i18n.changeLanguage(lang);

        if (isLoggedIn === "true") {
          router.replace("/user/dashboard");
        } else {
          router.replace("/mainscreen/OnboardingScreen");
        }
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007aff" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
});
