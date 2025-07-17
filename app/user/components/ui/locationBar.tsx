import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Platform,
  TouchableOpacity,
} from 'react-native';
import * as Location from 'expo-location';
import { Feather } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

export default function LocationBar() {
  const [location, setLocation] = useState<{ city?: string; region?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocation({ city: 'Permission', region: 'Denied' });
        setLoading(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      const geocode = await Location.reverseGeocodeAsync(loc.coords);
      if (geocode.length > 0) {
        const place = geocode[0];
        setLocation({ city: place.city || place.district, region: place.region });
      } else {
        setLocation({ city: 'Location', region: 'Not found' });
      }

      setLoading(false);
    })();
  }, []);

  return (
    <View style={styles.shadow}>
      <View style={styles.container}>
        <Feather name="map-pin" size={20} color="#f57c00" style={{ marginRight: 8 }} />
        {loading ? (
          <ActivityIndicator size="small" color="#f57c00" />
        ) : (
          <Text style={styles.location}>
            <Text style={styles.city}>{location?.city}</Text>
            {location?.region ? `, ${location.region}` : ''}
          </Text>
        )}

        <TouchableOpacity style={styles.profileIcon}>
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
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    marginTop: 0,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff7f0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    width: '100%',
  },
  location: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'Roboto',
    fontWeight: '400',
    flexShrink: 1,
  },
  city: {
    fontWeight: 'bold',
  },
  profileIcon: {
    marginLeft: 12,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff0e0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f57c00',
  },
});
