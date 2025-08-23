// ProfileScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

export default function ProfileScreen() {
  const [profileImage, setProfileImage] = useState(
    "https://randomuser.me/api/portraits/men/41.jpg"
  );
  const [isImageOpen, setIsImageOpen] = useState(false);

  const user = {
    name: "Rahul Sharma",
    profession: "Plumber",
    rating: 4.7,
    experience: "5 years",
    phone: "+91 9876543210",
    email: "rahul.sharma@example.com",
    location: "Delhi, India",
    joinedDate: "Jan 2021",
  };

  // 📸 Pick image from gallery
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Image */}
      <View style={styles.header}>
        <View style={styles.imageWrapper}>
          <TouchableOpacity onPress={() => setIsImageOpen(true)}>
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.editIcon} onPress={pickImage}>
            <Ionicons name="camera" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.profession}>{user.profession}</Text>
      </View>

      {/* Rating & Experience */}
      <View style={styles.statsRow}>
        <View style={styles.statsBox}>
          <Ionicons name="star" size={20} color="#ff9800" />
          <Text style={styles.statsText}>{user.rating} Rating</Text>
        </View>
        <View style={styles.statsBox}>
          <MaterialIcons name="work" size={20} color="#ff9800" />
          <Text style={styles.statsText}>{user.experience}</Text>
        </View>
      </View>

      {/* Contact Details */}
      <View style={styles.detailsCard}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        <View style={styles.infoRow}>
          <Ionicons name="call" size={20} color="#f57c00" />
          <Text style={styles.infoText}>{user.phone}</Text>
        </View>
        <View style={styles.infoRow}>
          <MaterialIcons name="email" size={20} color="#f57c00" />
          <Text style={styles.infoText}>{user.email}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="location" size={20} color="#f57c00" />
          <Text style={styles.infoText}>{user.location}</Text>
        </View>
      </View>

      {/* Joined Date */}
      <View style={styles.detailsCard}>
        <Text style={styles.sectionTitle}>Profile Details</Text>
        <View style={styles.infoRow}>
          <FontAwesome name="calendar" size={20} color="#f57c00" />
          <Text style={styles.infoText}>Joined: {user.joinedDate}</Text>
        </View>
      </View>

      {/* Full Screen Image Modal */}
      <Modal visible={isImageOpen} transparent={true}>
        <View style={styles.modalBackground}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => setIsImageOpen(false)}
          >
            <Ionicons name="close" size={30} color="#fff" />
          </TouchableOpacity>
          <Image source={{ uri: profileImage }} style={styles.fullImage} />
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { alignItems: "center", marginTop: 20 },
  imageWrapper: { position: "relative" },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#ff9800",
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#ff9800",
    padding: 6,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#fff",
  },
  name: { fontSize: 22, fontWeight: "bold", marginTop: 10, color: "#333" },
  profession: { fontSize: 16, color: "#777", marginBottom: 15 },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 15,
  },
  statsBox: { flexDirection: "row", alignItems: "center", gap: 6 },
  statsText: { fontSize: 16, fontWeight: "500", color: "#333" },

  detailsCard: {
    backgroundColor: "#fff3e0",
    margin: 12,
    padding: 15,
    borderRadius: 12,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#f57c00",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 10,
  },
  infoText: { fontSize: 16, color: "#444" },

  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeBtn: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 1,
  },
  fullImage: {
    width: "90%",
    height: "70%",
    borderRadius: 12,
    resizeMode: "contain",
  },
});
