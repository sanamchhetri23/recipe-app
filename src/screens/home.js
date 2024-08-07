import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, StyleSheet, FlatList, TouchableOpacity, Dimensions, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { firestore } from '../database/firebase';  // Adjust the path as necessary
import { collection, getDocs } from 'firebase/firestore';

const windowWidth = Dimensions.get('window').width;
const iconSize = windowWidth * 0.22;

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
  const [suggestions, setSuggestions] = useState([]);
  const [allRecipes, setAllRecipes] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, 'recipes'));
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAllRecipes(data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };

    fetchRecipes();
  }, []);

  useEffect(() => {
    const filterSuggestions = () => {
      if (searchQuery.length > 0) {
        setIsTyping(true);
        const lowerCaseQuery = searchQuery.toLowerCase();
        const filteredSuggestions = allRecipes.filter(recipe =>
          recipe.title.toLowerCase().includes(lowerCaseQuery)
        );
        setSuggestions(filteredSuggestions);
      } else {
        setIsTyping(false);
        setSuggestions([]);
      }
    };

    filterSuggestions();
  }, [searchQuery, allRecipes]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const renderSuggestion = ({ item }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => navigation.navigate('CategoryRecipeDetail', { recipeId: item.id })}
    >
      <Text>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
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
      {isTyping && suggestions.length === 0 ? (
        <View style={styles.noSuggestionsContainer}>
          <Text style={styles.noSuggestionsText}>No results available</Text>
        </View>
      ) : (
        <FlatList
          data={suggestions}
          renderItem={renderSuggestion}
          keyExtractor={(item) => item.id}
          style={styles.suggestionsList}
        />
      )}
      <FlatList
        ListHeaderComponent={
          <>
            <Text style={styles.sectionTitle}>Categories</Text>
            <View style={styles.categoryContainer}>
              {categories.map((category) => (
                <TouchableOpacity 
                  key={category.value} 
                  style={styles.categoryCard}
                  onPress={() => navigation.navigate('CategoryRecipes', { category: category.value })}
                >
                  <Image source={category.icon} style={[styles.categoryIcon, { width: iconSize, height: iconSize }]} />
                  <Text style={styles.categoryLabel}>{category.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        }
        data={[]} // This FlatList is just for scrolling, so we pass an empty array
        renderItem={null}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50
  },
  headerImage: {
    width: '100%',
    height: 94,
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
  suggestionsList: {
    maxHeight: 200,
    marginHorizontal: 16,
    marginBottom: 10,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  noSuggestionsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 16,
  },
  noSuggestionsText: {
    fontSize: 16,
    color: '#888',
  },
  sectionTitle: {
    fontSize: 22,
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
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginBottom: 36,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
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
});
