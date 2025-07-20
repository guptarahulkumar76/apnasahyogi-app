import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const languages = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "hn", label: "Hinglish" }, // Hinglish instead of Marathi
];

const LanguageScreen = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  // Load language on mount
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const storedLanguage = await AsyncStorage.getItem("language");
        if (storedLanguage) {
          setSelectedLanguage(storedLanguage);
        }
      } catch (error) {
        console.error("Failed to load language:", error);
      }
    };

    loadLanguage();
  }, []);

  const handleSelectLanguage = async (code: string) => {
    try {
      await AsyncStorage.setItem("language", code);
      setSelectedLanguage(code);
      console.log("Selected Language:", code);
    } catch (error) {
      console.error("Failed to save language:", error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={languages}
        keyExtractor={(item) => item.code}
        renderItem={({ item }) => {
          const isSelected = item.code === selectedLanguage;

          return (
            <TouchableOpacity
              style={styles.option}
              onPress={() => handleSelectLanguage(item.code)}
            >
              <View style={styles.radioCircle}>
                {isSelected && <View style={styles.selectedDot} />}
              </View>
              <Text style={styles.languageText}>{item.label}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default LanguageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fffaf5",
    paddingTop: 25,
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
    color: "#333",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  radioCircle: {
    height: 22,
    width: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#ff7900",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  selectedDot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "#ff7900",
  },
  languageText: {
    fontSize: 16,
    color: "#333",
  },
});
