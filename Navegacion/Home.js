import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../context/LanguageContext';
import { useUserRole } from '../context/UserRoleContext'; // Importar el contexto del rol del usuario
import styles from '../styles/stylesHome';

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

  const navigateToRegisterUser = () => {
    navigation.navigate('RegisterUser');
  };

  const navigateToGenerateReport = () => {
    navigation.navigate('GenerateReport');
  };

  const navigateToProgramProjectList = () => {
    navigation.navigate('ProgramProjectList');
  };

  const navigateToProjectForm = () => {
    navigation.navigate('ProjectForm');
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/image.png')} style={styles.logo} />

      {/* Opciones visibles solo para el rol "admin" */}
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

      {/* Botón visible tanto para "user" como para "admin" */}
      {userRole === 'admin' || userRole === 'user' ? (
        <TouchableOpacity style={styles.mainButton} onPress={navigateToRegisterUser}>
          <Text style={styles.mainButtonText}>
            {language === 'es' ? 'Registrar beneficiario' : 'Register Beneficiary'}
          </Text>
        </TouchableOpacity>
      ) : null}

      {/* Botón para mostrar la lista de programas y proyectos */}
      {userRole === 'admin' && (
        <TouchableOpacity style={styles.mainButton} onPress={navigateToProgramProjectList}>
          <Text style={styles.mainButtonText}>
            {language === 'es' ? 'Mostrar Programas y Proyectos' : 'Show Programs and Projects'}
          </Text>
        </TouchableOpacity>
      )}

      {/* Botón de Salir visible para ambos roles */}
      <TouchableOpacity style={styles.exitButton} onPress={handleLogout}>
        <Text style={styles.exitButtonText}>
          {language === 'es' ? 'Salir' : 'Exit'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home;
