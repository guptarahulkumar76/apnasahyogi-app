import React, { useState, useEffect } from "react";
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
  Modal,
  ActivityIndicator,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Speech from "expo-speech";
import { router, useLocalSearchParams } from "expo-router";
import Constants from "expo-constants";
import auth from "@react-native-firebase/auth";

const formatDateToCustom = (date: Date) => {
  const day = date.getDate();
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

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
  category?:string;
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
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
  const [description, setDescription] = useState<string>("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [open, setOpen] = useState(false);
  const [service, setService] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [rating, setRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");

  // Fetch service types dynamically on mount or vendor change
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

  const handleBooking = async () => {
    if (!description.trim()) {
      setModalMessage("Please select a service and enter a description.");
      setModalVisible(true);
      return;
    }

    setLoading(true);

    setTimeout(async () => {
      try {
        const user = auth().currentUser;
        if (!user) throw new Error("User not authenticated.");

        const idToken = await user.getIdToken();
        const payload: BookingPayload = {
          vendorId: vendorRaw.uid,
          service: service || "",
          date: date.toISOString(),
          description: description.trim(),
          status: "pending",
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
            startDate: formatDateToCustom(startDate),
            service,
            description,
            bookingId: data.bookingId ?? "",
            rating: rating.toString(),
            feedback
          },
        });
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
        Alert.alert("Error", errorMessage);
      } finally {
        setLoading(false);
      }
    }, 2000);
  };
//  const getValue = (value: any, defaultVal: any) =>
//     value !== undefined && value !== null && value !== "" ? value : defaultVal;

//   const vendor={ category: getValue(vendorRaw.category, "Labour"),}

  useEffect(() => {
  if (vendorRaw?.subcategories?.length) {
    setItems(vendorRaw.subcategories.map((s) => ({ label: s, value: s })));
  } else {
    // Default or static services
    setItems([
      { label: "Plumbing", value: "plumbing" },
      { label: "Electrical", value: "electrical" },
      { label: "Carpentry", value: "carpentry" },
    ]);
  }
}, []);


  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <ScrollView contentContainerStyle={styles.innerWrapper}>
        {/* Vendor Info Card */}
        <View style={styles.vendorCard}>
          <LinearGradient colors={["#ff9e1f", "#ff6b00"]} style={styles.vendorHeader}>
            <View style={styles.vendorHeaderContent}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {vendorRaw?.name ? vendorRaw.name.charAt(0).toUpperCase() : "V"}
                </Text>
              </View>
              <Text style={styles.vendorNameGradient}>{vendorRaw?.name || "Vendor"}</Text>
            </View>
                    <Text style={styles.category}>{vendorRaw.category}</Text>
          </LinearGradient>
          <View style={styles.vendorLocationWrapper}>
            <Ionicons name="location-outline" size={16} color="#ff9800" />
            <Text style={styles.vendorLocation}>
              {vendorRaw?.location
                ? `${vendorRaw.location.address ? `${vendorRaw.location.address}, ` : ""}${
                    vendorRaw.location.city || ""
                  }${vendorRaw.location.pincode ? ` - ${vendorRaw.location.pincode}` : ""}`
                : "Location not available"}
            </Text>
          </View>
        </View>

        {/* Service Dropdown */}
        {/* {items.length > 0 && (
          <>
            <Text style={styles.label}>Select Service</Text>
            <DropDownPicker
              open={open}
              value={service}
              items={items}
              setOpen={setOpen}
              setValue={(callback) => setService(callback(service))}
              setItems={setItems}
              placeholder="Choose a service"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownBox}
              textStyle={{ fontSize: 14 }}
              listMode="SCROLLVIEW"
            />
          </>
        )}
        {service ? <Text style={styles.chosenText}>Chosen Service: {service}</Text> : null} */}

        {/* Booking Date */}
        <Text style={styles.label}>Service Start Date</Text>
        <TouchableOpacity onPress={showDatePicker} style={styles.inputField}>
          <Ionicons name="calendar" size={18} color="#ff9800" />
          <Text style={styles.inputText}>
            {date.toDateString()} {date.toLocaleTimeString()}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.recommendedBtn} onPress={handleRecommendedSlot}>
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
        <TouchableOpacity style={styles.button} onPress={handleBooking} disabled={loading}>
          <LinearGradient colors={["#ff9e1f", "#ff6b00"]} style={styles.gradient}>
            <Text style={styles.buttonText}>Confirm</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Error Modal */}
        <Modal animationType="fade" transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Ionicons name="warning-outline" size={40} color="#ff9800" />
              <Text style={styles.modalText}>{modalMessage}</Text>
              <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Loading Modal */}
        <Modal animationType="fade" transparent visible={loading}>
          <View style={styles.modalOverlay}>
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color="#ff6b00" style={{ marginBottom: 16 }} />
              <Text style={styles.loadingText}>Finalizing Your Booking...</Text>

            </View>
          </View>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fdfdfd" },
  innerWrapper: { padding: 20, paddingBottom: 40 },
  vendorCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
    overflow: "hidden",
  },
  vendorHeader: { paddingVertical: 16, paddingHorizontal: 20 },
  vendorHeaderContent: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#fff3e0",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { fontSize: 20, fontWeight: "700", color: "#ff6b00" },
  vendorNameGradient: { color: "#fff", fontSize: 20, fontWeight: "700" },
  vendorLocationWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 6,
  },
  vendorLocation: { fontSize: 14, color: "#555" },
  label: { marginTop: 12, fontSize: 15, fontWeight: "600", color: "#333", marginBottom: 6 },
  inputField: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ffe0b2",
    borderRadius: 12,
    padding: 12,
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
  recommendedText: { fontSize: 13, color: "#ff9800", fontWeight: "600" },
  dropdown: { borderRadius: 10, borderColor: "#ffe0b2", marginBottom: 8 },
  dropdownBox: { borderColor: "#ffe0b2" },
  chosenText: { fontSize: 14, color: "#444", marginBottom: 8 },
  descriptionContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ffe0b2",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    gap: 10,
  },
  textArea: {
    flex: 1,
    fontSize: 14,
    color: "#333",
    height: 90,
    textAlignVertical: "top",
    marginLeft: 10,
  },
  ratingRow: { flexDirection: "row", gap: 10, marginBottom: 16 },
  feedbackBox: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ffe0b2",
    borderRadius: 12,
    padding: 12,
    height: 80,
    fontSize: 14,
    color: "#333",
    marginBottom: 20,
    textAlignVertical: "top",
  },
  invoiceBox: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  invoiceTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ff6b00",
    marginBottom: 10,
  },
  invoiceText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 6,
  },
  invoiceAmount: {
    fontSize: 20,
    fontWeight: "800",
    color: "#ff6b00",
    marginTop: 12,
  },
  button: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 40,
  },
  gradient: {
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "75%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    gap: 16,
  },
  modalText: { fontSize: 16, color: "#333", textAlign: "center" },
  modalButton: {
    backgroundColor: "#ff6b00",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  modalButtonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  loadingBox: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
  },
  loadingText: { fontSize: 16, color: "#ff6b00" },
  category:{
    paddingLeft:70,
    fontSize:17,
    color:"white",
  }
});
