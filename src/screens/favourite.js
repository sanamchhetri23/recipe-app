import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Image, Text } from 'react-native';
import { firestore, auth } from '../database/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore'; // Added missing imports
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const FavoriteScreen = () => {
  const [favorites, setFavorites] = useState([]);
  const [noFavorites, setNoFavorites] = useState(false); // Added state
  const currentUser = auth.currentUser;
  const navigation = useNavigation();

  const fetchFavorites = useCallback(async () => {
    if (!currentUser) return;

    const recipesRef = collection(firestore, 'recipes');
    const q = query(recipesRef, where('likedBy', 'array-contains', currentUser.uid));

    try {
      const querySnapshot = await getDocs(q);
      const favoritesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setFavorites(favoritesData);
      setNoFavorites(favoritesData.length === 0); // Update state based on the length of favorites
    } catch (error) {
      console.error("Error fetching favorites: ", error);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  useFocusEffect(
    useCallback(() => {
      fetchFavorites();
    }, [fetchFavorites])
  );

  const handleFavoriteChange = (recipeId, isLiked) => {
    if (isLiked) {
      const fetchAndAddFavorite = async () => {
        const recipeRef = doc(firestore, 'recipes', recipeId);
        const recipeSnap = await getDoc(recipeRef);
        if (recipeSnap.exists()) {
          const newFavorite = { id: recipeId, ...recipeSnap.data() };
          setFavorites(prevFavorites => [...prevFavorites, newFavorite]);
        }
      };
      fetchAndAddFavorite();
    } else {
      // If the recipe is unliked, remove it from favorites
      setFavorites(prevFavorites => prevFavorites.filter(recipe => recipe.id !== recipeId));
    }
  };

  const renderFavoriteItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('CategoryRecipeDetail', { recipeId: item.id, title: item.title, onFavoriteChange: handleFavoriteChange })}>
      <View style={styles.card}>
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
        <Text style={styles.title}>{item.title}</Text>
        <View style={styles.details}>
          <Text style={styles.author}>By: {item.userName}</Text>
          <View style={styles.likeContainer}>
            <Ionicons name="heart" size={20} color="red" />
            <Text style={styles.likeCount}>{item.likes || 0}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.topTitle}>Favourite</Text>
      {noFavorites ? ( // Conditionally render the message
        <Text style={styles.emptyText}>You haven't added any favorites yet.</Text>
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderFavoriteItem}
          keyExtractor={item => item.id}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: 50
  },
  topTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    paddingBottom: 10
  },
  card: {
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: 'white',
    borderWidth: 0.2, 
  },
  image: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 10,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  author: {
    fontSize: 12,
    color: 'gray',
  },
  likeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeCount: {
    marginLeft: 5,
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 50,
  },
});

export default FavoriteScreen;
