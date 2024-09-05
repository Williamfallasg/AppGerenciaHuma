import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

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

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore };