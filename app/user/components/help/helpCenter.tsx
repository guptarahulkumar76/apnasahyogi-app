// Updated HelpCenter.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

// Enable LayoutAnimation on Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const faqs = [
  { id: 1, question: "How can I book a plumber or electrician?", answer: "Open the app, browse vendors by category, and click “Book Now.”" },
  { id: 2, question: "How do I cancel or reschedule a booking?", answer: "Go to ‘My Bookings’ and select the service you want to modify." },
  { id: 3, question: "Is there customer support for vendors?", answer: "Yes! Vendors can also reach out for payment, profile, or booking-related queries." },
];

const HelpCenter = () => {
  const [expandedFaqs, setExpandedFaqs] = useState<number[]>([]);

  const toggleFaq = (id: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (expandedFaqs.includes(id)) {
      setExpandedFaqs(expandedFaqs.filter(faqId => faqId !== id));
    } else {
      setExpandedFaqs([...expandedFaqs, id]);
    }
  };

  return (
    <LinearGradient colors={["#fff6ee", "#ffe6cc"]} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        

        <LinearGradient colors={["#fff", "#ffeedd"]} style={styles.card}>
          <Text style={styles.text}>
            Welcome to the ApnaSahyogi Help Center! We are here to assist you with all your queries and support needs.
          </Text>
        </LinearGradient>

        <LinearGradient colors={["#fff", "#ffeedd"]} style={styles.card}>
          <Text style={styles.sectionTitle}>📞 Contact Us</Text>
          <Text style={styles.text}>Need help? Reach us at:</Text>
          <TouchableOpacity onPress={() => Linking.openURL("mailto:support@apnasahyogi.com")}>
            <Text style={styles.link}>📧 support@apnasahyogi.com</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL("tel:+919876543210")}>
            <Text style={styles.link}>📱 +91 98765 43210</Text>
          </TouchableOpacity>
          <Text style={styles.text}>We’re available 24/7 to assist you.</Text>
        </LinearGradient>

        <LinearGradient colors={["#fff", "#ffeedd"]} style={styles.card}>
          <Text style={styles.sectionTitle}>❓ FAQs</Text>
          {faqs.map(faq => {
            const isExpanded = expandedFaqs.includes(faq.id);
            return (
              <View key={faq.id} style={styles.faqItem}>
                <TouchableOpacity style={styles.faqHeader} onPress={() => toggleFaq(faq.id)}>
                  <Text style={styles.faqQuestion}>{faq.question}</Text>
                  <Text style={styles.arrow}>{isExpanded ? "▲" : "▼"}</Text>
                </TouchableOpacity>
                {isExpanded && (
                  <View style={styles.faqAnswerContainer}>
                    <Text style={styles.faqAnswer}>{faq.answer}</Text>
                  </View>
                )}
              </View>
            );
          })}
        </LinearGradient>
      </ScrollView>
    </LinearGradient>
  );
};

export default HelpCenter;

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
  sectionTitle: { fontSize: 20, fontWeight: "700", color: "#ff7900", marginBottom: 10 },
  text: { fontSize: 16, color: "#333", lineHeight: 22, marginBottom: 5 },
  link: { fontSize: 16, color: "#ff7900", fontWeight: "600", marginVertical: 2, textDecorationLine: "underline" },
  faqItem: { marginTop: 10, borderRadius: 10, overflow: "hidden", backgroundColor: "#fff" },
  faqHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 10, paddingHorizontal: 10 },
  faqQuestion: { fontSize: 16, color: "#333", flex: 1, lineHeight: 22 },
  arrow: { fontSize: 18, color: "#ff7900", fontWeight: "700" },
  faqAnswerContainer: { paddingHorizontal: 10, paddingBottom: 10 },
  faqAnswer: { fontSize: 15, color: "#555", lineHeight: 20 },
});
