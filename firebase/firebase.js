// firebase.js
import { initializeApp } from "firebase/app";
import { initializeAuth, getAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyC4ypoMBYIV0AQSLEseyZEt-KLx4RS3J1c",
    authDomain: "appgerencia-c8669.firebaseapp.com",
    projectId: "appgerencia-c8669",
    storageBucket: "appgerencia-c8669.appspot.com",
    messagingSenderId: "992957621777",
    appId: "1:992957621777:web:f91074f67f771b1b42b3b0",
    measurementId: "G-6MWKBZ866C"
};

// Inicializar Firebase App
const app = initializeApp(firebaseConfig);

// Inicializar Firebase Auth con persistencia en AsyncStorage
let auth;
try {
    auth = getAuth(app); // Intentar obtener una instancia de Auth existente
} catch {
    auth = initializeAuth(app, {
        persistence: getReactNativePersistence(ReactNativeAsyncStorage),
    });
}

// Inicializar Firestore
const firestore = getFirestore(app);

// Exportar Auth y Firestore para usarlos en otras partes de la aplicación
export { auth, firestore };
