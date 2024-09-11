import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, Image } from 'react-native';
import { getAuth, onAuthStateChanged, updateEmail, signOut, deleteUser } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker'; // Importamos ImagePicker
import { firestore } from '../firebase/firebase';
import { useLanguage } from '../context/LanguageContext';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/stylesEditPerfil'; // Usando el archivo de estilos que ajustaremos para un diseño profesional

const EditPerfil = () => {
  const { language } = useLanguage();
  const navigation = useNavigation(); // Para navegación
  const [user, setUser] = useState(null); // Estado para almacenar el usuario autenticado
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [correo, setCorreo] = useState('');
  const [loading, setLoading] = useState(true); // Para indicar cuando estamos cargando los datos
  const [image, setImage] = useState(null); // Estado para la imagen de perfil

  useEffect(() => {
    const auth = getAuth();

    // Escuchar el estado de autenticación del usuario
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user); // Guardar el usuario autenticado en el estado
        cargarDatosUsuario(user); // Cargar los datos del usuario
      } else {
        setLoading(false); // Si no hay usuario, dejar de cargar
        Alert.alert(language === 'es' ? 'Error' : 'Error', language === 'es' ? 'Usuario no autenticado.' : 'User not authenticated.');
      }
    });

    return () => unsubscribe(); // Limpiar el listener al desmontar el componente
  }, [language]);

  const cargarDatosUsuario = async (user) => {
    try {
      const userDoc = await getDoc(doc(firestore, 'usuarios', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setNombre(userData.nombre);
        setApellidos(userData.apellidos);
        setCorreo(userData.correo);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar los datos del usuario:', error);
      Alert.alert(language === 'es' ? 'Error' : 'Error', language === 'es' ? 'No se pudieron cargar los datos del usuario.' : 'Failed to load user data.');
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!nombre || !apellidos || !correo) {
      Alert.alert(language === 'es' ? 'Error' : 'Error', language === 'es' ? 'Todos los campos son obligatorios' : 'All fields are required');
      return;
    }

    try {
      // Actualizar el correo del usuario autenticado
      await updateEmail(user, correo);

      // Actualizar los datos del usuario en Firestore
      await updateDoc(doc(firestore, 'usuarios', user.uid), {
        nombre: nombre,
        apellidos: apellidos,
        correo: correo
      });

      Alert.alert(language === 'es' ? 'Éxito' : 'Success', language === 'es' ? 'Perfil actualizado con éxito' : 'Profile updated successfully');
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      Alert.alert(language === 'es' ? 'Error' : 'Error', language === 'es' ? 'No se pudo actualizar el perfil.' : 'Failed to update profile.');
    }
  };

  const handleSignOut = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      navigation.navigate('Sesion'); // Navegar a la pantalla de inicio de sesión
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      Alert.alert(language === 'es' ? 'Error' : 'Error', language === 'es' ? 'No se pudo cerrar sesión.' : 'Could not sign out.');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      // Eliminar los datos del usuario de Firestore
      await updateDoc(doc(firestore, 'usuarios', user.uid), { deleted: true }); // Marcamos como eliminada la cuenta en Firestore (opcional)

      // Eliminar la cuenta del usuario
      await deleteUser(user);

      Alert.alert(language === 'es' ? 'Cuenta eliminada' : 'Account deleted');
      navigation.navigate('Sesion'); // Navegar a la pantalla de inicio de sesión
    } catch (error) {
      console.error('Error al eliminar la cuenta:', error);
      Alert.alert(language === 'es' ? 'Error' : 'Error', language === 'es' ? 'No se pudo eliminar la cuenta.' : 'Could not delete account.');
    }
  };

  // Función para seleccionar una foto de la galería
  const pickImage = async () => {
    // Solicitar permiso para acceder a la galería
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(language === 'es' ? 'Permiso denegado' : 'Permission denied', language === 'es' ? 'Se requiere acceso a la galería para seleccionar una foto.' : 'Gallery access is required to select a photo.');
      return;
    }

    // Permitir al usuario seleccionar una imagen
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri); // Guardar la URI de la imagen seleccionada
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>{language === 'es' ? 'Cargando...' : 'Loading...'}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Image
          source={{ uri: image || user?.photoURL || 'https://via.placeholder.com/154' }} // Foto de perfil o placeholder
          style={styles.profileImage}
        />
        <TouchableOpacity style={styles.changePhotoButton} onPress={pickImage}>
          <Text style={styles.changePhotoButtonText}>
            {language === 'es' ? 'Cambiar Foto' : 'Change Photo'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.label}>{language === 'es' ? 'Editar nombre' : 'Edit First Name'}</Text>
        <TextInput
          style={styles.input}
          placeholder={language === 'es' ? 'Nombre' : 'First Name'}
          onChangeText={setNombre}
          value={nombre}
          placeholderTextColor="#B0B0B0"
        />

        <Text style={styles.label}>{language === 'es' ? 'Editar apellidos' : 'Edit Last Name'}</Text>
        <TextInput
          style={styles.input}
          placeholder={language === 'es' ? 'Apellidos' : 'Last Name'}
          onChangeText={setApellidos}
          value={apellidos}
          placeholderTextColor="#B0B0B0"
        />

        <Text style={styles.label}>{language === 'es' ? 'Correo electrónico' : 'Email'}</Text>
        <TextInput
          style={styles.input}
          placeholder={language === 'es' ? 'Correo' : 'Email'}
          onChangeText={setCorreo}
          value={correo}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#B0B0B0"
        />

        <Text style={styles.label}>{language === 'es' ? 'Contraseña' : 'Password'}</Text>
        <TextInput
          style={styles.input}
          placeholder={language === 'es' ? 'Contraseña' : 'Password'}
          secureTextEntry
          placeholderTextColor="#B0B0B0"
        />

        <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
          <Text style={styles.buttonText}>{language === 'es' ? 'Actualizar perfil' : 'Update Profile'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkButton} onPress={handleSignOut}>
          <Text style={styles.linkText}>{language === 'es' ? 'Cerrar Sesión' : 'Sign Out'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkButton} onPress={handleDeleteAccount}>
          <Text style={styles.linkText}>{language === 'es' ? 'Eliminar cuenta' : 'Delete Account'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default EditPerfil;
