import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Speech from "expo-speech";
import { router } from "expo-router";

export default function VendorBooking() {
  const [date, setDate] = useState(new Date());
  const [description, setDescription] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [open, setOpen] = useState(false);
  const [service, setService] = useState(null);
  const [items, setItems] = useState([
    { label: "Install Ceiling Fan", value: "fan" },
    { label: "Fix Wiring", value: "wiring" },
    { label: "Plumbing", value: "plumbing" },
    { label: "AC Service", value: "ac" },
  ]);

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (selectedDate) => {
    setDate(selectedDate);
    hideDatePicker();
  };

  const handleRecommendedSlot = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    setDate(now);
  };

  const startVoiceInput = () => {
    Speech.speak("Please describe your job requirement", {
      onDone: () => {
        Alert.prompt("Voice Input", "Enter text received from voice here.");
      },
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.innerWrapper}>
        {/* Location & Response */}
        <View style={styles.highlightBox}>
          <Text style={styles.highlightText}>📍 Delhi, India</Text>
          <Text style={styles.highlightText}>⏱️ Response Time: 10 mins</Text>
        </View>

        {/* Service Selection */}
        <Text style={styles.label}>Select Service</Text>
        <DropDownPicker
          open={open}
          value={service}
          items={items}
          setOpen={setOpen}
          setValue={setService}
          setItems={setItems}
          placeholder="Choose a service"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownBox}
          textStyle={{ fontSize: 14 }}
        />

        {/* Date and Time */}
        <Text style={styles.label}>Select Date & Time</Text>
        <TouchableOpacity onPress={showDatePicker} style={styles.inputField}>
          <Ionicons name="calendar" size={18} color="#ff9800" />
          <Text style={styles.inputText}>
            {date.toLocaleDateString()} {date.toLocaleTimeString()}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.recommendedBtn}
          onPress={handleRecommendedSlot}
        >
          <Text style={styles.recommendedText}>⚡ Use Recommended Slot</Text>
        </TouchableOpacity>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="datetime"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          minimumDate={new Date()}
          themeVariant="light"
        />

        {/* Job Description */}
        <Text style={styles.label}>Job Description</Text>
        <View style={styles.descriptionContainer}>
          <Ionicons name="document-text" size={18} color="#ff9800" />
          <TextInput
            style={styles.textArea}
            placeholder="Describe the issue..."
            value={description}
            onChangeText={setDescription}
            multiline
          />
          <TouchableOpacity onPress={startVoiceInput}>
            <Ionicons name="mic" size={20} color="#ff9800" />
          </TouchableOpacity>
        </View>

        {/* Confirm Button */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/user/components/ui/BookingDetail")}
          >
            <LinearGradient
              colors={["#f57c00", "#f57c00"]}
              style={styles.gradient}
            >
              <Text style={styles.buttonText}>Confirm</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fffefb",
  },
  innerWrapper: {
    padding: 20,
    flex: 1,
    justifyContent: "center",
  },
  highlightBox: {
    backgroundColor: "#fff3e0",
    borderLeftWidth: 4,
    borderLeftColor: "#ff9800",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  highlightText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
  },
  label: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  inputField: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ffe0b2",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  inputText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 10,
    flex: 1,
  },
  recommendedBtn: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: "#fff3e0",
    borderColor: "#ff9800",
    borderWidth: 1,
    marginBottom: 10,
  },
  recommendedText: {
    fontSize: 13,
    color: "#ff9800",
  },
  dropdown: {
    borderRadius: 10,
    borderColor: "#ffe0b2",
    marginBottom: 8,
    zIndex: 1000,
  },
  dropdownBox: {
    borderColor: "#ffe0b2",
    zIndex: 1000,
  },
  textArea: {
    fontSize: 14,
    color: "#333",
    flex: 1,
    height: 90,
    textAlignVertical: "top",
    marginLeft: 10,
  },
  descriptionContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ffe0b2",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    gap: 10,
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 20,
    gap: 12,
  },
  button: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  gradient: {
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 12,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
  },
});
