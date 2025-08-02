import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack } from "expo-router";
import { I18nextProvider } from "react-i18next";
import i18n from "../lib/i18n";
import "../lib/i18n"; // Make sure it's initialized
import LogoTitle from "./mainscreen/LogoTitle";
import LocationBar from "./user/components/ui/locationBar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <I18nextProvider i18n={i18n}>
          <Stack
            screenOptions={{
              headerStyle: { backgroundColor: "#ffffff" },
              headerTintColor: "#333",
              headerTitleStyle: { fontWeight: "bold" },
            }}
          >
            <Stack.Screen
              name="mainscreen/OnboardingScreen"
              options={{
                headerTitle: () => <LogoTitle />,
                headerTitleAlign: "left",
                headerBackVisible: false,
              }}
            />
            <Stack.Screen
              name="auth/login"
              options={{
                headerTitle: () => <LogoTitle />,
                headerTitleAlign: "left",
                headerBackVisible: false,
              }}
            />
            <Stack.Screen
              name="auth/otp"
              options={{
                headerTitle: () => <LogoTitle showTranslateButton={false} />,
                headerTitleAlign: "left",
                headerBackVisible: false,
              }}
            />
             <Stack.Screen
              name="auth/register"
              options={{
                headerTitle: () => <LogoTitle />,
                headerTitleAlign: "left",
                headerBackVisible: false,
              }}
            />
            <Stack.Screen
              name="user/dashboard"
              options={{
                headerShown: true,
                headerTitle: () => <LocationBar />,
                headerTitleAlign: "left",
                headerBackVisible: false,
              }}
            />
            <Stack.Screen
              name="user/notification"
              options={{
                headerShown: true,
                headerTitle: "Notification",
                headerTitleAlign: "left",
              }}
            />
            <Stack.Screen
              name="user/profile"
              options={{
                headerShown: true,
                headerTitle: "Profile",
                headerTitleAlign: "left",
              }}
            />
            <Stack.Screen
              name="user/components/connect/vendorConnect"
              options={{
                headerShown: true,
                headerTitle: "Vendor",
                headerTitleAlign: "left",
              }}
            />
            <Stack.Screen
              name="user/components/ui/help"
              options={{
                headerShown: true,
                headerTitle: "Help",
                headerTitleAlign: "left",
              }}
            />
            <Stack.Screen
              name="user/components/ui/subscription"
              options={{
                headerShown: true,
                headerTitle: "Subscription",
                headerTitleAlign: "left",
              }}
            />
            <Stack.Screen
              name="user/components/ui/language"
              options={{
                headerShown: true,
                headerTitle: "Choose Language",
                headerTitleAlign: "left",
              }}
            />
            <Stack.Screen
              name="user/components/ui/location"
              options={{
                headerShown: true,
                headerTitle: "Location",
                headerTitleAlign: "left",
              }}
            />
            <Stack.Screen
              name="user/components/ui/policies"
              options={{
                headerShown: true,
                headerTitle: "Policies",
                headerTitleAlign: "left",
              }}
            />
            <Stack.Screen
              name="user/components/connect/imageView"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="user/components/connect/bookingScreen"
              options={{ headerShown: true, headerTitle: "Book" }}
            />
            <Stack.Screen
              name="user/components/connect/submitBook"
              options={{ headerShown: true, headerTitle: "Booked" }}
            />
            <Stack.Screen
              name="tabs/booking"
              options={{ headerShown: true, headerTitle: "Your Booking" }}
            />
            <Stack.Screen
              name="tabs/connection"
              options={{ headerShown: true, headerTitle: "Your Connection" }}
            />
            <Stack.Screen name="+not-found" />
          </Stack>
        </I18nextProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
