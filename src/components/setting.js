import React from 'react';
import { View, Button, Alert } from 'react-native';
import { signOut} from 'firebase/auth';
import { auth, firestore } from '../database/firebase'; 

const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert('Logged out', 'You have been logged out successfully.');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Logout Error', error.message);
    }
  };

export default function Setting({ }) {
  return (
    <Button title="Logout" onPress={handleLogout} color="#ff0000" />
  );
}