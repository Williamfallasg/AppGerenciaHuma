import React, { useState, useEffect } from 'react';
import { Text, TextInput, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { getAuth, signOut, deleteUser, updatePassword } from 'firebase/auth';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';
import { useLanguage } from '../context/LanguageContext';
import styles from '../styles/stylesEditPerfil'; // Importa los estilos

const EditPerfil = () => {
  const { language } = useLanguage();
  const navigation = useNavigation();
  const auth = getAuth();
  const user = auth.currentUser;

  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profileImage, setProfileImage] = useState(require('../assets/imgL.png'));

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userRef = doc(firestore, 'usuarios', user.email);
          const docSnap = await getDoc(userRef);
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setName(userData.nombre);
            setSurname(userData.apellidos);
            setEmail(userData.correo);
            setPassword(userData.contrasena);
            setProfileImage(userData.profileImage ? { uri: userData.profileImage } : require('../assets/imgL.png'));
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          Alert.alert(
            language === 'es' ? 'Error' : 'Error',
            language === 'es' ? 'No se pudo cargar los datos del perfil' : 'Could not load profile data'
          );
        }
      }
    };

    fetchUserData();
  }, [user, language]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        language === 'es' ? 'Permiso denegado' : 'Permission denied',
        language === 'es' ? 'Se necesita permiso para acceder a la galería.' : 'Permission is needed to access the gallery.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.uri) {
      setProfileImage({ uri: result.uri });
      Alert.alert(
        language === 'es' ? 'Imagen seleccionada satisfactoriamente' : 'Image successfully selected'
      );
    }
  };

  const handleUpdateProfile = async () => {
    if (user) {
      try {
        const updateData = {
          nombre: name,
          apellidos: surname,
        };

        if (password && password !== '') {
          await updatePassword(user, password);
          updateData.contrasena = password;
        }

        const userRef = doc(firestore, 'usuarios', user.email);
        await updateDoc(userRef, updateData);

        Alert.alert(
          language === 'es' ? 'Perfil actualizado satisfactoriamente' : 'Profile updated successfully'
        );
      } catch (error) {
        console.error("Error updating profile:", error);
        Alert.alert(
          language === 'es' ? 'Error al actualizar perfil' : 'Error updating profile',
          error.message
        );
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Sesion');
      Alert.alert(
        language === 'es' ? 'Sesión cerrada' : 'Session closed'
      );
    } catch (error) {
      console.error("Error signing out:", error);
      Alert.alert(
        language === 'es' ? 'Error al cerrar sesión' : 'Error signing out',
        error.message
      );
    }
  };

  const handleDeleteAccount = async () => {
    if (user) {
      try {
        const userRef = doc(firestore, 'usuarios', user.email);
        await deleteDoc(userRef);
        await deleteUser(user);
        Alert.alert(
          language === 'es' ? 'Cuenta eliminada' : 'Account deleted'
        );
        navigation.navigate('Sesion');
      } catch (error) {
        console.error("Error deleting account:", error);
        Alert.alert(
          language === 'es' ? 'Error al eliminar cuenta' : 'Error deleting account',
          error.message
        );
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Image source={profileImage} style={styles.profileImage} />
      <TouchableOpacity style={styles.changePhotoButton} onPress={pickImage}>
        <Text style={styles.changePhotoButtonText}>
          {language === 'es' ? 'Cambiar Foto' : 'Change Photo'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.label}>
        {language === 'es' ? 'Editar nombre' : 'Edit First Name'}
      </Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder={language === 'es' ? 'Nombre' : 'First Name'}
        placeholderTextColor="#B0B0B0"
      />

      <Text style={styles.label}>
        {language === 'es' ? 'Editar apellidos' : 'Edit Last Name'}
      </Text>
      <TextInput
        style={styles.input}
        value={surname}
        onChangeText={setSurname}
        placeholder={language === 'es' ? 'Apellidos' : 'Last Name'}
        placeholderTextColor="#B0B0B0"
      />

      <Text style={styles.label}>
        {language === 'es' ? 'Correo electrónico' : 'Email'}
      </Text>
      <TextInput
        style={styles.input}
        value={email}
        editable={false}
        keyboardType="email-address"
        placeholderTextColor="#B0B0B0"
      />

      <Text style={styles.label}>
        {language === 'es' ? 'Contraseña' : 'Password'}
      </Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder={language === 'es' ? 'Contraseña' : 'Password'}
        placeholderTextColor="#B0B0B0"
      />

      <TouchableOpacity style={styles.updateButton} onPress={handleUpdateProfile}>
        <Text style={styles.buttonText}>
          {language === 'es' ? 'Actualizar perfil' : 'Update Profile'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.linkButton} onPress={handleLogout}>
        <Text style={styles.linkText}>
          {language === 'es' ? 'Cerrar Sesión' : 'Sign Out'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.linkButton} onPress={handleDeleteAccount}>
        <Text style={styles.linkText}>
          {language === 'es' ? 'Eliminar cuenta' : 'Delete Account'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EditPerfil;
