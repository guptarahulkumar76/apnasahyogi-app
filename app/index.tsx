import { StyleSheet, View, Text, Animated } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useRef, useState } from "react";

export default function MainLayout() {
  const [loading, setLoading] = useState(true); // splash visible jab tak async check ho raha hai

  const fadeAnim = useRef(new Animated.Value(0)).current; // opacity
  const scaleAnim = useRef(new Animated.Value(0.8)).current; // zoom effect
  const pulseAnim = useRef(new Animated.Value(1)).current; // pulse effect

  useEffect(() => {
    // Text animation (fade + scale)
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 90,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse loop for branding effect
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Async check for login status
    const checkLogin = async () => {
      const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");
      console.log("User logged in:", isLoggedIn);

      if (isLoggedIn === "true") {
        router.replace("/user/components/dashboardSkelton");
      } else {
        router.replace("/mainscreen/OnboardingScreen");
      }
      setLoading(false); // check done → splash hata do
    };

    checkLogin();
  }, []);

  if (loading) {
    // Jab tak check chal raha hai → splash screen
    return (
      <View style={styles.container}>
        <Animated.Text
          style={[
            styles.title,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }, { scale: pulseAnim }],
            },
          ]}
        >
          Apna Sahyogi
        </Animated.Text>
        <Text style={styles.tagline}>
          Connecting People • Empowering Business
        </Text>
      </View>
    );
  }

  return null; // splash ke baad turant router.replace ho jaayega
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white", // white theme background
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FF6600", // orange brand color
    letterSpacing: 2,
  },
  tagline: {
    marginTop: 12,
    fontSize: 14,
    color: "#555", // subtle gray for secondary text
    fontStyle: "italic",
  },
});
