import React, { useState } from 'react';
import { View, Text, Image, TextInput, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const windowWidth = Dimensions.get('window').width;
const iconSize = windowWidth * 0.22; // Adjust this value to change icon size

const categories = [
  { label: 'Breakfast', value: 'breakfast', icon: require('../../assets/breakfast.png') },
  { label: 'Lunch', value: 'lunch', icon: require('../../assets/lunch.png') },
  { label: 'Dinner', value: 'dinner', icon: require('../../assets/dinner.png') },
  { label: 'Snacks', value: 'snacks', icon: require('../../assets/snack.png') },
  { label: 'Desserts', value: 'desserts', icon: require('../../assets/desserts.png') },
  { label: 'Appetizers', value: 'appetizers', icon: require('../../assets/appetizers.png') },
];

export default function Home({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <ScrollView style={styles.container}>
      <Image
        source={require('../../assets/Hamrokitchen.png')} 
        style={styles.headerImage}
      />
      <View style={styles.searchBarContainer}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchBar}
          placeholder="Search for recipes..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
      <Text style={styles.sectionTitle}>Categories</Text>
      <View style={styles.categoryContainer}>
        {categories.map((category) => (
          <TouchableOpacity 
            key={category.value} 
            style={styles.categoryCard}
            onPress={() => navigation.navigate('CategoryRecipes', { category: category.value })}          >
            <Image source={category.icon} style={[styles.categoryIcon, { width: iconSize, height: iconSize }]} />
            <Text style={styles.categoryLabel}>{category.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 50
  },
  headerImage: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchBar: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
    marginTop: 20,
    marginBottom: 10,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
  },
  categoryCard: {
    width: '40%', 
    aspectRatio: 1, 
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 10,
    marginBottom: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryIcon: {
    resizeMode: 'contain',
  },
  categoryLabel: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
});
