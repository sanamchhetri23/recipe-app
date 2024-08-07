// src/components/Signup.js
import React, { useState } from 'react';
import { View, Alert, StyleSheet, Text, Image } from 'react-native';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../database/firebase';
import { InputField, ErrorText, Button } from '../components/loginSignup';

export default function Signup({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ name: '', email: '', password: '' });

  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: '', email: '', password: '' };

    if (name.trim() === '') {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (email.trim() === '') {
      newErrors.email = 'Email is required';
      isValid = false;
    }

    if (password.trim() === '') {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSignup = async () => {
    if (validateForm()) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await updateProfile(user, { displayName: name });
        navigation.navigate('Home');
      } catch (error) {
        let errorMessage;
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage = 'This email address is already in use. Please use a different email.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Please enter a valid email address.';
            break;
          case 'auth/weak-password':
            errorMessage = 'The password is too weak. Please use a stronger password.';
            break;
          case 'auth/network-request-failed':
            errorMessage = 'Network error. Please check your internet connection.';
            break;
          default:
            errorMessage = 'An error occurred during signup. Please try again.';
        }
        Alert.alert('Signup Failed', errorMessage);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.insideContainer}>
        <Text style={styles.textSignup}>Sign Up</Text>
        <Image
          source={require('../../assets/Hamrokitchen.png')}
          style={styles.headerImage}
        />
        <InputField
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <ErrorText message={errors.name} />
        <InputField
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <ErrorText message={errors.email} />
        <InputField
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <ErrorText message={errors.password} />
        <Button title="Sign Up" onPress={handleSignup} />
        <Text style={styles.loginText} onPress={() => navigation.navigate('Login')}>
          Already have an account? Log In
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  textSignup: {
    fontSize: 60,
    fontWeight: 'bold',
    color: 'royalblue',
  },
  headerImage: {
    width: '100%',
    height: 50,
    resizeMode: 'cover',
    marginTop: '16%',
    marginBottom: '16%',
  },
  insideContainer: {
    marginTop: '30%',
    height: '60%',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
    borderRadius: 5,
  },
  loginText: {
    color: 'blue',
    fontSize: 14,
    alignSelf: 'center',
    textDecorationLine: 'underline'
  }
});
