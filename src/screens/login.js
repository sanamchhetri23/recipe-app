import React, { useState } from 'react';
import { View, Alert, StyleSheet, Image, Text } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../database/firebase';
import { Button, InputField, ErrorText } from '../components/loginSignup';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '', general: '' });

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: '', password: '', general: '' };

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

  const handleLogin = async () => {
    if (validateForm()) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        navigation.navigate('Home');
      } catch (error) {
        let errorMessage;
        switch (error.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
          case 'auth/invalid-credential':
            errorMessage = 'Incorrect email or password. Please try again.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Please enter a valid email address.';
            break;
          case 'auth/too-many-requests':
            errorMessage = 'Too many failed login attempts. Please try again later.';
            break;
          case 'auth/network-request-failed':
            errorMessage = 'Network error. Please check your internet connection.';
            break;
          default:
            errorMessage = 'An error occurred. Please try again.';
        }
        setErrors(prev => ({ ...prev, general: errorMessage }));
        Alert.alert('Login Failed', errorMessage);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.insideContainer}>
        <Text style={styles.textLogin}>Login</Text>
        <Image
          source={require('../../assets/Hamrokitchen.png')}
          style={styles.headerImage}
        />
        <InputField
          placeholder="Email"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setErrors(prev => ({ ...prev, email: '', general: '' }));
          }}
          keyboardType="email-address"
        />
        <ErrorText message={errors.email} />
        <InputField
          placeholder="Password"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setErrors(prev => ({ ...prev, password: '', general: '' }));
          }}
          secureTextEntry
        />
        <ErrorText message={errors.password} />
        <ErrorText message={errors.general} />

        <Button title="Login" onPress={handleLogin} />
        <Text
          style={styles.signUpButtonText}
          onPress={() => navigation.navigate('Signup')}
        >
          Don't have an account? Sign Up
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  textLogin: {
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
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  insideContainer: {
    marginTop: '30%',
    height: '60%',
  },
  signUpButtonText: {
    color: 'blue',
    fontSize: 14,
    alignSelf: 'center',
    textDecorationLine: 'underline',
    marginTop: 10,
  },
});
