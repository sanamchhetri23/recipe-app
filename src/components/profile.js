// src/components/profile.js

import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  Button, 
  FlatList, 
  Image, 
  TouchableOpacity 
} from 'react-native';
import { auth, firestore } from '../database/firebase'; // Adjust the import path as necessary

import { collection, query, where, getDocs } from 'firebase/firestore';

const Profile = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const user = auth.currentUser;
      console.log("Current user:", user);

      if (user) {
        setUserName(user.displayName || 'No name available');
        setUserEmail(user.email || 'No email available');

        // Fetch user recipes
        const recipesRef = collection(firestore, 'recipes');
        const q = query(recipesRef, where('userId', '==', user.uid));
        console.log("Querying Firestore for user:", user.uid);

        const querySnapshot = await getDocs(q);
        console.log("Query snapshot size:", querySnapshot.size);

        const userRecipes = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log("Fetched recipes:", userRecipes);

        setRecipes(userRecipes);
      } else {
        console.log("No user is signed in");
        setError("No user is signed in");
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };



  const handleRecipeDeleted = () => {
    fetchUserData();
  };

  const renderRecipeItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.recipeCard} 
      onPress={() => navigation.navigate('RecipeDetail', { recipeId: item.id, onDelete: handleRecipeDeleted })}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.recipeImage} />
      <Text style={styles.recipeTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <Button title="Retry" onPress={fetchUserData} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
       
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.label}>Name: {userName}</Text>
        <Text style={styles.label}>Email: {userEmail}</Text>
      </View>
      <Text style={styles.sectionTitle}>My Recipes</Text>
      {recipes.length > 0 ? (
        <FlatList
          data={recipes}
          renderItem={renderRecipeItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.recipeList}
        />
      ) : (
        <Text style={styles.noRecipesText}>No recipes found. Add some recipes!</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  userInfo: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginVertical: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 16,
  },
  recipeList: {
    paddingBottom: 16,
  },
  recipeCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  recipeImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  recipeTitle: {
    padding: 10,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  noRecipesText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Profile;
