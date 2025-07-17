import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Dimensions, Platform } from 'react-native';
import * as Location from 'expo-location';
import { Feather } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

export default function LocationBar() {
  const [location, setLocation] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocation('Permission Denied');
        setLoading(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      const geocode = await Location.reverseGeocodeAsync(loc.coords);
      if (geocode.length > 0) {
        const place = geocode[0];
        setLocation(`${place.city || place.district}, ${place.region}`);
      } else {
        setLocation('Location not found');
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
          <Text style={styles.location}>{location}</Text>
        )}
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
    backgroundColor: '#fff7f0',
    borderRadius: 12,
    paddingHorizontal: 4,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    width: '100%',
  },
  location: {
    fontSize: 16,
    color: '#333',
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'Roboto',
    fontWeight: '500',
    flexShrink: 1,
  },
});
