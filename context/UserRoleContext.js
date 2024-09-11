import React, { createContext, useState, useContext, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Importa la autenticación de Firebase
import { doc, getDoc } from 'firebase/firestore'; // Importa Firebase Firestore
import { firestore } from '../firebase/firebase'; // Asegúrate de que este sea el archivo correcto donde está Firestore

// Crear el contexto para el rol del usuario
const UserRoleContext = createContext();

export const UserRoleProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true); // Estado para manejar la carga mientras se obtiene el rol
  const auth = getAuth();

  useEffect(() => {
    // Escuchar el estado de autenticación
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Si el usuario está autenticado, obtenemos su rol de Firebase Firestore
          const userDocRef = doc(firestore, 'usuarios', user.uid); // Usa el UID del usuario como ID
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserRole(userData.rol); // Asigna el rol del usuario
            console.log('User role fetched:', userData.rol);
          } else {
            console.log('No such user document!');
            setUserRole(null); // Si no se encuentra el documento, asignamos null al rol
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
          setUserRole(null); // En caso de error, se asegura que el rol esté en null
        } finally {
          setLoading(false); // Desactivamos el estado de carga
        }
      } else {
        // Si no hay usuario autenticado, el rol se establece en null
        setUserRole(null);
        setLoading(false); // Desactivamos el estado de carga
      }
    });

    // Limpieza del efecto
    return () => unsubscribe();
  }, [auth]);

  return (
    <UserRoleContext.Provider value={{ userRole, loading }}>
      {children}
    </UserRoleContext.Provider>
  );
};

export const useUserRole = () => {
  return useContext(UserRoleContext);
};
