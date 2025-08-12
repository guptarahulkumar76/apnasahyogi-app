// LocationBar.tsx
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Platform,
  TouchableOpacity,
  Modal,
  Alert,
  Pressable,
  TextInput,
  ScrollView,
} from "react-native";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getNotification } from "../../notification";
import NotificationButton from "./NotificationButton";
import ProfileButton from "./ProfileButton";

const screenWidth = Dimensions.get("window").width;
const FETCH_TIMEOUT = 10000;
const MAX_MANUAL_LOCATIONS = 5;

export default function LocationBar() {
  const [location, setLocation] = useState<{
    city?: string;
    region?: string;
    area?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [manual, setManual] = useState(false);
  const [manualAddresses, setManualAddresses] = useState<any[]>([]);
  const [isManualModalOpen, setManualModalOpen] = useState(false);
  const [manualArea, setManualArea] = useState("");
  const [manualCity, setManualCity] = useState("");
  const [manualRegion, setManualRegion] = useState("");
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const getStoredManualAddresses = async () => {
    const data = await AsyncStorage.getItem("manual_addresses");
    return data ? JSON.parse(data) : [];
  };

  const storeManualAddresses = async (addresses: any[]) => {
    await AsyncStorage.setItem("manual_addresses", JSON.stringify(addresses));
  };

  const detectLocation = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocation({
          city: "Permission",
          region: "Denied",
          area: "Unavailable",
        });
        setLoading(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      const geocode = await Location.reverseGeocodeAsync(loc.coords);
      if (geocode.length > 0) {
        const place = geocode[0];
        const detectedLocation = {
          city: place.city || place.district,
          region: place.region,
          area:
            place.subLocality ||
            place.name ||
            place.street ||
            place.subregion ||
            place.city ||
            "",
        };
        setLocation(detectedLocation);
        setManual(false);
        setLoading(false);
      }
    } catch {
      setLoading(false);
    }
  };

  useEffect(() => {
    let didTimeout = false;

    timeoutRef.current = setTimeout(() => {
      didTimeout = true;
      setDropdownOpen(true);
      setLoading(false);
    }, FETCH_TIMEOUT);

    (async () => {
      const savedAddresses = await getStoredManualAddresses();
      setManualAddresses(savedAddresses);

      if (savedAddresses.length > 0) {
        setLocation(savedAddresses[savedAddresses.length - 1]);
        setManual(true);
        setLoading(false);
        clearTimeout(timeoutRef.current!);
        return;
      }

      await detectLocation();
      clearTimeout(timeoutRef.current!);
    })();

    return () => timeoutRef.current && clearTimeout(timeoutRef.current);
  }, []);

  const handleManualAddressAdd = async () => {
    if (!manualArea || !manualCity || !manualRegion) return;

    const newAddress = {
      area: manualArea,
      city: manualCity,
      region: manualRegion,
    };

    const updated = [...manualAddresses, newAddress].slice(
      -MAX_MANUAL_LOCATIONS
    );
    await storeManualAddresses(updated);
    setManualAddresses(updated);
    setLocation(newAddress);
    setManual(true);
    setManualModalOpen(false);
    setDropdownOpen(false);
    setManualArea("");
    setManualCity("");
    setManualRegion("");
  };
  const isCurrentLocationSelected = !manual && location !== null;

  return (
    <>
      {/* Top Bar */}
      <View style={styles.shadow}>
        <View style={styles.container}>
          {/* Location Section */}
          <View style={styles.locationWrapper}>
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center" }}
              onPress={() => !loading && setDropdownOpen(true)}
              disabled={loading}
              activeOpacity={0.7}
            >
              <Feather
                name="map-pin"
                size={20}
                color="#f57c00"
                style={{ marginRight: 6 }}
              />
              {loading ? (
                <ActivityIndicator size="small" color="#f57c00" />
              ) : (
                <View>
                  <Text style={styles.area}>
                    {(location?.area?.length > 12
                      ? location.area.slice(0, 12) + "..."
                      : location?.area) || "Your Area"}
                  </Text>
                  <Text style={styles.city}>
                    {(location?.city?.length > 12
                      ? location.city.slice(0, 12) + "..."
                      : location?.city) || ""}
                    {manual ? "" : ""}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
          <NotificationButton />
          <ProfileButton />
        </View>
      </View>

      {/* Dropdown Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isDropdownOpen}
        onRequestClose={() => setDropdownOpen(false)}
      >
        <Pressable
          style={styles.overlay}
          onPress={() => setDropdownOpen(false)}
        >
          <View style={styles.dropdown}>
            <Text style={styles.dropdownTitle}>Select your location</Text>

            <TouchableOpacity
              disabled={isCurrentLocationSelected}
              style={[
                styles.dropdownItem,
                isCurrentLocationSelected && { backgroundColor: "#fff" },
              ]}
              onPress={() => {
                if (!isCurrentLocationSelected) {
                  detectLocation();
                  setDropdownOpen(false);
                }
              }}
            >
              <Text
                style={[
                  styles.dropdownText,
                  isCurrentLocationSelected && {
                    color: "grey",
                  },
                ]}
              >
                📍 Use current location
              </Text>
            </TouchableOpacity>

            <ScrollView style={{ maxHeight: 200 }}>
              {manualAddresses.map((addr, index) => {
                const isSelected =
                  manual &&
                  location?.area === addr.area &&
                  location?.city === addr.city &&
                  location?.region === addr.region;

                return (
                  <View
                    key={index}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <TouchableOpacity
                      disabled={isSelected}
                      style={[
                        styles.dropdownItem,
                        { flex: 1 },
                        isSelected && { backgroundColor: "#fff" },
                      ]}
                      onPress={() => {
                        if (!isSelected) {
                          setLocation(addr);
                          setManual(true);
                          setDropdownOpen(false);
                        }
                      }}
                    >
                      <Text
                        style={[
                          styles.dropdownText,
                          isSelected && { color: "grey" },
                        ]}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        🏠 {addr.area}, {addr.city}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      disabled={isSelected}
                      onPress={async () => {
                        if (isSelected) return;

                        const updated = manualAddresses.filter(
                          (_, i) => i !== index
                        );
                        await storeManualAddresses(updated);
                        setManualAddresses(updated);

                        // If the deleted address was selected, fallback to detectLocation
                        if (
                          location?.area === addr.area &&
                          location?.city === addr.city &&
                          location?.region === addr.region
                        ) {
                          detectLocation();
                          setDropdownOpen(false);
                        }
                      }}
                      style={{
                        paddingHorizontal: 8,
                        paddingVertical: 6,
                        opacity: isSelected ? 0.3 : 1,
                      }}
                    >
                      <Feather name="trash-2" size={18} color="red" />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </ScrollView>

            {manualAddresses.length < MAX_MANUAL_LOCATIONS && (
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  setManualModalOpen(true);
                  setDropdownOpen(false);
                }}
              >
                <Text style={styles.dropdownText}>➕ Enter manually</Text>
              </TouchableOpacity>
            )}
          </View>
        </Pressable>
      </Modal>

      {/* Manual Entry Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isManualModalOpen}
        onRequestClose={() => setManualModalOpen(false)}
      >
        <Pressable
          style={styles.overlay}
          onPress={() => setManualModalOpen(false)}
        >
          <Pressable onPress={() => {}} style={styles.dropdown}>
            <Text style={styles.dropdownTitle}>Add Manual Address</Text>

            <TextInput
              placeholder="Area"
              value={manualArea}
              onChangeText={setManualArea}
              maxLength={30}
              style={styles.input}
            />

            <TextInput
              placeholder="City"
              value={manualCity}
              onChangeText={setManualCity}
              maxLength={30}
              style={styles.input}
            />

            <TextInput
              placeholder="Region"
              value={manualRegion}
              onChangeText={setManualRegion}
              maxLength={30}
              style={styles.input}
            />

            <TouchableOpacity
              style={[
                styles.addButton,
                {
                  backgroundColor: "#f57c00", // Always orange
                  opacity:
                    manualArea.trim() &&
                    manualCity.trim() &&
                    manualRegion.trim()
                      ? 1
                      : 0.5, // Faded when disabled
                },
              ]}
              onPress={() => {
                handleManualAddressAdd({
                  area: manualArea.trim(),
                  city: manualCity.trim(),
                  region: manualRegion.trim(),
                });
              }}
              disabled={
                !manualArea.trim() || !manualCity.trim() || !manualRegion.trim()
              }
            >
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  shadow: {
    width: screenWidth,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff7f0",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 12 : 12,
    width: "100%",
    paddingBottom: 2,
    paddingTop: 2,
  },
  locationWrapper: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
    paddingVertical: 6,
  },
  area: {
    fontSize: 15,
    color: "#222",
    fontWeight: "600",
    lineHeight: 20,
  },
  city: {
    fontSize: 13,
    color: "#666",
  },
  iconWrapper: {
    marginLeft: 12,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#fff0e0",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f57c00",
  },
  notificationIcon: {
    padding: 6,
    marginLeft: 12,
  },
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  dropdown: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  dropdownTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  dropdownItem: {
    paddingVertical: 12,
  },
  dropdownText: {
    fontSize: 16,
    color: "#f57c00",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "#f57c00",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
