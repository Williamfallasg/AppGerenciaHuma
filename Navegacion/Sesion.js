import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ScrollView, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../context/LanguageContext';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, firestore } from '../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

const Sesion = () => {

  const navigation = useNavigation();
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { language, setLanguage } = useLanguage();

  const handleSubmit = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, correo, contrasena);
      const user = userCredential.user;

      // Obtener el rol del usuario desde Firestore
      const docRef = doc(firestore, 'usuarios', user.email);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        const userRole = userData.rol;

        // Redirigir según el rol
        if (userRole === 'admin') {
          Alert.alert(
            language === 'es' ? 'Bienvenido al sistema de Humanitarian Consultants' : 'Welcome to the Humanitarian Consultants system'
          );
          navigation.navigate('Home');  // Navegar a la pantalla principal para admin
        } else if (userRole === 'user') {
          Alert.alert(
            language === 'es' ? 'Bienvenido' : 'Welcome'
          );
          navigation.navigate('Home');  // Navegar a la pantalla principal para usuarios
        } else {
          Alert.alert(language === 'es' ? 'Rol no autorizado' : 'Unauthorized role');
        }
      } else {
        Alert.alert(language === 'es' ? 'Error' : 'Error', language === 'es' ? 'No se encontró información del usuario.' : 'User information not found.');
      }
    } catch (error) {
      setCorreo('');
      setContrasena('');
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        Alert.alert(language === 'es' ? 'Error' : 'Error', language === 'es' ? 'Correo o contraseña incorrectos' : 'Incorrect email or password');
      } else {
        Alert.alert(language === 'es' ? 'Error' : 'Error', language === 'es' ? 'No se pudo iniciar sesión. Intente de nuevo.' : 'Could not log in. Please try again.');
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={require('../assets/image.png')} style={styles.logo} resizeMode="contain" />
        
        <View style={styles.languageButtonsContainer}>
          <TouchableOpacity style={styles.languageButton} onPress={() => setLanguage('es')}>
            <Text style={styles.languageButtonText}>Español</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.languageButton} onPress={() => setLanguage('en')}>
            <Text style={styles.languageButtonText}>English</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>{language === 'es' ? 'Correo' : 'Email'}</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, { paddingRight: 35 }]}
            placeholder={language === 'es' ? 'Correo' : 'Email'}
            value={correo}
            onChangeText={setCorreo}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#B0B0B0"
          />
        </View>
        <Text style={styles.label}>{language === 'es' ? 'Contraseña' : 'Password'}</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, { paddingRight: 35 }]}
            placeholder={language === 'es' ? 'Contraseña' : 'Password'}
            secureTextEntry={!showPassword}
            value={contrasena}
            onChangeText={setContrasena}
            placeholderTextColor="#B0B0B0"
          />
          <TouchableOpacity style={styles.iconContainer} onPress={() => setShowPassword(!showPassword)}>
            <Icon name={showPassword ? "eye-off" : "eye"} size={24} color="#B0B0B0" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>{language === 'es' ? 'Iniciar sesión' : 'Log In'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Registrarse')}>
          <Text style={styles.linkText}>{language === 'es' ? 'Registrar usuario' : 'Register User'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Rec_contraseña')}>
          <Text style={styles.linkText}>{language === 'es' ? 'Recuperar contraseña' : 'Recover Password'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#D3D3D3',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: height * 0.02,
    paddingHorizontal: width > 600 ? 20 : 10,
  },
  logo: {
    width: '70%',
    height: height * 0.2,
    marginBottom: height * 0.05,
  },
  label: {
    alignSelf: 'flex-start',
    color: 'black',
    fontSize: width > 600 ? 18 : width * 0.045,
    marginBottom: height * 0.01,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: height * 0.02,
    paddingLeft: 10,
    width: '100%',
    height: height * 0.07,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    height: '100%',
    flex: 1,
    color: 'black',
  },
  iconContainer: {
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#67A6F2',
    borderRadius: 10,
    paddingVertical: height * 0.02,
    paddingHorizontal: '10%',
    marginBottom: height * 0.02,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontSize: width > 600 ? 18 : width * 0.045,
    textAlign: 'center',
  },
  linkText: {
    color: 'black',
    marginTop: height * 0.02,
    fontSize: width > 600 ? 16 : width * 0.04,
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
  languageButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: height * 0.02,
    marginBottom: height * 0.02,
  },
  languageButton: {
    flex: 1,
    backgroundColor: '#67A6F2',
    borderRadius: 10,
    paddingVertical: height * 0.015,
    marginHorizontal: width * 0.02,
    justifyContent: 'center',
    alignItems: 'center',
  },
  languageButtonText: {
    color: 'black',
    fontSize: width > 600 ? 16 : width * 0.04,
    textAlign: 'center',
  },
});

export default Sesion;
