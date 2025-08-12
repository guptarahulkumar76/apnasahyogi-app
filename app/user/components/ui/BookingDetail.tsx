import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  BackHandler,
  Alert,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const BookingDetail = () => {
  const vendorImage = 'https://i.pravatar.cc/150?img=12';
  const vendorName = 'Rajesh Kumar';
  const bookingDate = 'August 5, 2025';
  const bookingTime = '10:00 AM';
  const location = 'Sector 21, Noida';
  const service = 'Plumbing';
  const status = 'Completed';
  const startTime = '10:10 AM';
  const endTime = '10:45 AM';
  const serviceSummary = 'Fixed leaking kitchen sink. Recommended pipe replacement.';
  const rating = 4;
  const feedback = 'Quick and professional service.';
  const invoice = {
    visit: 100,
    labor: 250,
    total: 350,
  };

  useEffect(() => {
    const backAction = () => {
      router.replace('/tabs/booking');
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, []);

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
          <Image source={{ uri: vendorImage }} style={styles.image} />
          <Text style={styles.name}>{vendorName}</Text>
          <Text style={styles.status(status)}>{status}</Text>

          <View style={styles.detailsWrapper}>
            <DetailRow label="📅 Booking Date" value={bookingDate} />
            <DetailRow label="🕙 Booking Time" value={bookingTime} />
            <DetailRow label="📍 Location" value={location} />
            <DetailRow label="🛠️ Service Type" value={service} />
            <DetailRow label="▶️ Service Start" value={startTime} />
            <DetailRow label="✅ Service End" value={endTime} />
          </View>

          <View style={styles.sectionBox}>
            <Text style={styles.sectionTitle}>🔧 Service Summary</Text>
            <Text style={styles.sectionValue}>{serviceSummary}</Text>
          </View>

          <View style={styles.sectionBox}>
            <Text style={styles.sectionTitle}>⭐ User Rating</Text>
            <Text style={styles.sectionValue}>
              {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
            </Text>
          </View>

          <View style={styles.sectionBox}>
            <Text style={styles.sectionTitle}>💬 Feedback</Text>
            <Text style={styles.sectionValue}>{feedback}</Text>
          </View>

          <View style={styles.sectionBox}>
            <Text style={styles.sectionTitle}>🧾 Invoice Summary</Text>
            <Text style={styles.sectionValue}>
              • Visit Charges: ₹{invoice.visit}{'\n'}
              • Labor Charges: ₹{invoice.labor}{'\n'}
              • Total: ₹{invoice.total}
            </Text>
          </View>
        </ScrollView>

        {/* 🔘 Fixed Button Row */}
        <View style={styles.buttonRowFixed}>
          <TouchableOpacity style={styles.button} onPress={() => Alert.alert('Calling...')}>
            <Ionicons name="call" size={18} color="#fff" />
            <Text style={styles.buttonText}>Contact</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.replace('/tabs/booking')}
          >
            <Ionicons name="book" size={18} color="#fff" />
            <Text style={styles.buttonText}>My Bookings</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.detailRow}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

export default BookingDetail;

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    position: 'relative',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 10,
    paddingBottom: 120, // space for fixed buttons
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#222',
  },
  status: (status: string) => ({
    fontSize: 14,
    color: status === 'Completed' ? '#388e3c' : '#f57c00',
    textAlign: 'center',
    marginTop: 4,
    fontWeight: 'bold',
  }),
  detailsWrapper: {
    marginTop: 25,
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  label: {
    fontSize: 15,
    color: '#666',
    width: '50%',
  },
  value: {
    fontSize: 15,
    color: '#111',
    fontWeight: '600',
    width: '50%',
    textAlign: 'right',
  },
  sectionBox: {
    marginTop: 25,
    backgroundColor: '#fff3e0',
    padding: 15,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f57c00',
  },
  sectionValue: {
    fontSize: 15,
    color: '#333',
    marginTop: 6,
    lineHeight: 22,
  },
 buttonRowFixed: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 11, // 👈 Better than marginBottom when using absolute
    left: 0,
    right: 0,
  },
  button: {
    flex: 1,
    backgroundColor: '#f57c00',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
