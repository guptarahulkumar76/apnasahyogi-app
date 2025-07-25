import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
// import storage from "@react-native-firebase/storage";
// import auth from "@react-native-firebase/auth";
import { useLocalSearchParams, useRouter } from "expo-router";
import uuid from "react-native-uuid";
import Constants from "expo-constants";

const API_BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl;

export default function RegisterScreen() {
  const { phone, role } = useLocalSearchParams<{ phone?: string; role?: "user" | "vendor" }>();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState(phone || "");
  const [location, setLocation] = useState<any>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const [category, setCategory] = useState("");
  const [experience, setExperience] = useState("");

  // 📍 Get Location
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

  // 🖼️ Pick Image
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

  // ☁️ Upload to Firebase Storage
  // const uploadImageToFirebase = async (uri: string): Promise<string> => {
  //   setUploading(true);
  //   const filename = `profileImages/${uuid.v4()}.jpg`;
  //   const ref = storage().ref(filename);

  //   await ref.putFile(uri);
  //   const downloadUrl = await ref.getDownloadURL();
  //   setUploading(false);
  //   return downloadUrl;
  // };

  // 📩 Submit Form
  const handleRegister = async () => {
    router.replace(role === "vendor" ? "/vendor/dashboard" : "/user/dashboard");
    // try {
    //   let profileImageUrl = "";
    //   if (profileImage) {
    //     profileImageUrl = await uploadImageToFirebase(profileImage);
    //   }

    //   const currentUser = auth().currentUser;
    //   if (!currentUser) return alert("User not authenticated");

    //   const idToken = await currentUser.getIdToken();

    //   const payload: any = {
    //     mobile,
    //     name,
    //     email,
    //     role: role || "user",
    //     location,
    //     profileImage: profileImageUrl,
    //   };

    //   if (role === "vendor") {
    //     payload.category = category;
    //     payload.experience = experience;
    //   }

    //   const res = await fetch(`${API_BASE_URL}/auth/register`, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${idToken}`,
    //     },
    //     body: JSON.stringify(payload),
    //   });

    //   const result = await res.json();
    //   if (res.ok) {
    //     alert(result.message || "Registered successfully");
    //     router.replace(role === "vendor" ? "/vendor/dashboard" : "/user/dashboard");
    //   } else {
    //     alert(result.message || "Registration failed");
    //   }
    // } catch (err) {
    //   console.error(err);
    //   alert("Something went wrong. Try again.");
    // }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <Text style={styles.title}>Register as {role?.toUpperCase()}</Text>

      <TouchableOpacity onPress={pickImage} style={{ alignItems: "center", marginBottom: 20 }}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={{ color: "#777" }}>Pick Profile Image</Text>
          </View>
        )}
      </TouchableOpacity>

      <TextInput style={styles.input} value={mobile} editable={false} />
      <TextInput style={styles.input} placeholder="Full Name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Email Address" value={email} onChangeText={setEmail} keyboardType="email-address" />

      {role === "vendor" && (
        <>
          <TextInput style={styles.input} placeholder="Service Category" value={category} onChangeText={setCategory} />
          <TextInput style={styles.input} placeholder="Experience (e.g. 5 years)" value={experience} onChangeText={setExperience} />
        </>
      )}

      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={uploading}>
        {uploading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Register</Text>}
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fffef6",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#ff8800",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 14,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#ff8800",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 12,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },
});
