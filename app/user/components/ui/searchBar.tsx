 

import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

export default function SearchBar() {
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <Feather name="search" size={20} color="#999" style={{ marginRight: 8 }} />
        <TextInput
          placeholder="Search for services..."
          placeholderTextColor="#888"
          style={styles.input}
        />
        <TouchableOpacity>
          <Feather name="mic" size={22} color="orangered" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: screenWidth - 8, // adds side margins (16 on each side)
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    marginVertical: 10,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff7f0',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#f57c00',
    paddingHorizontal: 8,
    paddingVertical: Platform.OS === 'ios' ? 10 : 0,
    width: '100%',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'Roboto',
  },
});
