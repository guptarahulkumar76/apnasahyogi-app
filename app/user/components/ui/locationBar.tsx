import React, { useEffect, useState } from "react";
import 'react-native-gesture-handler';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Platform,
  TouchableOpacity,
  Alert
} from "react-native";
import * as Location from "expo-location";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getNotification } from '../../notification';

const screenWidth = Dimensions.get("window").width;

export default function LocationBar() {
  const [location, setLocation] = useState<{ city?: string; region?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocation({ city: "Permission", region: "Denied" });
        setLoading(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      const geocode = await Location.reverseGeocodeAsync(loc.coords);
      if (geocode.length > 0) {
        const place = geocode[0];
        setLocation({
          city: place.city || place.district,
          region: place.region,
        });
      } else {
        setLocation({ city: "Location", region: "Not found" });
      }

      setLoading(false);
    })();
  }, []);

  const [isNavigating, setIsNavigating] = useState(false);

  const handleProfilePress = () => {
    if (isNavigating) return;
    setIsNavigating(true);
    router.push("/user/profile");
    setTimeout(() => setIsNavigating(false), 1000);
  };

  const handleNotificationPress = () => {
    const { title, message } = getNotification('JOB_COMPLETED', 'Ramesh Plumber');
    Alert.alert(title, message);
    router.push('/user/notification');
  };

  const handleLocationPress = () => {
    router.push('/user/components/ui/location');
  };

  return (
    <View style={styles.shadow}>
      <View style={styles.container}>
        {/* Icon + Location text in Touchable */}
        <TouchableOpacity style={styles.locationWrapper} onPress={handleLocationPress}>
          <Feather name="map-pin" size={20} color="#f57c00" style={{ marginRight: 6 }} />
          {loading ? (
            <ActivityIndicator size="small" color="#f57c00" />
          ) : (
            <Text style={styles.location}>
              <Text style={styles.city}>{location?.city}</Text>
              {location?.region ? `, ${location.region}` : ""}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.notificationIcon} onPress={handleNotificationPress}>
          <Feather name="bell" size={20} color="#f57c00" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconWrapper} onPress={handleProfilePress}>
          <View style={styles.iconCircle}>
            <Feather name="user" size={18} color="#f57c00" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
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
    marginTop: 0,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff7f0",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 12 : 10,
    width: "100%",
  },
  locationWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
    paddingVertical: 6,
  },
  location: {
    fontSize: 16,
    color: "#333",
    fontWeight: "400",
    flexShrink: 1,
  },
  city: {
    fontWeight: "bold",
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
});
