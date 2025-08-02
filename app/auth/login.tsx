import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  BackHandler,
  Keyboard,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { router } from "expo-router";
import Modal from "react-native-modal";
// import auth from "@react-native-firebase/auth"; // 🔁 Uncomment when Firebase is set

const API_BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl;

export default function PhoneLoginScreen() {
  const [mobile, setMobile] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [code, setCode] = useState("");
  const inputRefs = useRef<TextInput[]>([]);
  const [timer, setTimer] = useState(30);
  const [isCounting, setIsCounting] = useState(false);
  const [showInvalidModal, setShowInvalidModal] = useState(false);
  const [confirmation, setConfirmation] = useState<any>(null);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    let interval: any;
    if (isCounting && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0) {
      setIsCounting(false);
    }
    return () => clearInterval(interval);
  }, [isCounting, timer]);

  const sendOtp = async () => {
    if (!/^[6-9]\d{9}$/.test(mobile) || mobile.length !== 10) {
      Keyboard.dismiss();
      setTimeout(() => {
        setShowInvalidModal(true);
      }, 250);
      return;
    }

    setOtp(["", "", "", "", "", ""]);
    setTimer(30);
    setIsCounting(true);
    Keyboard.dismiss();
    setTimeout(() => {
      setLoading(true);
    }, 250);
    

    const phoneNumber = `+91${mobile}`;

    try {
      // 🔁 Firebase OTP sending
      // const confirmationResult = await auth().signInWithPhoneNumber(phoneNumber);
      // setConfirmation(confirmationResult);

      setTimeout(() => {
        setLoading(false);
        setModalVisible(true);
      }, 5000); // Simulated API delay
    } catch (error: any) {
      console.error("OTP send error:", error);
      Alert.alert("Error", error.message || "Failed to send OTP.");
      setLoading(false);
    }
  };

  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (!text && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    const joinedOtp = newOtp.join("");
    setCode(joinedOtp);
  };

  const verifyOtp = async () => {
    if (code.length !== 6) {
      Alert.alert("Invalid OTP", "Please enter a valid 6-digit OTP.");
      return;
    }

    // 🔁 Firebase verification
    // try {
    //   const result = await confirmation.confirm(code);
    //   const token = await result.user.getIdToken();
    //   loginUser(token);
    // } catch (error: any) {
    //   console.error("OTP verification error:", error);
    //   Alert.alert("Verification Failed", error.message || "Invalid OTP.");
    // }

    // Skipping Firebase (for now) — directly login
    await AsyncStorage.setItem("isLoggedIn", "true");
    setModalVisible(false);
    router.replace({
      pathname: "/auth/register",
      params: {
        phone: `+91${mobile}`,
        role: "user",
      },
    });
  };

  const loginUser = async (idToken: string) => {
    try {
      let role = "user";
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          mobile: `+91${mobile}`,
          role: role,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem("uid", data.uid);
        await AsyncStorage.setItem("isLoggedIn", "true");
        await AsyncStorage.setItem(
          role === "vendor" ? "vendorData" : "userData",
          JSON.stringify(data.profile)
        );
        router.replace("/user/dashboard");
      } else {
        const errMsg = data.message?.toLowerCase() ?? "";
        if (
          errMsg.includes("user not found") ||
          errMsg.includes("invalid login credentials")
        ) {
          router.replace({
            pathname: "/auth/register",
            params: {
              phone: `+91${mobile}`,
              role: "user",
            },
          });
        } else {
          throw new Error(data.message || "Login failed.");
        }
      }
    } catch (error: any) {
      console.error("Login error:", error);
      Alert.alert("Login Failed", error.message || "Something went wrong.");
    }
  };

  const isTenDigit = mobile.length === 10;
  const isOtpComplete = otp.every((digit) => digit !== "");

  return (
    <View style={styles.container}>
      <Text style={styles.loginLabel}>Login with Mobile Number</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.prefix}>+91</Text>
        <TextInput
          style={styles.input}
          keyboardType="number-pad"
          maxLength={10}
          placeholder="Enter Mobile Number"
          placeholderTextColor="#aaa"
          value={mobile}
          onChangeText={(text) => {
            const digitsOnly = text.replace(/[^0-9]/g, "");
            if (digitsOnly.length <= 10) {
              setMobile(digitsOnly);
            }
          }}
          onSubmitEditing={() => {
            if (mobile.length === 10) {
              sendOtp();
            }
          }}
          returnKeyType="done"
        />
      </View>

      <TouchableOpacity style={[styles.button]} onPress={sendOtp}>
        <Text style={styles.buttonText}>Proceed</Text>
      </TouchableOpacity>

      <Modal
        isVisible={showInvalidModal}
        onBackdropPress={() => setShowInvalidModal(false)}
      >
        <View style={styles.warningCard}>
          <Text style={styles.warningIcon}>⚠</Text>
          <Text style={styles.warningTitle}>Invalid Mobile Number</Text>
          <Text style={styles.warningMessage}>
            Please enter a valid mobile number.
          </Text>
          <TouchableOpacity
            onPress={() => setShowInvalidModal(false)}
            style={styles.warningButton}
          >
            <Text style={styles.warningButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        isVisible={isModalVisible}
        onSwipeComplete={() => setModalVisible(false)}
        swipeDirection="down"
        animationIn="slideInUp"
        animationOut="slideOutDown"
        animationInTiming={300}
        animationOutTiming={300}
        backdropColor="#000"
        backdropOpacity={0.2}
        style={styles.bottomSheetModal}
      >
        <View style={styles.bottomModal}>
          <View style={styles.dragHandle} />
          <Text style={styles.modalTitle}>Enter OTP</Text>
          <Text style={styles.modalSubtitle}>OTP sent to +91 {mobile}</Text>

          <View style={styles.otpRow}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref!)}
                style={styles.otpBox}
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onChangeText={(text) => {
                  const cleaned = text.replace(/[^0-9]/g, ""); // Only allow digits
                  if (cleaned) {
                    handleOtpChange(cleaned, index); // Call your original logic
                  }
                }}
                onSubmitEditing={index === 5 ? verifyOtp : undefined}
                returnKeyType={index === 5 ? "done" : "next"}
              />
            ))}
          </View>

          <TouchableOpacity
            style={[styles.button, { opacity: isOtpComplete ? 1 : 1 }]}
            onPress={verifyOtp}
            disabled={!isOtpComplete}
          >
            <Text style={styles.buttonText}>Verify</Text>
          </TouchableOpacity>

          {isCounting ? (
            <Text style={styles.timerText}>Resend OTP in {timer}s</Text>
          ) : (
            <TouchableOpacity onPress={sendOtp}>
              <Text style={styles.resendText}>Resend OTP</Text>
            </TouchableOpacity>
          )}
        </View>
      </Modal>

      <Modal
        isVisible={loading}
        backdropColor="#000"
        backdropOpacity={0.6}
        style={{ margin: 0 }}
      >
        <View style={styles.fullscreenLoading}>
          <ActivityIndicator size="large" color="#f57c00" />
          <Text style={{ color: "#fff", marginTop: 12 }}>Sending OTP...</Text>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 24,
    paddingTop: 60,
    alignItems: "center",
  },
  loginLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#f57c00",
    borderWidth: 1,
    backgroundColor: "#fff",
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingVertical: 2,
    width: "100%",
    marginBottom: 20,
  },
  prefix: {
    fontSize: 16,
    color: "#333",
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  button: {
    backgroundColor: "#f57c00",
    paddingVertical: 14,
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  bottomSheetModal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  bottomModal: {
    backgroundColor: "#fff",
    padding: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
    alignItems: "center",
  },
  dragHandle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#ccc",
    alignSelf: "center",
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#888",
    marginBottom: 16,
  },
  otpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  otpBox: {
    width: 45,
    height: 50,
    borderWidth: 1,
    borderColor: "#f57c00",
    borderRadius: 10,
    textAlign: "center",
    fontSize: 18,
    color: "#000",
  },
  timerText: {
    color: "#888",
    fontSize: 14,
    marginTop: 10,
  },
  resendText: {
    color: "#f57c00",
    fontSize: 14,
    marginTop: 10,
    fontWeight: "bold",
  },
  warningCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    width: "100%",
    maxWidth: 340,
    alignSelf: "center",
  },
  warningIcon: {
    fontSize: 40,
    marginBottom: 12,
    color: "#f44336",
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#f57c00",
    marginBottom: 6,
  },
  warningMessage: {
    fontSize: 15,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
  warningButton: {
    backgroundColor: "#f57c00",
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 25,
  },
  warningButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  fullscreenLoading: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
});