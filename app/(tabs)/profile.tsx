import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { t } from '../../lib/translate';

import { router } from 'expo-router';
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import i18n from '../../lib/i18n';

export default function ProfileScreen() {
  const [modalVisible, setModalVisible] = useState(false);

  const changeLanguage = async (lang: string) => {
    await i18n.changeLanguage(lang);
    await AsyncStorage.setItem('language', lang);
    setModalVisible(false);
    router.replace('/(tabs)/bookings');

  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👤 Profile Page</Text>

      <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>{t('change_language')}</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Select Language</Text>

            <Pressable style={styles.langBtn} onPress={() => changeLanguage('en')}>
              <Text style={styles.langText}>English</Text>
            </Pressable>
            <Pressable style={styles.langBtn} onPress={() => changeLanguage('hi')}>
              <Text style={styles.langText}>हिंदी</Text>
            </Pressable>
            <Pressable style={styles.langBtn} onPress={() => changeLanguage('hn')}>
              <Text style={styles.langText}>Hinglish</Text>
            </Pressable>

            <Pressable style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 10,
  },
  buttonText: { color: '#fff', fontSize: 16 },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 16,
    fontWeight: 'bold',
  },
  langBtn: {
    paddingVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  langText: {
    fontSize: 16,
  },
  cancelBtn: {
    marginTop: 10,
    backgroundColor: '#ccc',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelText: {
    fontSize: 16,
    color: '#333',
  },
});
