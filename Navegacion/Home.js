import React, { useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../context/LanguageContext';
import { useUserRole } from '../context/UserRoleContext'; // Importar el contexto del rol del usuario

const { width, height } = Dimensions.get('window');

const Home = () => {
  const navigation = useNavigation();
  const { language } = useLanguage();
  const { userRole } = useUserRole(); // Obtener el rol del usuario

  useEffect(() => {
    console.log('User role:', userRole); // Verificar el rol del usuario en la consola
  }, [userRole]);

  const handleLogout = () => {
    navigation.navigate('Sesion');
  };

  const navigateToProgramForm = () => {
    navigation.navigate('ProgramForm');
  };

  const navigateToProjectForm = () => {
    navigation.navigate('ProjectForm');
  };

  const navigateToRegisterUser = () => {
    navigation.navigate('RegisterUser');
  };

  const navigateToGenerateReport = () => {
    navigation.navigate('GenerateReport');
  };

  return (
    <View style={styles.container}>
      {/* El logotipo se muestra para ambos roles */}
      <Image source={require('../assets/image.png')} style={styles.logo} />

      {userRole === 'admin' && (
        <>
          <TouchableOpacity style={styles.mainButton} onPress={navigateToProgramForm}>
            <Text style={styles.mainButtonText}>
              {language === 'es' ? 'Registrar programa' : 'Register Program'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.mainButton} onPress={navigateToProjectForm}>
            <Text style={styles.mainButtonText}>
              {language === 'es' ? 'Registrar proyecto' : 'Register Project'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.mainButton} onPress={navigateToGenerateReport}>
            <Text style={styles.mainButtonText}>
              {language === 'es' ? 'Generar informe' : 'Generate Report'}
            </Text>
          </TouchableOpacity>
        </>
      )}

      {/* Mostrar el botón "Registrar beneficiário" tanto para 'admin' como para 'user' */}
      {(userRole === 'admin' || userRole === 'user') && (
        <TouchableOpacity style={styles.mainButton} onPress={navigateToRegisterUser}>
          <Text style={styles.mainButtonText}>
            {language === 'es' ? 'Registrar beneficiário' : 'Register Beneficiary'}
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.exitButton} onPress={handleLogout}>
        <Text style={styles.exitButtonText}>
          {language === 'es' ? 'Salir' : 'Exit'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D3D3D3',
    alignItems: 'center',
    justifyContent: 'center',
    padding: width > 600 ? 20 : 10, // Ajuste dinámico del padding para pantallas más grandes
  },
  logo: {
    width: width * 0.5,
    height: undefined,
    aspectRatio: 1, // Mantiene la proporción original de la imagen
    marginBottom: height * 0.05,
  },
  mainButton: {
    backgroundColor: '#67A6F2',
    borderRadius: 10,
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.1,
    marginBottom: height * 0.02,
    width: width > 600 ? '60%' : '80%', // Ajuste dinámico del ancho del botón para pantallas más grandes
    alignItems: 'center',
  },
  mainButtonText: {
    color: 'black',
    fontSize: width > 600 ? 20 : width * 0.05, // Ajuste dinámico del tamaño de la fuente
    textAlign: 'center',
  },
  exitButton: {
    backgroundColor: '#F28C32',
    borderRadius: 10,
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.1,
    marginTop: height * 0.03,
    width: width > 600 ? '60%' : '80%', // Ajuste dinámico del ancho del botón para pantallas más grandes
    alignItems: 'center',
  },
  exitButtonText: {
    color: 'white',
    fontSize: width > 600 ? 20 : width * 0.05, // Ajuste dinámico del tamaño de la fuente
    textAlign: 'center',
  },
});

export default Home;
