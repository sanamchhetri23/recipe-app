// src/components/Profile.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button, Alert } from 'react-native';
import { auth } from '../../firebase'; // Adjust this import path as necessary
import { signOut } from 'firebase/auth';

const Profile = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const user = auth.currentUser; // Get the currently logged-in user
    if (user) {
      setUserName(user.displayName); // Get the display name
      setUserEmail(user.email); // Get the email
    }
    setLoading(false); // Stop loading
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert('Logged out', 'You have been logged out successfully.');
      // Navigate to the login screen after logout
      navigation.navigate('Login');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Logout Error', error.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.label}>Name: {userName || 'No name available'}</Text>
      <Text style={styles.label}>Email: {userEmail || 'No email available'}</Text>
      <Button title="Logout" onPress={handleLogout} color="#ff0000" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  label: {
    fontSize: 18,
    marginVertical: 8,
  },
});

export default Profile;