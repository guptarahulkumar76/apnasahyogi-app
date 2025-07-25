import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const PoliciesScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Our Policies</Text>

      <Text style={styles.sectionTitle}>1. Booking Policy</Text>
      <Text style={styles.text}>
        Users can book services anytime using the app. Please ensure your contact and location details are accurate at the time of booking.
      </Text>

      <Text style={styles.sectionTitle}>2. Cancellation Policy</Text>
      <Text style={styles.text}>
        You can cancel your booking up to 1 hour before the scheduled time. Frequent cancellations may affect your account status.
      </Text>

      <Text style={styles.sectionTitle}>3. Privacy Policy</Text>
      <Text style={styles.text}>
        We value your privacy. Your personal details are never shared without your consent. For more, refer to our privacy statement.
      </Text>

      <Text style={styles.sectionTitle}>4. Payment Policy</Text>
      <Text style={styles.text}>
        All payments are handled securely. We accept UPI, cards, and cash. Refunds (if any) will be processed within 5–7 business days.
      </Text>

      <Text style={styles.sectionTitle}>5. Terms of Service</Text>
      <Text style={styles.text}>
        By using our app, you agree to follow community guidelines and treat all service providers with respect.
      </Text>

      <Text style={styles.footer}>Last Updated: July 22, 2025</Text>
    </ScrollView>
  );
};

export default PoliciesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF7F0',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FB8C00',
    marginBottom: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 6,
  },
  text: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
  },
  footer: {
    marginTop: 30,
    textAlign: 'center',
    color: '#999',
    fontSize: 13,
  },
});
