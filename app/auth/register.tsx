import React, { useEffect, useState, useCallback } from "react";
import {
  View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Platform,
  ActivityIndicator, KeyboardAvoidingView, ScrollView
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import storage from "@react-native-firebase/storage";
import auth from "@react-native-firebase/auth";
import Constants from "expo-constants";
import uuid from "react-native-uuid";
import { useLocalSearchParams, useRouter } from "expo-router";
import DropDownPicker from "react-native-dropdown-picker";
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl;

const genderOptions = [
  { label: "Male 🚹", value: "male" },
  { label: "Female 🚺", value: "female" },
  { label: "Other 🏳️‍🌈", value: "other" },
];
const languageOptions = [
  { label: "Hindi", value: "Hindi" },
  { label: "English", value: "English" },
  { label: "Marathi", value: "Marathi" },
  { label: "Punjabi", value: "Punjabi" },
];
const categoryOptions = [
  { label: "Electrician", value: "Electrician" },
  { label: "Plumber", value: "Plumber" },
  { label: "Carpenter", value: "Carpenter" },
  { label: "Painter", value: "Painter" },
];
const experienceOptions = [
  { label: "1 year", value: "1 year" },
  { label: "2 years", value: "2 years" },
  { label: "3 years", value: "3 years" },
  { label: "5 years", value: "5 years" },
  { label: "10+ years", value: "10+ years" },
];

export default function RegisterScreen() {
  const { phone, role } = useLocalSearchParams();
  const router = useRouter();
  const [step, setStep] = useState(1);

  // State for fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState(phone || "");

  // Dropdowns (all start empty string)
  const [genderOpen, setGenderOpen] = useState(false);
  const [gender, setGender] = useState("");
  const [genderItems, setGenderItems] = useState(genderOptions);

  const [languageOpen, setLanguageOpen] = useState(false);
  const [language, setLanguage] = useState("");
  const [languageItems, setLanguageItems] = useState(languageOptions);

  const [categoryOpen, setCategoryOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [categoryItems, setCategoryItems] = useState(categoryOptions);

  const [experienceOpen, setExperienceOpen] = useState(false);
  const [experience, setExperience] = useState("");
  const [experienceItems, setExperienceItems] = useState(experienceOptions);

  // Other state
  const [profileImage, setProfileImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Only one dropdown open at a time
  const onGenderOpen = useCallback(() => {
    setLanguageOpen(false); setCategoryOpen(false); setExperienceOpen(false);
  }, []);
  const onLanguageOpen = useCallback(() => {
    setGenderOpen(false); setCategoryOpen(false); setExperienceOpen(false);
  }, []);
  const onCategoryOpen = useCallback(() => {
    setGenderOpen(false); setLanguageOpen(false); setExperienceOpen(false);
  }, []);
  const onExperienceOpen = useCallback(() => {
    setGenderOpen(false); setLanguageOpen(false); setCategoryOpen(false);
  }, []);

  // Get location
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const loc = await Location.getCurrentPositionAsync({});
        const address = await Location.reverseGeocodeAsync(loc.coords);
        setLocation({
          lat: loc.coords.latitude,
          lng: loc.coords.longitude,
          city: address[0]?.city || "",
          pincode: address[0]?.postalCode || "",
        });
      }
    })();
  }, []);

  // Image picker
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return alert("Permission denied!");
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled && result.assets.length > 0) {
      setProfileImage(result.assets[0].uri);
    }
  };

  // Validation for next/register buttons
  const step1Valid = name.trim() && email.trim();
  const step2Valid = gender && language && profileImage;
  const step3Valid = category && experience;

  const uploadImageToFirebase = async (uri: string): Promise<string> => {
  setUploading(true);
  try {
    const currentUser = auth().currentUser;
    const uid = currentUser?.uid || uuid.v4();
    const filename = `profileImages/${uid}.jpg`;  // Or use: `${mobile}.jpg` if mobile is unique
    const ref = storage().ref(filename);
    
    await ref.putFile(uri);
    const downloadUrl = await ref.getDownloadURL();
    return downloadUrl;
  } catch (error) {
    console.error("Firebase Upload Error:", error);
    throw new Error("Failed to upload image");
  } finally {
    setUploading(false);
  }
};


  // Register handler
  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !gender || !language || !profileImage ||
      (role === "vendor" && (!category || !experience))) {
      setErrorMsg("Please fill all required fields and select every dropdown.");
      return;
    }
    setErrorMsg("");
    // ... API submission logic ...
    // Simulate navigation
    try {
    let profileImageUrl = "";
    if (profileImage) {
      profileImageUrl = await uploadImageToFirebase(profileImage);
    }

    const currentUser = auth().currentUser;
    if (!currentUser) {
      alert("User not authenticated");
      return;
    }

    const idToken = await currentUser.getIdToken();
    const payload: any = {
      mobile,
      name,
      role: role || "user",
      profileImageUrl,
      language,
      location,
    };

    if (role === "vendor") {
      payload.category = category;
      payload.experience = experience;
      payload.subcategories = []; // You can capture this later via UI
      payload.isAvailable = true;
      payload.rating = 0;
      payload.serviceAreaRadius = 5;
    } else {
      payload.gender = gender;
    }

    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    if (res.ok) {
      await AsyncStorage.setItem("isLoggedIn", "true");
      await AsyncStorage.setItem(role === "vendor" ? 'vendorData':'userData', JSON.stringify(result.data));
      alert(result.message || "Registration successful");
      router.replace(role === "vendor" ? "/vendor/dashboard" : "/user/dashboard");
    } else {
      console.warn("Register error:", result);
      alert(result.message || "Registration failed");
    }
  } catch (error: any) {
    console.error("Registration Exception:", error);
    alert(error.message || "Something went wrong during registration.");
  }
    // router.replace(role === "vendor" ? "/vendor/dashboard" : "/user/dashboard");
  };

  // Step UI
  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Register as {role?.toUpperCase()}</Text>

        {/* Step indicator */}
        <View style={styles.stepsContainer}>
          <StepCircle active={step === 1} label="1" />
          <StepLine />
          <StepCircle active={step === 2} label="2" />
          {role === "vendor" && (<><StepLine /><StepCircle active={step === 3} label="3" /></>)}
        </View>

        {/* Error message */}
        {errorMsg ? (
          <Text style={{ color: 'red', marginBottom: 8, textAlign: 'center' }}>{errorMsg}</Text>
        ) : null}

        {/* Step 1 */}
        {step === 1 && (
          <>
            <Text style={styles.subtitle}>Personal Details</Text>
            <TextInput style={styles.input} value={mobile} editable={false} placeholder="Mobile Number" />
            <TextInput style={styles.input} placeholder="Full Name" value={name} onChangeText={setName} />
            <TextInput style={styles.input} placeholder="Email Address" value={email} onChangeText={setEmail} keyboardType="email-address" />
            <TouchableOpacity
              style={[styles.button, { backgroundColor: step1Valid ? "#ff8800" : "#ccc" }]}
              onPress={() => { setErrorMsg(""); setStep(2); }}
              disabled={!step1Valid}
            >
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <>
            <Text style={styles.subtitle}>Profile Info</Text>
            <View style={{ zIndex: 3000, marginBottom: 12 }}>
              <DropDownPicker
                open={genderOpen}
                value={gender}
                items={genderItems}
                setOpen={setGenderOpen}
                setValue={setGender}
                setItems={setGenderItems}
                onOpen={onGenderOpen}
                placeholder="Select Gender"
                style={pickerStyle}
                dropDownContainerStyle={pickerDropdownStyle}
                listMode="MODAL"
                modalProps={{ animationType: "slide" }}
              />
            </View>
            <View style={{ zIndex: 2000, marginBottom: 12 }}>
              <DropDownPicker
                open={languageOpen}
                value={language}
                items={languageItems}
                setOpen={setLanguageOpen}
                setValue={setLanguage}
                setItems={setLanguageItems}
                onOpen={onLanguageOpen}
                placeholder="Select Language"
                style={pickerStyle}
                dropDownContainerStyle={pickerDropdownStyle}
                listMode="MODAL"
                modalProps={{ animationType: "slide" }}
              />
            </View>
            <TouchableOpacity onPress={pickImage} style={{ alignItems: "center", marginBottom: 20 }}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Text style={{ color: "#777" }}>Pick Profile Image</Text>
                </View>
              )}
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity style={[styles.button, { backgroundColor: "#ccc", flex: 1, marginRight: 4 }]} 
                onPress={() => { setErrorMsg(""); setStep(1); }}>
                <Text style={styles.buttonText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: step2Valid ? "#ff8800" : "#ccc", flex: 1, marginLeft: 4 }]}
                onPress={() => {
                  if (step2Valid) {
                    setErrorMsg(""); if (role === "vendor") setStep(3);
                    else handleRegister();
                  } else {
                    setErrorMsg("Please select all the fields and image");
                  }
                }}
                disabled={!step2Valid}
              >
                <Text style={styles.buttonText}>{role === "vendor" ? "Next" : "Register"}</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Step 3 (Vendor Only) */}
        {step === 3 && role === "vendor" && (
          <>
            <Text style={styles.subtitle}>Vendor Details</Text>
            <View style={{ zIndex: 1500, marginBottom: 12 }}>
              <DropDownPicker
                open={categoryOpen}
                value={category}
                items={categoryItems}
                setOpen={setCategoryOpen}
                setValue={setCategory}
                setItems={setCategoryItems}
                onOpen={onCategoryOpen}
                placeholder="Select Category"
                style={pickerStyle}
                dropDownContainerStyle={pickerDropdownStyle}
                listMode="MODAL"
                modalProps={{ animationType: "slide" }}
              />
            </View>
            <View style={{ zIndex: 1000, marginBottom: 12 }}>
              <DropDownPicker
                open={experienceOpen}
                value={experience}
                items={experienceItems}
                setOpen={setExperienceOpen}
                setValue={setExperience}
                setItems={setExperienceItems}
                onOpen={onExperienceOpen}
                placeholder="Select Experience"
                style={pickerStyle}
                dropDownContainerStyle={pickerDropdownStyle}
                listMode="MODAL"
                modalProps={{ animationType: "slide" }}
              />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity style={[styles.button, { backgroundColor: "#ccc", flex: 1, marginRight: 4 }]} 
                onPress={() => { setErrorMsg(""); setStep(2); }}>
                <Text style={styles.buttonText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: step3Valid ? "#ff8800" : "#ccc", flex: 1, marginLeft: 4 }]}
                onPress={() => {
                  if (step3Valid) { setErrorMsg(""); handleRegister(); }
                  else { setErrorMsg("Please select category and experience"); }
                }}
                disabled={!step3Valid}
              >
                <Text style={styles.buttonText}>Register</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {uploading && <ActivityIndicator color="#ff8800" style={{ marginTop: 15 }} />}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Step Indicator Components
