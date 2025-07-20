import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function BookingConfirmation() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Ionicons name="checkmark-circle" size={100} color="#00c851" />
      <Text style={styles.title}>CONGRATS!</Text>
      <Text style={styles.subtitle}>YOU BOOKED 🎉</Text>

      <Text style={styles.description}>
        Your booking has been successfully placed. The vendor will contact you
        shortly.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace("/")}
      >
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffedddff",

    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 45,
    fontWeight: "bold",
    color: "#ff5722",
    marginTop: 16,
  },
  subtitle: {
    fontSize: 28,
    fontWeight: "600",
    color: "#444",
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginVertical: 20,
  },
  button: {
    backgroundColor: "#ff5722",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 30,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});
