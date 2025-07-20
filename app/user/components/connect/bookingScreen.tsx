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
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons, FontAwesome, MaterialIcons } from "@expo/vector-icons";

export default function VendorBooking() {
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [description, setDescription] = useState("");
  const [service, setService] = useState("");

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowPicker(false);
    setDate(currentDate);
  };

  const handleBooking = () => {
    Alert.alert("Booking Confirmed", "Your booking has been initiated.");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Book Your Vendor</Text>

      {/* Location and Time Info */}
      <View style={styles.section}>
        <Text style={styles.label}>Live Location: Delhi, India</Text>
        <Text style={styles.label}>Estimated Response Time: 10 mins</Text>
        <TouchableOpacity
          onPress={() => setShowPicker(true)}
          style={styles.pickerBtn}
        >
          <Ionicons name="calendar" size={20} color="white" />
          <Text style={styles.pickerText}>
            {date.toLocaleDateString()} {date.toLocaleTimeString()}
          </Text>
        </TouchableOpacity>
        {showPicker && (
          <DateTimePicker
            value={date}
            mode="datetime"
            display="default"
            onChange={handleDateChange}
          />
        )}
      </View>

      {/* Booking Form */}
      <View style={styles.section}>
        <Text style={styles.label}>Select Service:</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Install ceiling fan"
          value={service}
          onChangeText={setService}
        />
        <Text style={styles.label}>Describe the job:</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          multiline
          numberOfLines={4}
          placeholder="Describe the issue or requirement"
          value={description}
          onChangeText={setDescription}
        />
      </View>

      {/* Contact Options */}
      <View style={styles.section}>
        <Text style={styles.label}>Need Help?</Text>
        <View style={styles.rowBtns}>
          <TouchableOpacity
            style={styles.contactBtn}
            onPress={() => Linking.openURL("tel:+919999999999")}
          >
            <Ionicons name="call" size={20} color="white" />
            <Text style={styles.btnText}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.contactBtn}
            onPress={() => Linking.openURL("https://wa.me/919999999999")}
          >
            <FontAwesome name="whatsapp" size={20} color="white" />
            <Text style={styles.btnText}>WhatsApp</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* CTA Buttons */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.bookBtn}
          onPress={() => router.push("/user/components/connect/submitBook")} // ✅ Navigate to screen
        >
          <Text style={styles.bookBtnText}>Confirm Book</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.bookBtn, { backgroundColor: "gray" }]}
          onPress={() => Alert.alert("Quote Requested")}
        >
          <Text style={styles.bookBtnText}>Cancel Book</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#ffedddff",
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#FF5733",
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontWeight: "600",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  textarea: {
    height: 100,
    textAlignVertical: "top",
  },
  pickerBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF5733",
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  pickerText: {
    color: "white",
    marginLeft: 8,
  },
  rowBtns: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  contactBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF5733",
    padding: 10,
    borderRadius: 8,
  },
  btnText: {
    color: "white",
    marginLeft: 6,
  },
  bookBtn: {
    backgroundColor: "#FF5733",
    padding: 14,
    borderRadius: 10,
    marginVertical: 6,
    alignItems: "center",
  },
  bookBtnText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
