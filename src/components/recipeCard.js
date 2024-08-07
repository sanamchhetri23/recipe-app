// RecipeCard.js
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const cardWidth = windowWidth * 0.4; // Adjust this value to change card size

const RecipeCard = ({ recipe, onPress }) => (
  <TouchableOpacity style={styles.recipeCard} onPress={onPress}>
    <Image source={{ uri: recipe.imageUrl }} style={styles.recipeImage} />
    <Text style={styles.recipeTitle}>{recipe.title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  recipeCard: {
    width: cardWidth,
    aspectRatio: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginBottom: 16,
    overflow: 'hidden',
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

export default RecipeCard;
