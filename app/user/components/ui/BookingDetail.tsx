import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';

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

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
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
        <Text style={styles.sectionValue}>{'★'.repeat(rating)}{'☆'.repeat(5 - rating)}</Text>
      </View>

      <View style={styles.sectionBox}>
        <Text style={styles.sectionTitle}>💬 Feedback</Text>
        <Text style={styles.sectionValue}>{feedback}</Text>
      </View>

      <View style={styles.sectionBox}>
        <Text style={styles.sectionTitle}>🧾 Invoice Summary</Text>
        <Text style={styles.sectionValue}>
          • Visit Charges: ₹{invoice.visit}{"\n"}
          • Labor Charges: ₹{invoice.labor}{"\n"}
          • Total: ₹{invoice.total}
        </Text>
      </View>

      <TouchableOpacity style={styles.contactButton}>
        <Text style={styles.contactText}>📞 Contact</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// 🔷 Reusable Row Component
const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.detailRow}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

export default BookingDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    padding: 10,
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
  status: (status) => ({
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
    backgroundColor: '#fff3e0', // light orange box
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
  contactButton: {
    backgroundColor: '#f57c00',
    padding: 14,
    borderRadius: 8,
    marginTop: 30,
    alignItems: 'center',
  },
  contactText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
