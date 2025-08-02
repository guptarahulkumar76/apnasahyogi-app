import React, { useState, useRef } from "react";
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
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import Modal from "react-native-modal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function RegisterForm() {
  const [image, setImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // address state replaces mohalla everywhere
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [showInvalidModal, setShowInvalidModal] = useState(false);
  const [invalidMessage, setInvalidMessage] = useState("");
  const router = useRouter();

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

  const translateY = panY.interpolate({
    inputRange: [-1, 0, SCREEN_HEIGHT],
    outputRange: [0, 0, SCREEN_HEIGHT],
  });

  // All fields must be filled
  const isFormValid = (
    name.trim() !== "" &&
    password.trim().length >= 6 &&
    address.trim() !== "" &&
    city.trim() !== ""
  );

  const pickFromGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return alert("Gallery permission required!");
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
    if (!permission.granted) return alert("Camera permission required!");
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      hideModal();
    }
  };

  const handleSubmit = async() => {
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

    // All good, proceed
    console.log({ name, password, address, city, image });
    const formData = { image, name, password, address, city };
    console.log("Submitted:", formData);
    await AsyncStorage.setItem("isLoggedIn", "true");
    router.replace("/user/dashboard");
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

              {/* Camera icon absolutely placed */}
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

          {/* Address */}
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

      {/* Bottom Sheet Modal for image picker */}
      <Modal
        isVisible={modalVisible}
        onBackdropPress={hideModal}
        onSwipeComplete={hideModal}
        swipeDirection="down"
        animationIn="slideInUp"
        animationOut="slideOutDown"
        animationInTiming={300}
        animationOutTiming={300}
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

      {/* Warning/Invalid Input Modal */}
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
  right: -2,  // move slightly out of the circle
  backgroundColor: "#fb8c00",
  borderRadius: 20,
  padding: 6,
  borderWidth: 2,
  borderColor: "white",
  zIndex: 10,
},




});
