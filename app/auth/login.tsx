import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  BackHandler,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
// import auth from "@react-native-firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { router } from "expo-router";

const API_BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl;

export default function PhoneLoginScreen() {
  const [mobile, setMobile] = useState("");
  const [code, setCode] = useState("");
  const [confirmation, setConfirmation] = useState<any>(null);
  const [isOtpSent, setIsOtpSent] = useState(false);

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

  const sendOtp = async () => {
    if (mobile.length !== 10) {
      Alert.alert("Error", "Please enter a valid 10-digit mobile number.");
      return;
    }
    setIsOtpSent(true);

    const phoneNumber = `+91${mobile}`;

    // try {
    //   const confirmationResult = await auth().signInWithPhoneNumber(
    //     phoneNumber
    //   );
    //   setConfirmation(confirmationResult);
    //   setIsOtpSent(true);
    // } catch (error: any) {
    //   console.error("OTP send error:", error);
    //   Alert.alert("Error", error.message || "Failed to send OTP.");
    // }
  };

  const verifyOtp = async () => {
    if (code.length !== 6) {
      Alert.alert("Invalid OTP", "Please enter a valid 6-digit OTP.");
      return;
    }

    await AsyncStorage.setItem("isLoggedIn", "true");
    router.replace("/user/dashboard");
    // try {
    //   const result = await confirmation.confirm(code);
    //   const token = await result.user.getIdToken();

    //   Alert.alert(
    //     "OTP Verified",
    //     `${API_BASE_URL}Token:\n${token}`,
    //     [
    //       {
    //         text: "OK",
    //         onPress: () => loginUser(token),
    //       },
    //     ],
    //     { cancelable: false }
    //   );
    // } catch (error: any) {
    //   console.error("OTP verification error:", error);
    //   Alert.alert("Verification Failed", error.message || "Invalid OTP.");
    // }
  };

  const loginUser = async (idToken: string) => {
    // try {
    //   let role = "user"; // Default role
    //   const response = await fetch(`${API_BASE_URL}/auth/login`, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${idToken}`,
    //     },
    //     body: JSON.stringify({
    //       mobile: `+91${mobile}`,
    //       role: role,
    //     }),
    //   });

    //   const data = await response.json();

    //   if (response.ok) {
    //     // ✅ Successful login
    //     await AsyncStorage.setItem("uid", data.uid);
    //     await AsyncStorage.setItem("isLoggedIn", "true");
    //     await AsyncStorage.setItem(
    //       role === "vendor" ? "vendorData" : "userData",
    //       JSON.stringify(data.profile)
    //     );

    //     // Optionally store profile if needed: await AsyncStorage.setItem("profile", JSON.stringify(data.profile));

    //     router.replace("/user/dashboard");
    //   } else {
    //     const errMsg = data.message?.toLowerCase() ?? "";

    //     if (
    //       errMsg.includes("user not found") ||
    //       errMsg.includes("invalid login credentials")
    //     ) {
    //       // 🔁 User not found, go to register
    //       router.replace({
    //         pathname: "/auth/register",
    //         params: {
    //           phone: `+91${mobile}`,
    //           role: "user",
    //         },
    //       });
    //     } else {
    //       // ❌ Other error
    //       throw new Error(data.message || "Login failed.");
    //     }
    //   }
    // } catch (error: any) {
    //   console.error("Login error:", error);
    //   Alert.alert("Login Failed", error.message || "Something went wrong.");
    // }
  };

  return (
    <View style={styles.container}>
      {!isOtpSent ? (
        <>
          <Text style={styles.heading}>Enter Your Mobile Number</Text>
          <TextInput
            style={styles.input}
            keyboardType="phone-pad"
            maxLength={10}
            placeholder="6321234567"
            value={mobile}
            onChangeText={setMobile}
          />
          <TouchableOpacity style={styles.button} onPress={sendOtp}>
            <Text style={styles.buttonText}>Send OTP on Mobile</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.heading}>Enter OTP sent to +91{mobile}</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            maxLength={6}
            placeholder="Enter 6-digit OTP"
            value={code}
            onChangeText={setCode}
          />
          <TouchableOpacity style={styles.button} onPress={verifyOtp}>
            <Text style={styles.buttonText}>Verify OTP & Continue</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#f57c00",
    padding: 14,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 18,
    color: "#000",
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#f57c00",
    padding: 14,
    borderRadius: 30,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
