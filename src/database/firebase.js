import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyAbpMJvo3SNNKwMO5nbmsYmY3KI6knlac0",
  authDomain: "myapp-70e67.firebaseapp.com",
  projectId: "myapp-70e67",
  storageBucket: "myapp-70e67.appspot.com",
  messagingSenderId: "724208925440",
  appId: "1:724208925440:web:0795c0bda19ac55cf391e5"
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

const firestore = getFirestore(app);
const storage = getStorage(app);

export { app, auth, firestore, storage };
