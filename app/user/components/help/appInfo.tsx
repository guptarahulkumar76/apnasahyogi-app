import React, { useState, useRef } from "react";
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, LayoutAnimation, Platform, UIManager, Animated 
} from "react-native";
import { Feather, MaterialIcons, FontAwesome5, AntDesign } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

// Enable LayoutAnimation on Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const AppInfoScreen = () => {
  const [expandedSections, setExpandedSections] = useState({
    features: true,
    usage: false,
    support: false,
  });

  // For arrow animation
  const rotateAnim = {
    features: useRef(new Animated.Value(expandedSections.features ? 1 : 0)).current,
    usage: useRef(new Animated.Value(expandedSections.usage ? 1 : 0)).current,
    support: useRef(new Animated.Value(expandedSections.support ? 1 : 0)).current,
  };

  const toggleSection = (section: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedSections(prev => {
      const newVal = !prev[section];

      // Animate arrow
      Animated.timing(rotateAnim[section], {
        toValue: newVal ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }).start();

      return { ...prev, [section]: newVal };
    });
  };

  const handleSupportPress = () => {
    Linking.openURL("mailto:support@apnasahyogi.com");
  };

  const createCardPressAnim = () => {
    const anim = new Animated.Value(1);
    const onPressIn = () => {
      Animated.spring(anim, { toValue: 0.95, useNativeDriver: true }).start();
    };
    const onPressOut = () => {
      Animated.spring(anim, { toValue: 1, friction: 3, useNativeDriver: true }).start();
    };
    return { anim, onPressIn, onPressOut };
  };

  const cardPressAnim = createCardPressAnim();

  return (
    <LinearGradient colors={['#fff6ee', '#ffe6cc']} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        

        {/* App Details Card */}
        <Animated.View style={[styles.card, { transform: [{ scale: cardPressAnim.anim }] }]}>
          <TouchableOpacity activeOpacity={0.9} onPressIn={cardPressAnim.onPressIn} onPressOut={cardPressAnim.onPressOut}>
            <View style={styles.row}>
              <Feather name="smartphone" size={20} color="#ff7900" />
              <Text style={styles.cardTitle}>App Name</Text>
            </View>
            <Text style={styles.cardText}>ApnaSahyogi</Text>

            <View style={styles.row}>
              <MaterialIcons name="system-update" size={20} color="#ff7900" />
              <Text style={styles.cardTitle}>Version</Text>
            </View>
            <Text style={styles.cardText}>1.0.0</Text>

            <View style={styles.row}>
              <Feather name="user" size={20} color="#ff7900" />
              <Text style={styles.cardTitle}>Developed By</Text>
            </View>
            <Text style={styles.cardText}>Rahul Gupta</Text>

            <View style={styles.row}>
              <FontAwesome5 name="globe" size={20} color="#ff7900" />
              <Text style={styles.cardTitle}>Purpose</Text>
            </View>
            <Text style={styles.cardText}>
              Connect users with trusted local vendors like plumber, electrician, carpenter, etc.
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Collapsible Sections */}
        {['features', 'usage', 'support'].map(section => {
          const titles: any = {
            features: "💡 Key Features",
            usage: "📝 Usage Instructions",
            support: "📞 Support",
          };
          const content: any = {
            features: [
              "• Book services like plumbing, electrical, carpentry, etc.",
              "• Verified vendors and ratings.",
              "• 24/7 Customer Support.",
              "• Multilingual app experience.",
              "• Secure data and OTP login system.",
            ],
            usage: [
              "1. Sign in as a User or Vendor.",
              "2. Browse services or manage your listings.",
              "3. Book or accept service requests.",
              "4. Track booking status and chat with each other.",
            ],
            support: [
              "support@apnasahyogi.com"
            ],
          };

          return (
            <View key={section}>
              <TouchableOpacity style={styles.sectionHeader} onPress={() => toggleSection(section)}>
                <Text style={styles.sectionTitle}>{titles[section]}</Text>
                <Animated.View style={{ transform: [{ rotate: rotateAnim[section].interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] }) }] }}>
                  <AntDesign name="down" size={18} color="#ff7900" />
                </Animated.View>
              </TouchableOpacity>
              {expandedSections[section] && (
                <Animated.View style={styles.card}>
                  {content[section].map((text: string, i: number) => (
                    <Text
                      key={i}
                      style={[
                        styles.cardText,
                        section === 'support' ? { color: "#ff7900", textDecorationLine: "underline" } : {}
                      ]}
                      onPress={section === 'support' ? handleSupportPress : undefined}
                    >
                      {text}
                    </Text>
                  ))}
                </Animated.View>
              )}
            </View>
          );
        })}

        {/* Footer */}
        <Text style={styles.footer}>© 2025 ApnaSahyogi. All rights reserved.</Text>
      </ScrollView>
    </LinearGradient>
  );
};

export default AppInfoScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#ff7900",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 5,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginLeft: 10,
  },
  cardText: {
    fontSize: 14,
    color: "#555",
    marginLeft: 30,
    marginBottom: 5,
    lineHeight: 22,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
    marginTop: 5,
    paddingHorizontal: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ff7900",
  },
  footer: {
    textAlign: "center",
    fontSize: 12,
    color: "#aaa",
    marginTop: 10,
  },
});
