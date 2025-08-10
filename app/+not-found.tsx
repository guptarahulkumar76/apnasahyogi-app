import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Page Not Found" }} />
      <LinearGradient
        colors={["#ffffff", "#ffe0b2"]}
        style={styles.container}
      >
        <Image
          source={require("../assets/images/icon.png")} // Replace with your own illustration
          style={styles.image}
          resizeMode="contain"
        />

        <Text style={styles.title}>Oops! Page Not Found</Text>
        <Text style={styles.subtitle}>
          The page you’re looking for doesn’t exist or has been moved.
        </Text>

        <TouchableOpacity style={styles.button}>
          <Link href="/" asChild>
            <Text style={styles.buttonText}>Go Back Home</Text>
          </Link>
        </TouchableOpacity>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  image: {
    width: 220,
    height: 220,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#f57c00",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "#f57c00",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
