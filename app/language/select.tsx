import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../../lib/i18n';

export default function LanguageModal({
  isVisible,
  onClose,
  onLanguageSet,
}: {
  isVisible: boolean;
  onClose: () => void;
  onLanguageSet?: () => void;
}) {
  const selectLanguage = async (lang: string) => {
    await AsyncStorage.setItem('language', lang);
    await i18n.changeLanguage(lang);
    if (onLanguageSet) onLanguageSet();
    onClose();
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection="down"
      style={styles.modalContainer}
      backdropOpacity={0.3}
    >
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Select Language</Text>

        <TouchableOpacity style={[styles.btn, styles.hinglish]} onPress={() => selectLanguage('hi')}>
          <Text style={styles.btnText}>हिंदी</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btn, styles.hinglish]} onPress={() => selectLanguage('en')}>
          <Text style={styles.btnText}>English</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btn, styles.hinglish]} onPress={() => selectLanguage('hn')}>
          <Text style={styles.btnText}>Hinglish</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Text style={styles.closeText}>Close ✕</Text>
        </TouchableOpacity> */}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: '#f2f9ff',
    padding: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 25,
    color: '#333',
    textAlign: 'center',
  },
  btn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  btnText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  hindi: { backgroundColor: '#007bff' },
  english: { backgroundColor: '#28a745' },
  hinglish: { backgroundColor: '#ff9500' },
  closeBtn: {
    marginTop: 20,
  },
  closeText: {
    fontSize: 16,
    color: '#007bff',
  },
});