const StepCircle = ({ active, label }) => (
  <View style={[styles.stepCircle, active && styles.stepActive]}>
    <Text style={{ color: active ? "#fff" : "#ff8800", fontWeight: "bold" }}>{label}</Text>
  </View>
);
const StepLine = () => <View style={styles.stepLine} />;

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fffef6", padding: 24 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 12, color: "#ff8800", textAlign: "center" },
  subtitle: { fontSize: 18, fontWeight: "600", marginVertical: 10, color: "#555" },
  input: {
    borderWidth: 1, borderColor: "#ddd", padding: 14, borderRadius: 10,
    fontSize: 16, marginBottom: 16, backgroundColor: "#fff"
  },
  button: {
    backgroundColor: "#ff8800", padding: 16, borderRadius: 10,
    alignItems: "center", marginTop: 12, marginBottom: 30,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  profileImage: { width: 100, height: 100, borderRadius: 50 },
  imagePlaceholder: {
    width: 100, height: 100, borderRadius: 50, backgroundColor: "#eee",
    justifyContent: "center", alignItems: "center"
  },
  stepsContainer: {
    flexDirection: 'row', alignItems: 'center', alignSelf: "center", marginBottom: 18,
  },
  stepCircle: {
    width: 32, height: 32, borderRadius: 16, borderWidth: 2,
    borderColor: "#ff8800", backgroundColor: "#fff", alignItems: "center", justifyContent: "center",
  },
  stepActive: { backgroundColor: "#ff8800" },
  stepLine: {
    width: 24, height: 2, backgroundColor: "#ff8800",
    marginHorizontal: 2,
  },
});
const pickerStyle = {
  borderWidth: 1,
  borderColor: "#ddd",
  borderRadius: 10,
  minHeight: 52,
  backgroundColor: "#fff",
};
const pickerDropdownStyle = {
  borderWidth: 1,
  borderColor: "#ddd",
  borderRadius: 10,
  backgroundColor: "#fff",
  zIndex: 1,
  elevation: 3,
};
