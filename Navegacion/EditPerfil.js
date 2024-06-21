import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';

const EditPerfil = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('William');
  const [surname, setSurname] = useState('Fallas González');
  const [birthDate, setBirthDate] = useState('12/06/1994');
  const [password, setPassword] = useState('Xtyywuwwo-17');
  const [profileImage, setProfileImage] = useState(require('../assets/imgL.png'));

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
    }
  };

  const handleUpdateProfile = () => {
    Alert.alert('Perfil actualizado satisfactoriamente');
  };

  const handleLogout = () => {
    Alert.alert('Cerrando sesión');
  };

  const handleDeleteAccount = () => {
    Alert.alert('Cuenta eliminada');
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

      <Text style={styles.label}>Editar fecha de nacimiento</Text>
      <TextInput
        style={styles.input}
        value={birthDate}
        onChangeText={setBirthDate}
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
