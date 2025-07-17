import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

type Params = {
  verificationId?: string;
  phone?: string;
};

export default function OtpScreen() {
  const [code, setCode] = useState('');
  const { phone } = useLocalSearchParams<Params>();
  const router = useRouter();

  const handleVerify = () => {
    if (code.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter a valid 6-digit OTP.');
      return;
    }

    if (code === '123456') {
      router.replace('/user/dashboard');
    } else {
      Alert.alert('OTP Failed', 'Invalid OTP. Try using 123456.');
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
        <Text style={styles.buttonText}>Verify</Text>
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
