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

  return (
    <View style={styles.container}>
      {/* El logotipo se muestra para ambos roles */}
      <Image source={require('../assets/image.png')} style={styles.logo} />

      {/* Mostrar botones solo para administradores */}
      {userRole === 'admin' && (
        <>
          {/* Primero: Registrar programa */}
          <TouchableOpacity style={styles.mainButton} onPress={navigateToProgramForm}>
            <Text style={styles.mainButtonText}>
              {language === 'es' ? 'Registrar programa' : 'Register Program'}
            </Text>
          </TouchableOpacity>

          {/* Segundo: Registrar beneficiário */}
          <TouchableOpacity style={styles.mainButton} onPress={navigateToRegisterUser}>
            <Text style={styles.mainButtonText}>
              {language === 'es' ? 'Registrar beneficiario' : 'Register Beneficiary'}
            </Text>
          </TouchableOpacity>

          {/* Tercero: Generar informe */}
          <TouchableOpacity style={styles.mainButton} onPress={navigateToGenerateReport}>
            <Text style={styles.mainButtonText}>
              {language === 'es' ? 'Generar informe' : 'Generate Report'}
            </Text>
          </TouchableOpacity>
        </>
      )}

      {/* Botón para mostrar la lista de programas y proyectos */}
      <TouchableOpacity style={styles.mainButton} onPress={navigateToProgramProjectList}>
        <Text style={styles.mainButtonText}>
          {language === 'es' ? 'Mostrar Programas y Proyectos' : 'Show Programs and Projects'}
        </Text>
      </TouchableOpacity>

      {/* Botón de salir */}
      <TouchableOpacity style={styles.exitButton} onPress={handleLogout}>
        <Text style={styles.exitButtonText}>
          {language === 'es' ? 'Salir' : 'Exit'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home;
