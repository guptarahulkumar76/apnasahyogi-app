import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../../firebase/config'; // ✅ use your config

export default function OtpScreen() {
  const [code, setCode] = useState('');
  const { verificationId, phone } = useLocalSearchParams();
  const router = useRouter();

  const handleVerify = async () => {
    try {
      const credential = PhoneAuthProvider.credential(verificationId as string, code);
      await signInWithCredential(auth, credential);
      // ✅ Navigate after success
      router.replace('/(tabs)/bookings'); // update this to your landing screen
    } catch (err) {
      alert('Invalid OTP');
      console.error(err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter OTP sent to {phone}</Text>
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
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 14,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 18,
  },
  button: {
    backgroundColor: '#f57c00',
    padding: 14,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
