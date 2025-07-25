import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  FlatList,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router'; // For navigation

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
  const [notifications, setNotifications] = useState(dummyNotifications);
  const [unread, setUnread] = useState(hasUnread);
  const router = useRouter();

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  };

  const markAllAsRead = () => {
    setUnread(false);
  };

  const handleNavigate = (item: NotificationItem) => {
    if (item.type === 'REVIEW_REMINDER') {
      router.push(`/review/${item.id}`);
    } else {
      router.push(`/booking/${item.id}`);
    }
  };

  const renderRightActions = (id: string) => (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => handleDelete(id)}
    >
      <Feather name="trash-2" size={20} color="#fff" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.wrapper}>
      {/* Bell Icon */}
      <TouchableOpacity onPress={onPress} style={styles.container}>
        <Feather name="bell" size={22} color="#f57c00" />
        {unread && <View style={styles.badge} />}
      </TouchableOpacity>

      {/* Mark All As Read */}
      <TouchableOpacity onPress={markAllAsRead} style={styles.markReadButton}>
        <Text style={styles.markReadText}>Mark all as read</Text>
      </TouchableOpacity>

      {/* Notification List */}
      <View style={styles.content}>
        <Text style={styles.heading}>Recent Notifications</Text>
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Swipeable renderRightActions={() => renderRightActions(item.id)}>
              <TouchableOpacity onPress={() => handleNavigate(item)}>
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
  container: {
    alignSelf: 'flex-end',
    marginBottom: 12,
    padding: 6,
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff3d00',
  },
  markReadButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  markReadText: {
    fontSize: 12,
    color: '#f57c00',
    textDecorationLine: 'underline',
  },
  content: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    elevation: 2,
  },
  heading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#f57c00',
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
    backgroundColor: '#ff3d00',
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: '100%',
    borderRadius: 8,
  },
});
