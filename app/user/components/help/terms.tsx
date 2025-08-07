import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const termsList = [
  "Respect all vendors and users on the platform.",
  "No misuse of services or fake bookings.",
  "ApnaSahyogi is not liable for the quality or conduct of third-party vendors.",
  "All bookings are subject to availability.",
  "Cancellation charges may apply depending on the vendor's policy.",
  "Your personal data is protected in accordance with our privacy policy.",
  "We reserve the right to suspend accounts in case of suspicious activity.",
];

const Terms = () => {
  return (
    <LinearGradient colors={["#fff6ee", "#ffe6cc"]} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        

        <LinearGradient colors={["#fff", "#ffeedd"]} style={styles.card}>
          {termsList.map((term, index) => (
            <Text key={index} style={styles.text}>• {term}</Text>
          ))}

          <TouchableOpacity onPress={() => Linking.openURL("https://www.apnasahyogi.com/terms-and-conditions")}>
            <Text style={styles.link}>Read full terms here</Text>
          </TouchableOpacity>
        </LinearGradient>
      </ScrollView>
    </LinearGradient>
  );
};

export default Terms;

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 30 },
  header: { fontSize: 26, fontWeight: "700", color: "#ff7900", marginBottom: 16, textAlign: "center" },
  card: {
    borderRadius: 14,
    padding: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 6,
  },
  text: { fontSize: 16, color: "#333", lineHeight: 24, marginBottom: 6 },
  link: { fontSize: 16, color: "#ff7900", fontWeight: "600", marginTop: 10, textDecorationLine: "underline" },
});
