import React from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { useRouter } from "expo-router";

const LocationScreen = () => {

  const router = useRouter();

  const savedAddresses = [
    {
      id: '1',
      title: 'Home',
      address: 'Laxmi Bhawan Bengalipura, Banda, near head post office',
      phone: '+91-7839069978',
      distance: '2.2 km',
    },
  ];

  const recentLocations = [
    {
      id: '1',
      name: 'Ladaka Purwa',
      city: 'Banda',
      distance: '0 m',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a location</Text>

      {/* Search Bar with Icon */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#555" style={styles.searchIcon} />
        <TextInput
          placeholder="Search for area, street name..."
          style={styles.searchInput}
        />
      </View>

    <View style={styles.locationCard}>
  <TouchableOpacity style={styles.locationBtn}>
    <Ionicons name="locate-outline" size={20} color="#FB8C00" />
    <View style={{ marginLeft: 10 }}>
      <Text style={styles.locationText}>Use current location</Text>
      <Text style={styles.subText}>Ladaka Purwa, Banda</Text>
    </View>
  </TouchableOpacity>
</View>


      <TouchableOpacity style={styles.addAddress}>
        <Text style={styles.addAddressText}>+ Add Address</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Saved Addresses</Text>
      {savedAddresses.map(addr => (
        <View key={addr.id} style={styles.addressBox}>
          <Ionicons name="home-outline" size={18} color="#555" />
          <View style={styles.addressDetails}>
            <Text style={styles.addressTitle}>{addr.title} ({addr.distance})</Text>
            <Text style={styles.addressText}>{addr.address}</Text>
            <Text style={styles.phone}>{addr.phone}</Text>
          </View>
        </View>
      ))}

      <Text style={styles.sectionTitle}>Recent Locations</Text>
      {recentLocations.map(loc => (
        <View key={loc.id} style={styles.recentBox}>
          <Ionicons name="time-outline" size={18} color="#555" />
          <Text style={styles.recentText}>
            {loc.name} - {loc.city} ({loc.distance})
          </Text>
        </View>
      ))}

      <Text style={styles.googleText}>powered by Google</Text>
    </View>
  );
};

export default LocationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFF7F0', // soft background like app theme
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFA726', // orange border
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  
  addAddress: {
    paddingVertical: 10,
  },
  addAddressText: {
    fontSize: 16,
    color: '#EF6C00',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginVertical: 12,
    color: '#333',
  },
  addressBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  addressDetails: {
    marginLeft: 10,
    flex: 1,
  },
  addressTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#333',
  },
  addressText: {
    color: '#666',
    fontSize: 14,
    marginTop: 2,
  },
  phone: {
    color: '#444',
    marginTop: 4,
    fontSize: 13,
  },
  recentBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  recentText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#444',
  },
  googleText: {
    textAlign: 'center',
    color: '#AAA',
    marginTop: 20,
    fontSize: 13,
  },
  locationCard: {
  backgroundColor: '#FFFFFF',
  borderRadius: 10,
  padding: 12,
  marginBottom: 12,
  shadowColor: '#000',
  shadowOpacity: 0.05,
  shadowRadius: 3,
  shadowOffset: { width: 0, height: 1 },
  elevation: 2,
},
locationBtn: {
  flexDirection: 'row',
  alignItems: 'center',
},
locationText: {
  fontSize: 16,
  fontWeight: '600',
  color: '#FB8C00',
},

subText: {
  fontSize: 14,
  color: '#555',
},

});

