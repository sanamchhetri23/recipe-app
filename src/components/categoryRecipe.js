import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { firestore } from '../database/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const windowWidth = Dimensions.get('window').width;
const cardWidth = windowWidth * 0.4; // Adjust this value to change card size

const CategoryRecipes = ({ route, navigation }) => {
  const [recipes, setRecipes] = useState([]);
  const { category } = route.params;

  useEffect(() => {
    const fetchRecipes = async () => {
      const recipesRef = collection(firestore, 'recipes');
      const q = query(recipesRef, where('category', '==', category));
      const querySnapshot = await getDocs(q);
      const recipeList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecipes(recipeList);
    };

    fetchRecipes();
  }, [category]);

  const renderRecipeItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.recipeCard}
      onPress={() => navigation.navigate('CategoryRecipeDetail', { recipeId: item.id })}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.recipeImage} />
      <Text style={styles.recipeTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.categoryTitle}>{category} Recipes</Text>
      <FlatList
        data={recipes}
        renderItem={renderRecipeItem}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.recipeList}
        columnWrapperStyle={styles.columnWrapper}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  categoryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
  },
  recipeList: {
    padding: 8,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  recipeCard: {
    width: cardWidth,
    aspectRatio: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  recipeImage: {
    width: '100%',
    height: '80%',
    resizeMode: 'cover',
  },
  recipeTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 8,
  },
});

export default CategoryRecipes;
