import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  FlatList,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';

// ------------------- Notification Component -------------------

interface NotificationProps {
  onPress: () => void;
  hasUnread?: boolean;
}

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: NotificationTrigger;
  vendor: string;
}

const Notification: React.FC<NotificationProps> = ({ onPress, hasUnread = false }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(dummyNotifications);
  const [unread, setUnread] = useState(hasUnread);
  const router = useRouter();

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications([]);
    setUnread(false);
  };

  const renderRightActions = (id: string) => (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => handleDelete(id)}
    >
      <Feather name="trash-2" size={20} color="#f57c00" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.wrapper}>
      <View style={styles.content}>
        {/* Header with heading + clear all */}
        <View style={styles.headerRow}>
          <Text style={styles.heading}>Recent Notifications</Text>
          {notifications.length > 0 && (
            <TouchableOpacity style={styles.clearAllBtn} onPress={markAllAsRead}>
              <Text style={styles.clearAllText}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* List */}
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <Text style={{ color: '#888', textAlign: 'center', marginTop: 40 }}>
              No new notifications
            </Text>
          }
          renderItem={({ item }) => (
            <Swipeable renderRightActions={() => renderRightActions(item.id)}>
              <TouchableOpacity activeOpacity={1}>
                <View style={styles.notificationItem}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.message}>{item.message}</Text>
                </View>
              </TouchableOpacity>
            </Swipeable>
          )}
        />
      </View>
    </View>
  );
};

export default Notification;

// ------------------- Dummy Local Notifications -------------------

const dummyNotifications: NotificationItem[] = [
  {
    id: '1',
    title: 'Booking Confirmed',
    message: 'Your booking for Ankit Electrician has been confirmed.',
    type: 'BOOKING_CONFIRMED',
    vendor: 'Ankit Electrician',
  },
  {
    id: '2',
    title: 'Job Completed',
    message: 'Your service with Ramesh Plumber is completed.',
    type: 'JOB_COMPLETED',
    vendor: 'Ramesh Plumber',
  },
  {
    id: '3',
    title: 'Leave a Review',
    message: 'How was your experience with Neha Salon? Leave a review!',
    type: 'REVIEW_REMINDER',
    vendor: 'Neha Salon',
  },
];

// ------------------- Notification Logic -------------------

export type NotificationTrigger =
  | 'BOOKING_CONFIRMED'
  | 'BOOKING_SCHEDULED'
  | 'BOOKING_CANCELLED'
  | 'VENDOR_ARRIVAL'
  | 'JOB_COMPLETED'
  | 'REVIEW_REMINDER';

interface NotificationTemplate {
  title: string;
  message: (vendorName: string) => string;
}

export const notificationTemplates: Record<NotificationTrigger, NotificationTemplate> = {
  BOOKING_CONFIRMED: {
    title: 'Booking Confirmed',
    message: (vendorName) => `Your booking for ${vendorName} has been confirmed.`,
  },
  BOOKING_SCHEDULED: {
    title: 'Booking Scheduled',
    message: (vendorName) =>
      `Your appointment with ${vendorName} is scheduled for tomorrow at 10 AM.`,
  },
  BOOKING_CANCELLED: {
    title: 'Booking Cancelled',
    message: (vendorName) => `Your booking with ${vendorName} has been cancelled.`,
  },
  VENDOR_ARRIVAL: {
    title: 'Vendor is Arriving',
    message: (vendorName) => `${vendorName} is on the way to your location.`,
  },
  JOB_COMPLETED: {
    title: 'Job Completed',
    message: (vendorName) =>
      `Your service with ${vendorName} has been successfully completed.`,
  },
  REVIEW_REMINDER: {
    title: 'Leave a Review',
    message: (vendorName) =>
      `How was your experience with ${vendorName}? Leave a review.`,
  },
};

export const getNotification = (trigger: NotificationTrigger, vendor: string) => {
  const template = notificationTemplates[trigger];
  return {
    title: template.title,
    message: template.message(vendor),
  };
};

// ------------------- Styles -------------------

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff7f0',
  },
  content: {
    padding: 0,
    backgroundColor: 'transparent',
    borderRadius: 0,
    elevation: 0,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  heading: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f57c00',
  },
  clearAllBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#f57c00',
    borderRadius: 4,
  },
  clearAllText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  notificationItem: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0e0d0',
    paddingBottom: 8,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
  },
  message: {
    fontSize: 13,
    color: '#555',
    marginTop: 2,
  },
  deleteButton: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: '100%',
    borderRadius: 8,
  },
});
