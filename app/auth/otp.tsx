import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import auth from '@react-native-firebase/auth';
import Constants from 'expo-constants';

const API_BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl;

type Params = {
  phone?: string;
  role?: string;
};

export default function OtpScreen() {
  const [code, setCode] = useState('');
  const { phone, role } = useLocalSearchParams<Params>();
  const router = useRouter();

  const handleVerify = async () => {
    if (code.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter a valid 6-digit OTP.');
      return;
    }

    try {
      if (!global.confirmationResult) {
        Alert.alert('Error', 'OTP session expired. Please try again.');
        router.replace('/auth/login');
        return;
      }

      // Step 1: Confirm OTP using Firebase
      const result = await global.confirmationResult.confirm(code);
      console.log('OTP verified successfully:', result);
      const user = (result as any).user;
      console.log('User data:', user);

      // Step 2: Get Firebase Auth Token
      const idToken = await user.getIdToken();
      console.log('Firebase ID Token:', idToken);

      // Step 3: Call backend /auth/login
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobile: phone,
          role: role || 'user',
          idToken,
        }),
      });

      const data = await response.json();
      console.log('Login response:', data);
      if (response.ok) {
        // Step 4: Save login state
        await AsyncStorage.setItem('uid', data.uid);
        await AsyncStorage.setItem('isLoggedIn', 'true');

        // Redirect to dashboard
        if (role === 'vendor') {
          router.replace('/vendor/dashboard');
        } else {
          router.replace('/user/dashboard');
        }
      } else if (
        data.message === 'User not found' ||
        data.message === 'Invalid login credentials'
      ) {
        // Not registered → go to Register screen
        router.replace({
          pathname: '/auth/register',
          params: {
            phone,
            role: role || 'user',
          },
        });
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('OTP/Login Error:', error);
      Alert.alert('Login Error', error.message || 'Something went wrong');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter OTP sent to {phone ?? ''}</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Enter 6-digit OTP"
        maxLength={6}
        value={code}
        onChangeText={setCode}
      />
      <TouchableOpacity style={styles.button} onPress={handleVerify}>
        <Text style={styles.buttonText}>Verify & Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#f57c00',
    padding: 14,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 18,
    color: '#000',
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#f57c00',
    padding: 14,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
