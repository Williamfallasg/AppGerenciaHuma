import { getApp, getApps, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import 'firebase/compat/auth';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';

import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBAtFTalRRiIMhGpIGRkekMbJ1ECjosyjs",
  authDomain: "proyect-multimedios.firebaseapp.com",
  projectId: "proyect-multimedios",
  storageBucket: "proyect-multimedios.appspot.com",
  messagingSenderId: "474011568263",
  appId: "1:474011568263:web:11afa7e87f3b7c7513d022",
  measurementId: "G-94L76VSS0X"
};
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()

// Initialize Firebase services
const firestore = getFirestore(app)
//const auth = getAuth(app)
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export { app, firestore, auth }

