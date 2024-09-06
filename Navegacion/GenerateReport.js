import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, Dimensions } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { useLanguage } from '../context/LanguageContext';
import { useUserRole } from '../context/UserRoleContext';
import styles from '../styles/stylesGenerateReport'; // Importar los estilos desde el archivo separado

const GenerateReport = () => {
  const { language } = useLanguage();
  const { userRole } = useUserRole();
  const [selectedOption, setSelectedOption] = useState('Programas');
  const navigation = useNavigation();

  useEffect(() => {
    if (userRole !== 'admin') {
      Alert.alert(
        language === 'es' ? 'Acceso denegado' : 'Access Denied',
        language === 'es' ? 'No tiene permisos para acceder a esta sección.' : 'You do not have permission to access this section.',
        [{ text: language === 'es' ? 'Aceptar' : 'OK', onPress: () => navigation.navigate('Home') }]
      );
    }
  }, [userRole, navigation, language]);

  if (userRole !== 'admin') {
    return null;
  }

  const handleGenerateReport = () => {
    if (!selectedOption) {
      Alert.alert(
        language === 'es' ? 'Error' : 'Error',
        language === 'es' ? 'Por favor, seleccione una opción' : 'Please select an option'
      );
      return;
    }
    navigation.navigate('Report', { selectedOption });
  };

  const handleGoHome = () => {
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/image.png')} style={styles.logo} />
      <Text style={styles.title}>
        {language === 'es' ? 'Generar informe' : 'Generate Report'}
      </Text>

      <View style={styles.radioContainer}>
        <TouchableOpacity style={styles.radioButton} onPress={() => setSelectedOption('Programas')}>
          <RadioButton value="Programas" status={selectedOption === 'Programas' ? 'checked' : 'unchecked'} />
          <Text style={styles.radioText}>
            {language === 'es' ? 'Programas' : 'Programs'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.radioButton} onPress={() => setSelectedOption('Proyectos')}>
          <RadioButton value="Proyectos" status={selectedOption === 'Proyectos' ? 'checked' : 'unchecked'} />
          <Text style={styles.radioText}>
            {language === 'es' ? 'Proyectos' : 'Projects'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.radioButton} onPress={() => setSelectedOption('Beneficiarios')}>
          <RadioButton value="Beneficiarios" status={selectedOption === 'Beneficiarios' ? 'checked' : 'unchecked'} />
          <Text style={styles.radioText}>
            {language === 'es' ? 'Beneficiarios' : 'Beneficiaries'}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.generateButton} onPress={handleGenerateReport}>
        <Text style={styles.generateButtonText}>
          {language === 'es' ? 'Generar Informe' : 'Generate Report'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.exitButton} onPress={handleGoHome}>
        <Text style={styles.exitButtonText}>
          {language === 'es' ? 'Salir' : 'Exit'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default GenerateReport;
