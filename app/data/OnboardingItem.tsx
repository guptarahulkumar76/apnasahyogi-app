// components/OnboardingItem.tsx
import React from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import { OnboardingItem } from '../data/onboardingData';

const { width } = Dimensions.get('window');

interface Props {
  item: OnboardingItem;
}

const OnboardingItems: React.FC<Props> = ({ item }) => {
  return (
    <View style={styles.container}>
      <Image source={item.image} style={styles.image} resizeMode="contain" />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );
};

export default OnboardingItems;

const styles = StyleSheet.create({
  container: {
    width,
    alignItems: 'center',
    padding: 0,
  },
  image: {
    width: '100%',
    height: 380,
    marginVertical: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginTop: 10,
  },
});
