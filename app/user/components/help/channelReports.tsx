import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const ChannelReports = () => {
  return (
    <LinearGradient colors={["#fff6ee", "#ffe6cc"]} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        

        <LinearGradient colors={["#fff", "#ffeedd"]} style={styles.card}>
          <Text style={styles.text}>
            If you face any issues with vendors or users, report them here.
            {"\n\n"}Please ensure your report contains:
          </Text>

          <Text style={styles.text}>• Booking ID</Text>
          <Text style={styles.text}>• Vendor/User name</Text>
          <Text style={styles.text}>• Description of the issue</Text>
          <Text style={styles.text}>• Any supporting photos or documents</Text>

          <TouchableOpacity onPress={() => Linking.openURL("mailto:report@apnasahyogi.com")}>
            <Text style={styles.link}>Send via email: report@apnasahyogi.com</Text>
          </TouchableOpacity>
        </LinearGradient>

        <LinearGradient colors={["#fff", "#ffeedd"]} style={styles.card}>
          <Text style={styles.sectionHeader}>What Happens Next?</Text>
          <Text style={styles.text}>
            • Our team will review the report within 24 hours.{"\n"}
            • Necessary actions will be taken to resolve the issue.{"\n"}
            • You will be notified via email or phone call.
          </Text>
        </LinearGradient>
      </ScrollView>
    </LinearGradient>
  );
};

export default ChannelReports;

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
  sectionHeader: { fontSize: 20, fontWeight: "700", color: "#ff7900", marginBottom: 10 },
  text: { fontSize: 16, color: "#333", lineHeight: 24, marginBottom: 5 },
  link: { fontSize: 16, color: "#ff7900", fontWeight: "600", marginTop: 10, textDecorationLine: "underline" },
});
