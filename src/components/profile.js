import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  Button, 
  FlatList, 
  Image, 
  TouchableOpacity,
  Dimensions 
} from 'react-native';
import { auth, firestore } from '../database/firebase'; 
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2; 

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
    <TouchableOpacity  style={styles.recipeCard} 
    onPress={() => navigation.navigate('RecipeDetail', { 
      recipeId: item.id, 
      title: item.title,
      onDelete: handleRecipeDeleted 
    })}
  >
      <Image source={{ uri: item.imageUrl }} style={styles.recipeImage} />
      <View style={styles.recipeInfo}>
        <Text style={styles.recipeTitle} numberOfLines={2}>{item.title}</Text>
        <View style={styles.recipeDetails}>
          <Ionicons name="time-outline" size={16} color="#666" />
          <Text style={styles.recipeDetailText}>{item.cookingTime || 'N/A'}</Text>
          <Ionicons name="people-outline" size={16} color="#666" />
          <Text style={styles.recipeDetailText}>{item.serves || 'N/A'}</Text>
        </View>
      </View>
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
        <Ionicons name="person-circle" size={200} color="black" style={styles.icon} />
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
          numColumns={2}
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
    marginTop: 50
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    justifyContent: 'center',
  },
  icon: {
  alignSelf: 'center'
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginRight: 10,
  },
  userInfo: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    borderBottomWidth: 0.2,
    marginBottom: 20

  },
  recipeList: {
    paddingBottom: 16,
  },
  recipeCard: {
    width: cardWidth,
    backgroundColor: '#D9D9D9',
    borderWidth: 1,
    marginBottom: 16,
    marginHorizontal: 8,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  recipeImage: {
    width: '86%',
    alignSelf: 'center',
    margin: '6%',
    height: 120,
    resizeMode: 'cover',
  },
  recipeInfo: {
    padding: 10,
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  recipeDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recipeDetailText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
    marginRight: 8,
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
