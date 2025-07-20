import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  BackHandler,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import Constants from "expo-constants";

const API_BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl;

export default function PhoneLoginScreen() {
  const [mobile, setMobile] = useState("");

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        router.replace("/mainscreen/OnboardingScreen");
        return true;
      };
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );
      return () => subscription.remove();
    }, [])
  );

  const handleContinue = async () => {
    if (mobile.length === 10) {
      try {
        console.log("Attempting to login with mobile:", mobile, API_BASE_URL);
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mobile: `+91${mobile}`,
            role: "user",
            idToken: "mock",
          }),
        });

        const result = await response.json();

        if (response.ok) {
          // ✅ Login successful, navigate to OTP
          const dummyVerificationId = "dummy-verification-id";

          router.push({
            pathname: "/auth/otp",
            params: {
              verificationId: dummyVerificationId,
              phone: `+91${mobile}`,
              role: result.profile.roles?.[0] || "user", // default to user if not present
            },
          });
        } else if (
          result.message === "User not found" ||
          result.message === "Invalid login credentials"
        ) {
          // ❌ Go to registration
          router.push({
            pathname: "/auth/register",
            params: {
              phone: `+91${mobile}`,
              role: "user",
            },
          });
        } else {
          alert(result.message || "Something went wrong");
          // router.push({pathname: "/auth/otp"})
        }
      } catch (err) {
        console.error(err);
        alert("Failed to connect. Try again later.");
      }
    } else {
      alert("Please enter a valid 10-digit mobile number.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <Text style={styles.heading}>Enter Your Mobile Number</Text>
        <Text style={styles.subheading}>Please enter the mobile number</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.prefix}>+91</Text>
          <TextInput
            style={styles.input}
            keyboardType="phone-pad"
            maxLength={10}
            placeholder="6321234567"
            value={mobile}
            onChangeText={setMobile}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.agreeText}>
          By logging in or registering, you agree to our{" "}
          <Text style={styles.link}>Terms and Conditions</Text> and{" "}
          <Text style={styles.link}>Privacy Policy</Text>
        </Text>
        <TouchableOpacity style={styles.continueBtn} onPress={handleContinue}>
          <Text style={styles.continueText}>CONTINUE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  body: {
    marginTop: 60,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subheading: {
    fontSize: 14,
    color: "#777",
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: "row",
    borderWidth: 1.5,
    borderColor: "#f57c00",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  prefix: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  footer: {
    marginTop: 50,
    alignItems: "center",
  },
  agreeText: {
    fontSize: 12,
    color: "#444",
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  link: {
    color: "#f57c00",
    textDecorationLine: "underline",
  },
  continueBtn: {
    backgroundColor: "#f57c00",
    paddingVertical: 14,
    paddingHorizontal: 80,
    borderRadius: 30,
    elevation: 3,
  },
  continueText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
