import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity
} from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const [mobile, setMobile] = useState('');

  const handleContinue = () => {
    // Validate mobile number here if needed
    console.log('Continue with mobile:', mobile);
    // Navigate or trigger OTP logic here
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.title}>Login Page</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Mobile Number"
        keyboardType="phone-pad"
        maxLength={10}
        value={mobile}
        onChangeText={setMobile}
      />

      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueText}>Continue with OTP</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    backgroundColor: '#f2f9ff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#2a2a2a',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
  },
  continueButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  continueText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    alignItems: 'center',
  },
  backText: {
    color: '#666',
    fontSize: 14,
  },
});
