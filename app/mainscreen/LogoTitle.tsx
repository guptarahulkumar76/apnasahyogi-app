import React, { useState } from "react";
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import LanguageModal from "../language/select"; // ✅ Adjust the path to your component

const LogoTitle = ({ showTranslateButton = true }) => {
  const [showLangModal, setShowLangModal] = useState(false);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.left}>
          <Image
            source={require("../../assets/images/adaptive-icon.png")}
            style={styles.image}
          />
          <Text style={styles.text}>Apna Sahyogi</Text>
        </View>

        {showTranslateButton && (
          <TouchableOpacity onPress={() => setShowLangModal(true)}>
            <Image
              source={require("../../assets/images/language_icon.png")}
              style={styles.image}
            />

            {/* <MaterialCommunityIcons name="translate" size={24} color="#007bff" /> */}
          </TouchableOpacity>
        )}
      </View>

      <LanguageModal
        isVisible={showLangModal}
        onClose={() => setShowLangModal(false)}
        onLanguageSet={() => {
          // do something after language selected
        }}
      />
    </>
  );
};

export default LogoTitle;
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingRight: 10,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  text: {
    color: "#f57c00",
    fontWeight: "bold",
    fontSize: 18,
  },
  image: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  langBtn: {
    backgroundColor: "#eee",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  langText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
