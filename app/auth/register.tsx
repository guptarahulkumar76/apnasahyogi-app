import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  StatusBar,
  Image,
  KeyboardAvoidingView,
  Platform,
  Animated,
  PanResponder,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
// import storage from "@react-native-firebase/storage";
// import auth from "@react-native-firebase/auth";
import Constants from "expo-constants";
import uuid from "react-native-uuid";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import Modal from "react-native-modal";

const API_BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl;
const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function RegisterScreen() {
  const { phone, role } = useLocalSearchParams();
  const router = useRouter();
  const [image, setImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [showInvalidModal, setShowInvalidModal] = useState(false);
  const [invalidMessage, setInvalidMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Loading...");
  const [uploading, setUploading] = useState(false);
  const [location, setLocation] = useState(null);

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

  const panY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  const showModal = () => {
    setModalVisible(true);
    Animated.timing(panY, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const hideModal = () => {
    Animated.timing(panY, {
      toValue: SCREEN_HEIGHT,
      duration: 250,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 10,
      onPanResponderMove: Animated.event([null, { dy: panY }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100) {
          hideModal();
        } else {
          Animated.timing(panY, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const pickFromGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setLoadingMessage("Gallery permission required!");
      setLoading(true);
      setTimeout(() => setLoading(false), 2000);
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      hideModal();
    }
  };

  const pickFromCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      setLoadingMessage("Camera permission required!");
      setLoading(true);
      setTimeout(() => setLoading(false), 2000);
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      hideModal();
    }
  };

  // const uploadImageToFirebase = async (uri: string): Promise<string> => {
  //   setLoadingMessage("Uploading image...");
  //   setLoading(true);
  //   try {
  //     const currentUser = auth().currentUser;
  //     const uid = currentUser?.uid || uuid.v4();
  //     const filename = `profileImages/${uid}.jpg`;
  //     const ref = storage().ref(filename);
  //     await ref.putFile(uri);
  //     const downloadUrl = await ref.getDownloadURL();
  //     return downloadUrl;
  //   } catch (error) {
  //     console.error("Firebase Upload Error:", error);
  //     throw new Error("Failed to upload image");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async () => {
    if (!name.trim()) {
      setInvalidMessage("Please enter your name.");
      setShowInvalidModal(true);
      return;
    }
    if (password.trim().length < 6) {
      setInvalidMessage("Password must be at least 6 characters long.");
      setShowInvalidModal(true);
      return;
    }
    if (!address.trim()) {
      setInvalidMessage("Please enter your address.");
      setShowInvalidModal(true);
      return;
    }
    if (!city.trim()) {
      setInvalidMessage("Please enter your city.");
      setShowInvalidModal(true);
      return;
    }

    // try {
    //   setLoadingMessage("Processing registration...");
    //   setLoading(true);

    //   let profileImageUrl = "";
      // if (image) {
      //   profileImageUrl = await uploadImageToFirebase(image);
      // }

    //   const currentUser = auth().currentUser;
    //   if (!currentUser) {
    //     setLoadingMessage("User not authenticated");
    //     setTimeout(() => setLoading(false), 2000);
    //     return;
    //   }

    //   const idToken = await currentUser.getIdToken();
    //   let newLocation = location as any;
    //   newLocation.address = `${address}, ${city}`;
    //   const payload: any = {
    //     phone,
    //     name,
    //     role: role || "user",
    //     profileImageUrl,
    //     language: password,
    //     location: newLocation,
    //   };

    //   if (role === "vendor") {
    //     payload.category = "category";
    //     payload.experience = "experience";
    //     payload.subcategories = [];
    //     payload.isAvailable = true;
    //     payload.rating = 0;
    //     payload.serviceAreaRadius = 5;
    //   } else {
    //     payload.gender = "male";
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
    //     setLoadingMessage(result.message || "Registration successful!");
    //     setTimeout(async () => {
    //       await AsyncStorage.setItem("isLoggedIn", "true");
    //       await AsyncStorage.setItem(
    //         role === "vendor" ? "vendorData" : "userData",
    //         JSON.stringify(result.data)
    //       );
    //       setLoading(false);
    //       router.replace(
    //         role === "vendor" ? "/vendor/dashboard" : "/user/components/dashboardSkelton"
    //       );
    //     }, 2000);
    //   } else {
    //     setLoadingMessage(result.message || "Registration failed");
    //     setTimeout(() => setLoading(false), 2000);
    //   }
    // } catch (error: any) {
    //   console.error("Registration Exception:", error);
    //   setLoadingMessage(error.message || "Something went wrong");
    //   setTimeout(() => setLoading(false), 2000);
    // }
    //       await AsyncStorage.setItem("isLoggedIn", "true");
    //       await AsyncStorage.setItem(
    //         role === "vendor" ? "vendorData" : "userData",
    //         JSON.stringify(result.data)
    //       );
    //       setLoading(false);
    //       router.replace(
    //         role === "vendor" ? "/vendor/dashboard" : "/user/components/dashboardSkelton"
    //       );
    //     }, 2000);
    //   } else {
    //     setLoadingMessage(result.message || "Registration failed");
    //     setTimeout(() => setLoading(false), 2000);
    //   }
    // } catch (error: any) {
    //   console.error("Registration Exception:", error);
    //   setLoadingMessage(error.message || "Something went wrong");
    //   setTimeout(() => setLoading(false), 2000);
    // }
          await AsyncStorage.setItem("isLoggedIn", "true");
          setLoading(false);
          router.replace(
            role === "vendor" ? "/vendor/dashboard" : "/user/components/dashboardSkelton"
          );

  };

  const inputRefs = {
    password: useRef(null),
    address: useRef(null),
    city: useRef(null),
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.form}>
          <View style={styles.imageContainer}>
            <View style={styles.imageWrapper}>
              <TouchableOpacity onPress={showModal}>
                {image ? (
                  <Image source={{ uri: image }} style={styles.imagePreview} />
                ) : (
                  <View style={styles.placeholder}>
                    <MaterialIcons name="person" size={40} color="#fb8c00" />
                  </View>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={showModal}
                style={styles.cameraIconContainer}
              >
                <MaterialIcons name="photo-camera" size={16} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.label}>Full Name</Text>
          <TextInput
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
            style={styles.input}
            returnKeyType="next"
            onSubmitEditing={() => inputRefs.password.current.focus()}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            ref={inputRefs.password}
            placeholder="Enter password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            returnKeyType="next"
            onSubmitEditing={() => inputRefs.address.current.focus()}
          />

          <Text style={styles.label}>Address</Text>
          <TextInput
            ref={inputRefs.address}
            placeholder="Enter your address"
            value={address}
            onChangeText={setAddress}
            style={styles.input}
            returnKeyType="next"
            onSubmitEditing={() => inputRefs.city.current.focus()}
          />

          <Text style={styles.label}>City</Text>
          <TextInput
            ref={inputRefs.city}
            placeholder="Enter your city"
            value={city}
            onChangeText={setCity}
            style={styles.input}
            returnKeyType="done"
          />

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.warningButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Image Picker Modal */}
      <Modal
        isVisible={modalVisible}
        onBackdropPress={hideModal}
        onSwipeComplete={hideModal}
        swipeDirection="down"
        animationIn="slideInUp"
        animationOut="slideOutDown"
        backdropColor="#000"
        backdropOpacity={0.2}
        style={styles.bottomSheetModal}
      >
        <View style={styles.modalBox} {...panResponder.panHandlers}>
          <View style={styles.dragHandle} />
          <View style={styles.modalHeader}>
            <Ionicons
              name="close"
              size={24}
              color="black"
              onPress={hideModal}
            />
            <Text style={styles.modalTitle}>Profile photo</Text>
            <MaterialIcons
              name="delete-outline"
              size={24}
              color="#fb8c00"
              onPress={() => {
                setImage(null);
                hideModal();
              }}
            />
          </View>
          <View style={styles.optionRow}>
            <TouchableOpacity style={styles.optionBox} onPress={pickFromCamera}>
              <MaterialIcons name="photo-camera" size={24} color="#fb8c00" />
              <Text style={{ color: "#444" }}>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionBox}
              onPress={pickFromGallery}
            >
              <MaterialIcons name="photo-library" size={24} color="#fb8c00" />
              <Text style={{ color: "#444" }}>Gallery</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Warning Modal */}
      <Modal
        isVisible={showInvalidModal}
        onBackdropPress={() => setShowInvalidModal(false)}
      >
        <View style={styles.warningCard}>
          <Text style={styles.warningIcon}>⚠</Text>
          <Text style={styles.warningTitle}>Invalid Input</Text>
          <Text style={styles.warningMessage}>{invalidMessage}</Text>
          <TouchableOpacity
            onPress={() => setShowInvalidModal(false)}
            style={styles.warningButton}
          >
            <Text style={styles.warningButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Loading Modal with Dynamic Message */}
      <Modal
        isVisible={loading}
        backdropColor="#000"
        backdropOpacity={0.6}
        style={{ margin: 0 }}
      >
        <View style={styles.fullscreenLoading}>
          <ActivityIndicator size="large" color="#f57c00" />
          <Text style={{ color: "#fff", marginTop: 12 }}>{loadingMessage}</Text>
        </View>
      </Modal>
    </ScrollView>
  );
}

// Styles remain mostly same, with a few added for the warning modal
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff8f2",
    padding: 20,
  },
  form: {
    marginTop: 10,
  },
  label: {
    marginBottom: 6,
    marginTop: 12,
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  input: {
    backgroundColor: "#fff",
    borderColor: "#fb8c00",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
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
  // imagePicker: {
  //   alignSelf: "center",
  //   borderWidth: 1,
  //   borderColor: "#fb8c00",
  //   borderRadius: 100,
  //   padding: 10,
  //   marginBottom: 20,
  //   width: 100,
  //   height: 100,
  //   justifyContent: "center",
  //   alignItems: "center",
  //   backgroundColor: "#fff",
  //   overflow: "hidden",
  // },
  // imagePreview: {
  //   width: "100%",
  //   height: "100%",
  //   borderRadius: 100,
  // },
  modalBox: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30,
  },
  dragHandle: {
    width: 50,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 8,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  optionBox: {
    alignItems: "center",
    gap: 8,
    width: 100,
    height: 80,
    justifyContent: "center",
    borderRadius: 12,
    borderColor: "#fb8c00",
    borderWidth: 1,
    backgroundColor: "#fffaf3",
  },
  bottomSheetModal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  // Warning modal styles
  warningCard: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 16,
    alignItems: "center",
    marginHorizontal: 24,
  },
  warningIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  warningTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#e65100",
    marginBottom: 5,
  },
  warningMessage: {
    color: "#555",
    textAlign: "center",
    marginBottom: 16,
  },
  warningButton: {
    marginTop: 10,
    backgroundColor: "#fb8c00",
    borderRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 32,
  },
  warningButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },

  imageWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: "visible", // <-- this is important!
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eee",
  },

  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
    resizeMode: "cover",
  },

  placeholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  cameraIconContainer: {
    position: "absolute",
    bottom: -2, // move slightly out of the circle
    right: -2, // move slightly out of the circle
    backgroundColor: "#fb8c00",
    borderRadius: 20,
    padding: 6,
    borderWidth: 2,
    borderColor: "white",
    zIndex: 10,
  },
  fullscreenLoading: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
});
