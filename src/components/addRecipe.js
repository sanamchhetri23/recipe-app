import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import RNPickerSelect from 'react-native-picker-select';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { firestore, storage, auth } from '../database/firebase'; // Ensure auth is imported

export default function AddRecipe({ navigation }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [cookingTime, setCookingTime] = useState('');
  const [serves, setServes] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        setImageUri(uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const uploadImageAndSaveData = async () => {
    if (!title || !description || !category || !cookingTime || !serves || !ingredients || !imageUri) {
      Alert.alert('Please fill out all fields and pick an image.');
      return;
    }

    setLoading(true);

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('No user is signed in');
      }

      const response = await fetch(imageUri);
      const blob = await response.blob();

      const filename = `recipeImages/${Date.now()}_${title.replace(/\s+/g, '_')}.jpg`;
      const storageRef = ref(storage, filename);

      const snapshot = await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(snapshot.ref);

      await addDoc(collection(firestore, 'recipes'), {
        title,
        description,
        category,
        cookingTime,
        serves,
        ingredients,
        imageUrl: downloadURL,
        createdAt: new Date(),
        userId: currentUser.uid,
        userEmail: currentUser.email,
        userName: currentUser.displayName || 'Anonymous',
        likedBy: [], // Initialize empty array for likes
        comments: [], // Initialize empty array for comments
        likes: 0 // Initialize likes count
      });

      Alert.alert('Recipe added successfully!');
      setTitle('');
      setDescription('');
      setCategory('');
      setCookingTime('');
      setServes('');
      setIngredients('');
      setImageUri(null);
    } catch (error) {
      console.error('Error uploading image or saving data:', error);
      Alert.alert('Error', 'Failed to upload image or save data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Pick an Image</Text>
      <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.selectedImage} />
        ) : (
          <View style={styles.plusIconContainer}>
            <Ionicons name="add" size={40} color="#888" />
            <Text style={styles.addPhotoText}>Add Recipe Image</Text>
          </View>
        )}
      </TouchableOpacity>
      <RNPickerSelect
        onValueChange={(value) => setCategory(value)}
        items={[
          {label: 'No Selection', value: ''},
          { label: 'Breakfast', value: 'breakfast' },
          { label: 'Lunch', value: 'lunch' },
          { label: 'Dinner', value: 'dinner' },
          { label: 'Snacks', value: 'snacks' },
          { label: 'Desserts', value: 'desserts' },
          { label: 'Appetizers', value: 'appetizers' },
        ]}
        style={styles.input}
        placeholder={{
          label: 'Select a category...',
          value: null,
          color: '#9EA0A4',
        }}
      />
      <TextInput
        style={styles.input}
        placeholder="Recipe Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Cooking Time"
        value={cookingTime}
        onChangeText={setCookingTime}
      />
      <TextInput
        style={styles.input}
        placeholder="Serves"
        value={serves}
        onChangeText={setServes}
      />
      <TextInput
        style={styles.input}
        placeholder="Ingredients"
        value={ingredients}
        onChangeText={setIngredients}
        numberOfLines={3}
      />
      <TextInput
        style={[styles.input, styles.descriptionInput]}
        placeholder="Directions"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <Button title="Add Recipe" onPress={uploadImageAndSaveData} disabled={loading} />
      {loading && <Text style={styles.loadingText}>Uploading...</Text>}
    </ScrollView>
  );
}

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 50
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  imagePickerButton: {
    width: '100%',
    height: 200,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    overflow: 'hidden',
  },
  plusIconContainer: {
    alignItems: 'center',
  },
  addPhotoText: {
    marginTop: 10,
    color: '#888',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 10,
  },
});
