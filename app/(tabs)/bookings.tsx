import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';

const categories = [
  { id: '1', name: 'Plumber' },
  { id: '2', name: 'Carpenter' },
  { id: '3', name: 'Electrician' },
  { id: '4', name: 'Labour' },
];

const vendors = Array.from({ length: 10 }, (_, i) => ({
  id: `${i + 1}`,
  name: `Vendor ${i + 1}`,
  category: categories[i % categories.length].name,
}));

export default function DashboardScreen() {
  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search for services..."
        placeholderTextColor="#999"
      />

      {/* Category List */}
      <Text style={styles.sectionTitle}>Categories</Text>
      <FlatList
        horizontal
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.categoryCard}>
            <Text style={styles.categoryText}>{item.name}</Text>
          </TouchableOpacity>
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 8 }}
      />

      {/* Vendor List */}
      <Text style={styles.sectionTitle}>Vendors Near You</Text>
      <FlatList
        data={vendors}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.vendorCard}>
            <Image
              source={require('../../assets/images/avatar.png')} // Replace with your image
              style={styles.vendorImage}
            />
            <View>
              <Text style={styles.vendorName}>{item.name}</Text>
              <Text style={styles.vendorCategory}>{item.category}</Text>
            </View>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  searchBar: {
    backgroundColor: '#fff7f0',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#f57c00',
    marginBottom: 20,
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
    color: '#333',
  },
  categoryCard: {
    backgroundColor: '#f1821aff',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 10,
  },
  categoryText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  vendorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff7f0',
    padding: 12,
    borderRadius: 10,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#f57c00',
  },
  vendorImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
    backgroundColor: '#fff',
  },
  vendorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  vendorCategory: {
    fontSize: 14,
    color: '#777',
  },
});
