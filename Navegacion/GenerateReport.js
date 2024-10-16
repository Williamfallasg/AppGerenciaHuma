import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../context/LanguageContext';
import { useUserRole } from '../context/UserRoleContext';
import styles from '../styles/stylesGenerateReport'; // Importar los estilos desde el archivo separado

const GenerateReport = () => {
  const { language } = useLanguage();
  const { userRole } = useUserRole();
  const [selectedOption, setSelectedOption] = useState('Programas');
  const navigation = useNavigation();

  // Helper para cambiar el idioma
  const translate = (textEs, textEn) => (language === 'es' ? textEs : textEn);

  // Función para validar el acceso y redirigir si el usuario no tiene permisos
  const checkAccessAndRedirect = () => {
    if (userRole !== 'admin') {
      Alert.alert(
        translate('Acceso denegado', 'Access Denied'),
        translate('No tiene permisos para acceder a esta sección.', 'You do not have permission to access this section.'),
        [{ text: translate('Aceptar', 'OK'), onPress: () => navigation.navigate('Home') }]
      );
    }
  };

  useEffect(() => {
    checkAccessAndRedirect();
  }, [userRole]);

  // Si no es admin, no renderizamos nada
  if (userRole !== 'admin') {
    return null;
  }

  // Manejo de la generación de reporte
  const handleGenerateReport = () => {
    if (!selectedOption) {
      Alert.alert(
        translate('Error', 'Error'),
        translate('Por favor, seleccione una opción', 'Please select an option')
      );
      return;
    }
    navigation.navigate('Report', { selectedOption });
  };

  // Manejo del botón de salir
  const handleGoHome = () => {
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/image.png')} style={styles.logo} />
      <Text style={styles.title}>
        {translate('Generar informe', 'Generate Report')}
      </Text>

      <View style={styles.radioContainer}>
        {['Programas', 'Proyectos', 'Beneficiarios'].map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.radioButton,
              selectedOption === option ? styles.radioButtonSelected : null,
            ]}
            onPress={() => setSelectedOption(option)} // Cambiar la opción cuando se presiona el contenedor completo
          >
            <RadioButton
              value={option}
              status={selectedOption === option ? 'checked' : 'unchecked'}
              onPress={() => setSelectedOption(option)} // Cambiar la opción cuando se presiona el RadioButton
              color='#67A6F2' // Color del botón de radio
            />
            <Text
              style={[
                styles.radioText,
                selectedOption === option ? styles.radioTextSelected : null,
              ]}
            >
              {translate(option, option === 'Programas' ? 'Programs' : option === 'Proyectos' ? 'Projects' : 'Beneficiaries')}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.generateButton} onPress={handleGenerateReport}>
        <Text style={styles.generateButtonText}>
          {translate('Generar Informe', 'Generate Report')}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.exitButton} onPress={handleGoHome}>
        <Text style={styles.exitButtonText}>
          {translate('Salir', 'Exit')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default GenerateReport;
