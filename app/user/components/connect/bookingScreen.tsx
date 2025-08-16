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
  ScrollView,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Speech from "expo-speech";
import { router, useLocalSearchParams } from "expo-router";
import Constants from "expo-constants";
import auth from "@react-native-firebase/auth";

interface Vendor {
  uid: string;
  name?: string;
  location?: {
    lat: number;
    lng: number;
    address?: string;
    city?: string;
    pincode?: string;
  };
  subcategories?: string[];
  jobDescription?: string;
}

interface BookingPayload {
  vendorId: string;
  service: string;
  date: string;
  description: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  subcategories?: string;
}

const API_BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl as string;

export default function VendorBooking() {
  const { vendorData } = useLocalSearchParams<{ vendorData?: string }>();
  const vendorRaw: Vendor = vendorData ? JSON.parse(vendorData) : ({} as Vendor);

  const [date, setDate] = useState<Date>(new Date());
  const [description, setDescription] = useState<string>("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [service, setService] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // ✅ dropdown items directly vendorRaw.subcategories se
  const [items, setItems] = useState<{ label: string; value: string }[]>(
    vendorRaw?.subcategories?.length
      ? vendorRaw.subcategories.map((s) => ({
          label: s,
          value: s,
        }))
      : []
  );

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (selectedDate: Date) => {
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
        Alert.prompt?.("Voice Input", "Enter text received from voice here.");
      },
    });
  };

  // 📌 Confirm Booking API Call
  const handleBooking = async () => {
    if ((vendorRaw?.subcategories?.length && !service) || !description.trim()) {
      Alert.alert("Error", "Please select a service and enter a description.");
      return;
    }

    try {
      setLoading(true);

      const user = auth().currentUser;
      if (!user) throw new Error("User not authenticated.");

      const idToken = await user.getIdToken();
      const payload: BookingPayload = {
        vendorId: vendorRaw.uid,
        service,
        date: date.toISOString(),
        description: description.trim(),
        status: "pending"
      };

      const res = await fetch(`${API_BASE_URL}/bookings/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Booking failed");

      router.push({
        pathname: "/user/components/ui/BookingDetail",
        params: {
          vendor: JSON.stringify(vendorRaw),
          date: date.toISOString(),
          service,
          description: description.trim(),
          bookingId: data.bookingId ?? "",
        },
      });
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.innerWrapper}>
        {/* Vendor Info Card */}
        <View style={styles.vendorCard}>
          <Text style={styles.vendorName}>{vendorRaw?.name || "Vendor"}</Text>

          {/* Location */}
          {vendorRaw?.location ? (
            <Text style={styles.vendorLocation}>
              {vendorRaw.location.address
                ? `${vendorRaw.location.address}, `
                : ""}
              {vendorRaw.location.city || ""}
              {vendorRaw.location.pincode
                ? ` - ${vendorRaw.location.pincode}`
                : ""}
            </Text>
          ) : (
            <Text style={styles.vendorLocation}>Location not available</Text>
          )}

          {/* Subcategories */}
          {vendorRaw?.subcategories && vendorRaw.subcategories.length > 0 ? (
            <View style={styles.subcategorySection}>
              <Text style={styles.sectionTitle}>Subcategories</Text>
              <View style={styles.subcategoryList}>
                {vendorRaw.subcategories.map((item, index) => (
                  <View key={index} style={styles.subcategoryBadge}>
                    <Text style={styles.subcategoryText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}

          {/* Job Description */}
          {vendorRaw?.jobDescription?.trim() && (
            <View style={styles.jobDescriptionSection}>
              <Text style={styles.sectionTitle}>Job Description</Text>
              <Text style={styles.jobDescriptionText}>
                {vendorRaw.jobDescription.trim()}
              </Text>
            </View>
          )}
        </View>

        {/* Location & Response */}
        <View style={styles.highlightBox}>
          <Text style={styles.highlightText}>📍 Delhi, India</Text>
          <Text style={styles.highlightText}>⏱️ Response Time: 10 mins</Text>
        </View>

        {/* Service Selection (only if vendor has subcategories) */}
        {vendorRaw?.subcategories && vendorRaw.subcategories.length > 0 && (
          <>
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
              listMode="SCROLLVIEW" // ✅ fix warning
            />
          </>
        )}

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

        {/* Job Description Input */}
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
          <TouchableOpacity style={styles.button} onPress={handleBooking}>
            <LinearGradient
              colors={["#f57c00", "#f57c00"]}
              style={styles.gradient}
            >
              <Text style={styles.buttonText}>
                {loading ? "Booking..." : "Confirm"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fffefb" },
  innerWrapper: { padding: 20 },
  vendorCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ffe0b2",
    marginBottom: 16,
  },
  vendorName: { fontSize: 18, fontWeight: "bold", color: "#333", marginBottom: 4 },
  vendorLocation: { fontSize: 14, color: "#777", marginBottom: 12 },
  subcategorySection: { marginTop: 8, marginBottom: 12 },
  sectionTitle: { fontSize: 15, fontWeight: "600", color: "#333", marginBottom: 6 },
  subcategoryList: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  subcategoryBadge: {
    backgroundColor: "#ff9800",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  subcategoryText: { color: "#fff", fontSize: 13 },
  jobDescriptionSection: { marginTop: 8 },
  jobDescriptionText: { fontSize: 14, lineHeight: 20, color: "#555" },
  highlightBox: {
    backgroundColor: "#fff3e0",
    borderLeftWidth: 4,
    borderLeftColor: "#ff9800",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  highlightText: { fontSize: 14, color: "#333", fontWeight: "600" },
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
  inputText: { fontSize: 14, color: "#333", marginLeft: 10, flex: 1 },
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
  recommendedText: { fontSize: 13, color: "#ff9800" },
  dropdown: {
    borderRadius: 10,
    borderColor: "#ffe0b2",
    marginBottom: 8,
    zIndex: 1000,
  },
  dropdownBox: { borderColor: "#ffe0b2", zIndex: 1000 },
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
  buttonRow: { flexDirection: "row", marginTop: 20, gap: 12 },
  button: { flex: 1, borderRadius: 12, overflow: "hidden" },
  gradient: { paddingVertical: 14, alignItems: "center", borderRadius: 12 },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 15 },
});
