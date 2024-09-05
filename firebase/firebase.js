// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";  // Importar Firestore

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

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Inicializar Auth
const firestore = getFirestore(app); // Inicializar Firestore

export { auth, firestore }; // Exportar Auth y Firestore para usarlos en otras partes de la aplicación
