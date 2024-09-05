// UserRoleContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Importa la autenticación de Firebase
import { doc, getDoc } from 'firebase/firestore'; // Importa Firebase Firestore
import { firestore } from '../firebase/firebase'; // Asegúrate de que este sea el archivo correcto donde está Firestore

const UserRoleContext = createContext();

export const UserRoleProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    // Escuchar el estado de autenticación
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Si el usuario está autenticado, obtenemos su rol de Firebase Firestore
        const userDocRef = doc(firestore, 'usuarios', user.email); // Usa el correo electrónico del usuario como ID
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserRole(userData.rol); // Asigna el rol del usuario
        } else {
          console.log('No such user document!');
        }
      } else {
        // Si no hay usuario autenticado, el rol se establece en null
        setUserRole(null);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  return (
    <UserRoleContext.Provider value={{ userRole }}>
      {children}
    </UserRoleContext.Provider>
  );
};

export const useUserRole = () => {
  return useContext(UserRoleContext);
};
