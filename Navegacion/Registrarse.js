import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';
import { useLanguage } from '../context/LanguageContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from '../styles/stylesRegistrarse'; 

const Registrarse = () => {
  const { language } = useLanguage();
  const navigation = useNavigation();
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [rol, setRol] = useState('user'); 
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [esAdmin, setEsAdmin] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const verificarRol = async (user) => {
      try {
        const userDoc = await getDoc(doc(firestore, 'usuarios', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setEsAdmin(userData.rol === 'admin');
        }
      } catch (error) {
        console.error("Error al obtener el rol del usuario:", error);
      }
    };

    const unsuscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        verificarRol(user);
      }
    });

    return () => unsuscribe();
  }, []);

  const validarEmail = (correo) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(correo);
  };

  const handleSubmit = async () => {
    if (!nombre || !apellidos || !correo || !contrasena) {
      Alert.alert(language === 'es' ? 'Error' : 'Error', language === 'es' ? 'Todos los campos son obligatorios' : 'All fields are required');
      return;
    }

    if (!validarEmail(correo)) {
      Alert.alert(language === 'es' ? 'Error' : 'Error', language === 'es' ? 'El correo no es válido' : 'Invalid email address');
      return;
    }

    if (contrasena.length < 6) {
      Alert.alert(language === 'es' ? 'Error' : 'Error', language === 'es' ? 'La contraseña debe tener al menos 6 caracteres' : 'Password must be at least 6 characters long');
      return;
    }

    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, correo, contrasena);
      const user = userCredential.user;

      await setDoc(doc(firestore, 'usuarios', user.uid), {
        nombre: nombre,
        apellidos: apellidos,
        correo: correo,
        rol: rol 
      });

      Alert.alert(language === 'es' ? 'Registro exitoso' : 'Registration successful');

      setNombre('');
      setApellidos('');
      setCorreo('');
      setContrasena('');
      navigation.navigate('Sesion');
    } catch (error) {
      Alert.alert(language === 'es' ? 'Error de registro' : 'Registration error', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image source={require('../assets/image.png')} style={styles.logo} />
        </View>

        <Text style={styles.title}>{language === 'es' ? 'REGISTRO' : 'REGISTER'}</Text>

        <Text style={styles.label}>{language === 'es' ? 'Nombre' : 'First Name'}</Text>
        <TextInput
          style={styles.input}
          placeholder={language === 'es' ? 'Nombre' : 'First Name'}
          onChangeText={setNombre}
          value={nombre}
          placeholderTextColor="#B0B0B0"
        />

        <Text style={styles.label}>{language === 'es' ? 'Apellidos' : 'Last Name'}</Text>
        <TextInput
          style={styles.input}
          placeholder={language === 'es' ? 'Apellidos' : 'Last Name'}
          onChangeText={setApellidos}
          value={apellidos}
          placeholderTextColor="#B0B0B0"
        />

        <Text style={styles.label}>{language === 'es' ? 'Correo' : 'Email'}</Text>
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
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, styles.inputPassword]}
            placeholder={language === 'es' ? 'Contraseña' : 'Password'}
            secureTextEntry={!mostrarContrasena}
            onChangeText={setContrasena}
            value={contrasena}
            placeholderTextColor="#B0B0B0"
          />
          <TouchableOpacity style={styles.iconButton} onPress={() => setMostrarContrasena(!mostrarContrasena)}>
            <Icon name={mostrarContrasena ? 'visibility' : 'visibility-off'} size={24} color="#8A8A8A" />
          </TouchableOpacity>
        </View>

        {esAdmin && (
          <>
            <Text style={styles.label}>{language === 'es' ? 'Seleccionar Rol' : 'Select Role'}</Text>
            <View style={styles.roleSelector}>
              <TouchableOpacity
                style={rol === 'user' ? styles.roleButtonSelected : styles.roleButton}
                onPress={() => setRol('user')}
              >
                <Text>{language === 'es' ? 'Usuario' : 'User'}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={rol === 'admin' ? styles.roleButtonSelected : styles.roleButton}
                onPress={() => setRol('admin')}
              >
                <Text>{language === 'es' ? 'Administrador' : 'Admin'}</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>{language === 'es' ? 'Registrar' : 'Register'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Sesion')}>
          <Text style={styles.link}>{language === 'es' ? '¿Ya tiene una cuenta?' : 'Already have an account?'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('EditPerfil')}>
          <Text style={styles.link}>{language === 'es' ? 'Edita Perfil' : 'Edit Profile'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Registrarse;
