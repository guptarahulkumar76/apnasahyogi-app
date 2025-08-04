import React, { useState } from "react";
import { router } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Linking,
  Alert,
  Platform,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

export default function VendorBooking() {
  const [date, setDate] = useState(new Date());
  const [description, setDescription] = useState("");
  const [service, setService] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (selectedDate: Date) => {
    setDate(selectedDate);
    hideDatePicker();
  };

  const handleBooking = () => {
    Alert.alert("🎉 Booking Confirmed", "Your booking has been initiated.");
    // router.push("/user/components/connect/submitBook");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>📋 Book Your Vendor</Text>

      <View style={styles.card}>
        <Text style={styles.infoText}>
          📍 <Text style={styles.label}>Live Location:</Text> Delhi, India
        </Text>
        <Text style={styles.infoText}>
          ⏱️ <Text style={styles.label}>Response Time:</Text> 10 mins
        </Text>

        <TouchableOpacity onPress={showDatePicker} style={styles.pickerBtn}>
          <Ionicons name="calendar" size={20} color="white" />
          <Text style={styles.pickerText}>
            {date.toLocaleDateString()} {date.toLocaleTimeString()}
          </Text>
        </TouchableOpacity>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="datetime"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          minimumDate={new Date()}
          themeVariant="light"
          {...(Platform.OS === "ios"
            ? {
                textColor: "#ff9800",
                pickerContainerStyleIOS: {
                  backgroundColor: "#fff",
                },
                customHeaderIOS: () => (
                  <View style={styles.customHeader}>
                    <Text style={styles.customHeaderText}>
                      Select Date & Time
                    </Text>
                  </View>
                ),
              }
            : {})}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>🛠️ Select Service</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Install ceiling fan"
          value={service}
          onChangeText={setService}
        />

        <Text style={styles.label}>📝 Job Description</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          multiline
          numberOfLines={4}
          placeholder="Describe the issue or requirement"
          value={description}
          onChangeText={setDescription}
        />
      </View>

      <View style={[styles.card, styles.rowBtns]}>
        <TouchableOpacity style={styles.bookBtn} onPress={handleBooking}>
          <Text style={styles.bookBtnText}>✅ Confirm</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.bookBtn, styles.cancelBtn]}
          onPress={() => Alert.alert("❌ Booking Cancelled")}
        >
          <Text style={[styles.bookBtnText, { color: "#444" }]}>Cancel</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>❓ Contact Vendor</Text>
        <View style={styles.contactRow}>
          <TouchableOpacity
            style={styles.smallContactBtn}
            onPress={() => Linking.openURL("tel:+919999999999")}
          >
            <Ionicons name="call" size={16} color="white" />
            <Text style={styles.btnText}>Call</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.smallContactBtn}
            onPress={() => Linking.openURL("https://wa.me/919999999999")}
          >
            <FontAwesome name="whatsapp" size={16} color="white" />
            <Text style={styles.btnText}>WhatsApp</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff8f0",
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#ff9800",
    textAlign: "center",
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#fffdf9",
    marginBottom: 16,
  },
  textarea: {
    height: 100,
    textAlignVertical: "top",
  },
  infoText: {
    fontSize: 14,
    marginBottom: 8,
    color: "#555",
  },
  pickerBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ff9800",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    alignSelf: "flex-start",
  },
  pickerText: {
    color: "white",
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "500",
  },
  rowBtns: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  bookBtn: {
    flex: 1,
    backgroundColor: "#ff9800",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelBtn: {
    backgroundColor: "#f3f3f3",
  },
  bookBtnText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
  },
  contactRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
  },
  smallContactBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ff9800",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  btnText: {
    color: "white",
    marginLeft: 6,
    fontWeight: "600",
    fontSize: 13,
  },
  customHeader: {
    backgroundColor: "#ff9800",
    padding: 10,
    alignItems: "center",
  },
  customHeaderText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
