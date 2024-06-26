import React, { useState, useEffect } from 'react';
import { Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { getAuth, signOut, deleteUser, updatePassword } from 'firebase/auth';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';

const EditPerfil = () => {
  const navigation = useNavigation();
  const auth = getAuth();
  const user = auth.currentUser;

  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
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
      }
    };

    fetchUserData();
  }, [user]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage({ uri: result.uri });
      Alert.alert('Imagen seleccionada satisfactoriamente');
    }
  };

  const handleUpdateProfile = async () => {
    if (user) {
      try {
        const updateData = {
          nombre: name,
          apellidos: surname,
          contrasena: password,
        };

        // Se actualiza los datos del usuario en Firestore
        const userRef = doc(firestore, 'usuarios', user.email);
        await updateDoc(userRef, updateData);

        if (password) {
          await updatePassword(user, password);
        }

        Alert.alert('Perfil actualizado satisfactoriamente');
      } catch (error) {
        Alert.alert('Error al actualizar perfil', error.message);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Sesion');
      Alert.alert('Cerrando sesión');
    } catch (error) {
      Alert.alert('Error al cerrar sesión', error.message);
    }
  };

  const handleDeleteAccount = async () => {
    if (user) {
      try {
        const userRef = doc(firestore, 'usuarios', user.email);
        await deleteDoc(userRef);  
        await deleteUser(user);    
        Alert.alert('Cuenta eliminada');
        navigation.navigate('Sesion'); 
      } catch (error) {
        Alert.alert('Error al eliminar cuenta', error.message);
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={profileImage} style={styles.profileImage} />
      <TouchableOpacity style={styles.changePhotoButton} onPress={pickImage}>
        <Text style={styles.changePhotoButtonText}>Cambiar Foto</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Editar nombre</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Editar apellidos</Text>
      <TextInput
        style={styles.input}
        value={surname}
        onChangeText={setSurname}
      />

      <Text style={styles.label}>Correo electrónico</Text>
      <TextInput
        style={styles.input}
        value={email}
        editable={false} 
        keyboardType="email-address"
      />

      <Text style={styles.label}>Contraseña</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.updateButton} onPress={handleUpdateProfile}>
        <Text style={styles.buttonText}>Actualizar perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.linkButton} onPress={handleLogout}>
        <Text style={styles.linkText}>Cerrar Sesión</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.linkButton} onPress={handleDeleteAccount}>
        <Text style={styles.linkText}>Eliminar cuenta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#2C6C6C',
    alignItems: 'center',
  },
  profileImage: {
    width: 154,
    height: 131,
    borderRadius: 50,
    marginBottom: 20,
    marginTop: 30,
  },
  changePhotoButton: {
    backgroundColor: '#87B4B5',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 20,
    width: 186,
    height: 47,
    alignItems: 'center',
  },
  changePhotoButtonText: {
    color: 'white',
    fontSize: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    alignItems: 'center',
  },
  label: {
    color: 'white',
    alignSelf: 'flex-start',
    marginVertical: 5,
  },
  input: {
    width: '100%',
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'white',
    marginBottom: 10,
  },
  updateButton: {
    width: '100%',
    height: 40,
    backgroundColor: '#87B4B5',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  linkButton: {
    marginVertical: 10,
  },
  linkText: {
    color: 'white',
    textDecorationLine: 'underline',
  },
});

export default EditPerfil;
