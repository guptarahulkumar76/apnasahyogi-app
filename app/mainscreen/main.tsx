import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LoginScreen from '../auth/login';
import SignupScreen from '../auth/register';

const App: React.FC = () => {
  const [screen, setScreen] = useState<'home' | 'login' | 'signup'>('home');

  if (screen === 'login') return <LoginScreen  />;
  if (screen === 'signup') return <SignupScreen  />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to ApnaSahyogi</Text>
      <TouchableOpacity style={styles.button} onPress={() => setScreen('login')}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.signupButton]} onPress={() => setScreen('signup')}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#e6f2ff' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 40, color: '#2a2a2a' },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginVertical: 10,
    width: '70%',
  },
  signupButton: {
    backgroundColor: '#28a745',
  },
  buttonText: { color: '#fff', fontSize: 16, textAlign: 'center' },
});
