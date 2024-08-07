import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { firestore } from '../database/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import RecipeCard from '../components/recipeCard';  // Adjust the path as necessary

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
    <RecipeCard
      recipe={item}
      onPress={() => navigation.navigate('CategoryRecipeDetail', { recipeId: item.id, title: item.title })}
    />
  );

  return (
    <View style={styles.container}>
      {recipes.length === 0 ? (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No recipes found for this category.</Text>
        </View>
      ) : (
        <FlatList
          data={recipes}
          renderItem={renderRecipeItem}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={styles.recipeList}
          columnWrapperStyle={styles.columnWrapper}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 18,
    color: 'gray',
  },
  recipeList: {
    padding: 8,
  },
  columnWrapper: {
    justifyContent: 'space-around',
  },
});

export default CategoryRecipes;
