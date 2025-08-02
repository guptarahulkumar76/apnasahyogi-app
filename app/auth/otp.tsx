import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Params = {
  phone?: string;
  role?: string;
};

export default function OTPVerificationScreen() {
  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const inputs = useRef<Array<TextInput | null>>([]);
  const router = useRouter();
  const { phone, role } = useLocalSearchParams<Params>();

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    if (text && index < 4) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length !== 5) {
      Alert.alert("Invalid OTP", "Please enter a valid 5-digit OTP.");
      return;
    }

    try {
      // Simulate successful verification
      await AsyncStorage.setItem("uid", "user");
      await AsyncStorage.setItem("isLoggedIn", "true");

      if (role === "vendor") {
        router.replace("/vendor/dashboard");
      } else {
        router.replace("/user/dashboard");
        // router.replace({
        //   pathname: "/auth/register",
        //   params: {
        //     phone,
        //     role: role || "user",
        //   },
        // });
      }
    } catch (error: any) {
      console.error("OTP Verify Error:", error);
      Alert.alert("Verification Failed", error.message || "Try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      {/* <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="white" />
        <Text style={styles.headerText}>ApnaSahyogi</Text>
      </View> */}

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.otpTitle}>Enter the 5 Digit OTP sent to</Text>
        <Text style={styles.phoneNumber}>{phone ?? ""}</Text>

        {/* OTP Inputs */}
        <View style={styles.otpInputWrapper}>
          {otp.map((value, index) => (
            <TextInput
              key={index}
              style={styles.input}
              keyboardType="numeric"
              maxLength={1}
              value={value}
              onChangeText={(text) => handleChange(text, index)}
              ref={(ref) => (inputs.current[index] = ref)}
            />
          ))}
        </View>

        {/* Auto Read Timer */}
        <View style={styles.autoRead}>
          <Ionicons name="refresh" size={18} color="#e06b00" />
          <Text style={styles.autoReadText}>Auto reading OTP 27 secs</Text>
        </View>
      </View>

      {/* Verify Button */}
      <TouchableOpacity style={styles.verifyButton} onPress={handleVerify}>
        <Text style={styles.verifyText}>VERIFY</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff7f2",
  },
  header: {
    backgroundColor: "orange",
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 10,
  },
  content: {
    padding: 20,
    alignItems: "center",
  },
  otpTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
    marginTop: 20,
  },
  phoneNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#e06b00",
    marginVertical: 10,
  },
  otpInputWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginVertical: 20,
  },
  input: {
    width: 50,
    height: 60,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    fontSize: 22,
    textAlign: "center",
  },
  autoRead: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  autoReadText: {
    marginLeft: 6,
    fontSize: 14,
    color: "#333",
  },
  verifyButton: {
    backgroundColor: "orange",
    paddingVertical: 15,
    marginHorizontal: 40,
    borderRadius: 8,
    alignItems: "center",
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
  },
  verifyText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
