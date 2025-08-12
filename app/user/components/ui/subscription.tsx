import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const plans = [
  {
    name: 'Basic',
    price: '₹49 / month',
    features: ['Listed in search', 'Limited leads', 'Basic support'],
  },
  {
    name: 'Premium',
    price: '₹199 / month',
    features: [
      'Top placement in search',
      'Unlimited leads',
      'Priority support',
      'Verified badge',
    ],
  },
];

export default function SubscriptionScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#f57c00', '#fb8c00']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.headerTitle}>ApnaSahyogi Subscription</Text>
        <Text style={styles.headerSubtitle}>
          Get more visibility and connect with more customers
        </Text>
      </LinearGradient>

      {/* Plans */}
      <View style={styles.planSection}>
        {plans.map((plan, index) => (
          <View key={index} style={styles.planCard}>
            <Text style={styles.planTitle}>{plan.name}</Text>
            <Text style={styles.planPrice}>{plan.price}</Text>
            <View style={styles.featuresList}>
              {plan.features.map((feature, idx) => (
                <View key={idx} style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={18} color="#f57c00" />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity style={styles.subscribeBtn}>
              <Text style={styles.subscribeBtnText}>Subscribe Now</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF7F0',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    marginTop: 8,
  },
  planSection: {
    padding: 20,
  },
  planCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 4,
  },
  planTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#f57c00',
  },
  planPrice: {
    fontSize: 16,
    fontWeight: '500',
    color: '#444',
    marginVertical: 8,
  },
  featuresList: {
    marginTop: 10,
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },
  subscribeBtn: {
    backgroundColor: '#f57c00',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  subscribeBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
