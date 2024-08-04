// src/services/firebase.js

import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAbpMJvo3SNNKwMO5nbmsYmY3KI6knlac0",
    authDomain: "myapp-70e67.firebaseapp.com",
    projectId: "myapp-70e67",
    storageBucket: "myapp-70e67.appspot.com",
    messagingSenderId: "724208925440",
    appId: "1:724208925440:web:4b19c5b2a0530637f391e5"
  };

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

const firestore = getFirestore(app);

export { app, auth, firestore };