import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';
import addData from '../firebase/addData';
import { useLanguage } from '../context/LanguageContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from '../styles/stylesRegistrarse';  // Importamos el archivo de estilos

const Registrarse = () => {
  const { language } = useLanguage();
  const navigation = useNavigation();
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [rol, setRol] = useState('user');
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const verificarRolAdmin = async () => {
      const auth = getAuth();
      const usuarioActual = auth.currentUser;
      if (usuarioActual) {
        const docRef = doc(firestore, "usuarios", usuarioActual.email);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const datosUsuario = docSnap.data();
          if (datosUsuario.rol === 'admin') {
            setIsAdmin(true);
          }
        }
      }
    };
    verificarRolAdmin();
  }, []);

  const handleSubmit = async () => {
    const emailDomains = ['gmail.com', 'hotmail.com', 'ucr.ac.cr', 'outlook.com', 'humanitarianconsultants.org'];
    const emailDomain = correo.split('@')[1];

    if (emailDomains.includes(emailDomain)) {
      try {
        const usersCollection = collection(firestore, 'usuarios');
        const q = query(usersCollection, where('correo', '==', correo));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          Alert.alert(
            language === 'es' ? 'Error' : 'Error',
            language === 'es' ? 'El correo ya está registrado' : 'The email is already registered'
          );
        } else {
          const auth = getAuth();
          await createUserWithEmailAndPassword(auth, correo, contrasena);

          await addData("usuarios", correo, {
            nombre: nombre,
            apellidos: apellidos,
            correo: correo,
            contrasena: contrasena,
            rol: rol 
          });

          Alert.alert(
            language === 'es' ? 'Registro exitoso' : 'Registration successful'
          );

          setNombre('');
          setApellidos('');
          setCorreo('');
          setContrasena('');
          navigation.navigate('Sesion');
        }
      } catch (error) {
        Alert.alert(
          language === 'es' ? 'Error de registro' : 'Registration error', 
          error.message
        );
      }
    } else {
      Alert.alert(
        language === 'es' ? 'Dominio de correo electrónico no válido' : 'Invalid email domain'
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image source={require('../assets/image.png')} style={styles.logo} />
        </View>

        <Text style={styles.title}>
          {language === 'es' ? 'REGISTRO' : 'REGISTER'}
        </Text>

        <Text style={styles.label}>
          {language === 'es' ? 'Nombre' : 'First Name'}
        </Text>
        <TextInput
          style={styles.input}
          placeholder={language === 'es' ? 'Nombre' : 'First Name'}
          onChangeText={(text) => setNombre(text)}
          value={nombre}
          placeholderTextColor="#B0B0B0"
        />

        <Text style={styles.label}>
          {language === 'es' ? 'Apellidos' : 'Last Name'}
        </Text>
        <TextInput
          style={styles.input}
          placeholder={language === 'es' ? 'Apellidos' : 'Last Name'}
          onChangeText={(text) => setApellidos(text)}
          value={apellidos}
          placeholderTextColor="#B0B0B0"
        />

        <Text style={styles.label}>
          {language === 'es' ? 'Correo' : 'Email'}
        </Text>
        <TextInput
          style={styles.input}
          placeholder={language === 'es' ? 'Correo' : 'Email'}
          onChangeText={(text) => setCorreo(text)}
          value={correo}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#B0B0B0"
        />

        <Text style={styles.label}>
          {language === 'es' ? 'Contraseña' : 'Password'}
        </Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, styles.inputPassword]}
            placeholder={language === 'es' ? 'Contraseña' : 'Password'}
            secureTextEntry={!mostrarContrasena}
            onChangeText={(text) => setContrasena(text)}
            value={contrasena}
            placeholderTextColor="#B0B0B0"
          />
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => setMostrarContrasena(!mostrarContrasena)}
          >
            <Icon 
              name={mostrarContrasena ? 'visibility' : 'visibility-off'}
              size={24} 
              color="#8A8A8A"
            />
          </TouchableOpacity>
        </View>

        {isAdmin && (
          <>
            <Text style={styles.label}>
              {language === 'es' ? 'Seleccionar Rol' : 'Select Role'}
            </Text>
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
          <Text style={styles.buttonText}>
            {language === 'es' ? 'Registrar' : 'Register'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Sesion')}>
          <Text style={styles.link}>
            {language === 'es' ? '¿Ya tiene una cuenta?' : 'Already have an account?'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Registrarse;
