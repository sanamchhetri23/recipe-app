import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  FlatList
} from 'react-native';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { firestore, auth } from '../database/firebase';
import { Ionicons } from '@expo/vector-icons';

const RecipeDetailScreen = ({ route, navigation }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const { recipeId, onDelete } = route.params;

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const docRef = doc(firestore, 'recipes', recipeId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const recipeData = { id: docSnap.id, ...docSnap.data() };
          setRecipe(recipeData);
          setIsLiked(recipeData.likedBy && recipeData.likedBy.includes(auth.currentUser?.uid));
        } else {
          console.log('No such document!');
          Alert.alert('Error', 'Recipe not found');
        }
      } catch (error) {
        console.error('Error fetching recipe:', error);
        Alert.alert('Error', 'Failed to load recipe details');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [recipeId]);

  const handleDelete = () => {
    Alert.alert(
      "Delete Recipe",
      "Are you sure you want to delete this recipe?",
      [
        { 
          text: "Cancel", 
          style: "cancel"
        },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(firestore, 'recipes', recipeId));
              Alert.alert('Success', 'Recipe deleted successfully');
              if (onDelete) {
                onDelete();
              }
              navigation.goBack();
            } catch (error) {
              console.error('Error deleting recipe:', error);
              Alert.alert('Error', 'Failed to delete recipe');
            }
          }
        }
      ]
    );
  };

  const renderCommentItem = ({ item }) => (
    <View style={styles.commentItem}>
      <Text style={styles.commentUsername}>{item.username}</Text>
      <Text>{item.text}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!recipe) {
    return (
      <View style={styles.container}>
        <Text>Recipe not found</Text>
      </View>
    );
  }

  const isOwner = auth.currentUser && recipe.userId === auth.currentUser.uid;

  const renderRecipeDetails = () => (
    <View>
      <Image source={{ uri: recipe.imageUrl }} style={styles.image} />
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{recipe.title}</Text>
        <Text style={styles.addedBy}>Added by: {recipe.userName}</Text>
        
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Ionicons 
              name={isLiked ? "heart" : "heart-outline"} 
              size={20} 
              color={isLiked ? "red" : "black"} 
            />
            <Text style={styles.infoText}>{recipe.likes || 0}</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="time-outline" size={24} color="#666" />
            <Text style={styles.infoText}>{recipe.cookingTime || 'N/A'}</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="people-outline" size={24} color="#666" />
            <Text style={styles.infoText}>{recipe.comments ? recipe.comments.length : 0}</Text>
          </View>
        </View>
        <Text style={styles.ingredientsTitle}>Serves:</Text>
        <Text style={styles.ingredients}>{recipe.serves}</Text>
                <Text style={styles.ingredientsTitle}>Ingredients:</Text>
                <Text style={styles.ingredients}>{recipe.ingredients}</Text>
                <Text style={styles.directionsTitle}>Directions:</Text>
                <Text style={styles.directions}>{recipe.description}</Text>
                <Text style={styles.commentsTitle}>Comments:</Text>
      </View>
    </View>
  );

  return (
    <FlatList
      style={styles.container}
      ListHeaderComponent={renderRecipeDetails}
      data={recipe.comments || []}
      renderItem={renderCommentItem}
      keyExtractor={(item, index) => index.toString()}
      ListEmptyComponent={<Text style={styles.noCommentsText}>No comments yet.</Text>}
      ListFooterComponent={isOwner && (
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={handleDelete}
        >
          <Text style={styles.deleteButtonText}>Delete Recipe</Text>
        </TouchableOpacity>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  addedBy: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 20,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: '#eee',
    paddingVertical: 10,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 5,
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  ingredientsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
    marginBottom: 8,
},
ingredients: {
    fontSize: 16,
    marginBottom: 16,
},

directionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
    marginBottom: 8,
},
directions: {
    fontSize: 16,
    marginBottom: 20,
},
  commentItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  commentUsername: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  noCommentsText: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 16,
    color: '#666',
  },
  deleteButton: {
    backgroundColor: '#ff0000',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    marginHorizontal: 20,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default RecipeDetailScreen;
