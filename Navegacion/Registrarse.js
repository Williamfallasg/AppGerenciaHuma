import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';
import addData from '../firebase/addData';
import { useLanguage } from '../context/LanguageContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from '../styles/stylesRegistrarse';  // Importamos el archivo de estilos

// Componente para el registro de nuevos usuarios
const Registrarse = () => {
  const { language } = useLanguage(); // Obtener el idioma de la aplicación
  const navigation = useNavigation(); // Hook para la navegación entre pantallas
  const [nombre, setNombre] = useState(''); // Estado para el nombre
  const [apellidos, setApellidos] = useState(''); // Estado para los apellidos
  const [correo, setCorreo] = useState(''); // Estado para el correo electrónico
  const [contrasena, setContrasena] = useState(''); // Estado para la contraseña
  const [rol, setRol] = useState('user'); // Estado para el rol, por defecto 'user'
  const [mostrarContrasena, setMostrarContrasena] = useState(false); // Estado para mostrar/ocultar la contraseña

  // Función que maneja el registro del usuario
    const handleSubmit = async () => {
    const emailDomains = ['gmail.com', 'hotmail.com', 'ucr.ac.cr','outlook.com', 'humanitarianconsultants.org']; // Dominios de correo válidos
    const emailDomain = correo.split('@')[1]; // Obtener el dominio del correo electrónico

    // Verificar si el dominio del correo es válido
    if (emailDomains.includes(emailDomain)) {
      try {
        // Verificar si el correo ya está registrado en Firestore
        const usersCollection = collection(firestore, 'usuarios');
        const q = query(usersCollection, where('correo', '==', correo));
        const querySnapshot = await getDocs(q);

        // Si el correo ya existe, mostrar una alerta
        if (!querySnapshot.empty) {
          Alert.alert(
            language === 'es' ? 'Error' : 'Error',
            language === 'es' ? 'El correo ya está registrado' : 'The email is already registered'
          );
        } else {
          // Crear usuario en Firebase Authentication
          const auth = getAuth();
          await createUserWithEmailAndPassword(auth, correo, contrasena);

          // Guardar los datos del usuario en Firestore
          await addData("usuarios", correo, {
            nombre: nombre,
            apellidos: apellidos,
            correo: correo,
            contrasena: contrasena,
            rol: rol // Guardar el rol dinámicamente
          });

          // Mostrar alerta de registro exitoso
          Alert.alert(
            language === 'es' ? 'Registro exitoso' : 'Registration successful'
          );

          // Limpiar los campos del formulario
          setNombre('');
          setApellidos('');
          setCorreo('');
          setContrasena('');

          // Navegar a la pantalla de inicio de sesión
          navigation.navigate('Sesion');
        }
      } catch (error) {
        // Mostrar alerta en caso de error
        Alert.alert(
          language === 'es' ? 'Error de registro' : 'Registration error', 
          error.message
        );
      }
    } else {
      // Mostrar alerta si el dominio del correo no es válido
      Alert.alert(
        language === 'es' ? 'Dominio de correo electrónico no válido' : 'Invalid email domain'
      );
    }
  };

  // Renderizado del formulario de registro
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Contenedor principal */}
      <View style={styles.container}>
        {/* Logo de la aplicación */}
        <View style={styles.logoContainer}>
          <Image source={require('../assets/image.png')} style={styles.logo} />
        </View>

        {/* Título del formulario */}
        <Text style={styles.title}>
          {language === 'es' ? 'REGISTRO' : 'REGISTER'}
        </Text>

        {/* Campo de entrada para el nombre */}
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

        {/* Campo de entrada para los apellidos */}
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

        {/* Campo de entrada para el correo electrónico */}
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

        {/* Campo de entrada para la contraseña */}
        <Text style={styles.label}>
          {language === 'es' ? 'Contraseña' : 'Password'}
        </Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, styles.inputPassword]}
            placeholder={language === 'es' ? 'Contraseña' : 'Password'}
            secureTextEntry={!mostrarContrasena} // Mostrar/ocultar contraseña
            onChangeText={(text) => setContrasena(text)}
            value={contrasena}
            placeholderTextColor="#B0B0B0"
          />
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => setMostrarContrasena(!mostrarContrasena)} // Cambiar visibilidad de la contraseña
          >
            <Icon 
              name={mostrarContrasena ? 'visibility' : 'visibility-off'}
              size={24} 
              color="#8A8A8A"
            />
          </TouchableOpacity>
        </View>

        {/* Selector de Rol */}
        <Text style={styles.label}>
          {language === 'es' ? 'Seleccionar Rol' : 'Select Role'}
        </Text>
        <View style={styles.roleSelector}>
          {/* Botón para seleccionar 'user' */}
          <TouchableOpacity
            style={rol === 'user' ? styles.roleButtonSelected : styles.roleButton}
            onPress={() => setRol('user')}
          >
            <Text>{language === 'es' ? 'Usuario' : 'User'}</Text>
          </TouchableOpacity>

          {/* Botón para seleccionar 'admin' */}
          <TouchableOpacity
            style={rol === 'admin' ? styles.roleButtonSelected : styles.roleButton}
            onPress={() => setRol('admin')}
          >
            <Text>{language === 'es' ? 'Administrador' : 'Admin'}</Text>
          </TouchableOpacity>
        </View>
        {/* Botón para enviar el formulario */}
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>
            {language === 'es' ? 'Registrar' : 'Register'}
          </Text>
        </TouchableOpacity>

        {/* Enlace para ir a la pantalla de inicio de sesión */}
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
