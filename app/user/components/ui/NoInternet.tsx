// NoInternet.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { useRouter } from 'expo-router';

const NoInternet = () => {
  const [isConnected, setIsConnected] = useState(true);
  const router = useRouter();


  const checkConnection = () => {
    NetInfo.fetch().then(state => {
      setIsConnected(state.isConnected);
    });
  };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  if (isConnected) return null;

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Image
          source={require('../../../../assets/images/icon.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.title}>No Internet Connection</Text>
      <Text style={styles.subtitle}>Please check your network settings and try again</Text>

      <TouchableOpacity style={styles.primaryBtn} onPress={checkConnection}>
        <Text style={styles.primaryText}>Try Again!</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NoInternet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
  },
  iconContainer: {
    backgroundColor: '#FFF5E6', // light orange background
    padding: 35,
    borderRadius: 25,
    marginBottom: 30,
  },
  image: {
    width: 80,
    height: 80,
    tintColor: '#FF6A00', // bright orange icon
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FF6A00', // orange
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  primaryBtn: {
    backgroundColor: '#FF6A00',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginBottom: 15,
  },
  primaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryBtn: {
    borderWidth: 1,
    borderColor: '#FF6A00',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  secondaryText: {
    color: '#FF6A00',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
