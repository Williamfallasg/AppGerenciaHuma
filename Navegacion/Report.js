// Report.js
import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../context/LanguageContext';
import { useUserRole } from '../context/UserRoleContext';
import styles from '../styles/stylesReport'; // Importamos el archivo de estilos

const Report = ({ route }) => {
  const navigation = useNavigation();
  const { language } = useLanguage(); 
  const { userRole } = useUserRole(); 
  const { projectName, selectedVariables } = route.params || {};

  useEffect(() => {
    if (userRole !== 'admin') {
      Alert.alert(
        language === 'es' ? 'Acceso denegado' : 'Access Denied',
        language === 'es' ? 'No tiene permisos para acceder a esta sección.' : 'You do not have permission to access this section.',
        [{ text: language === 'es' ? 'Aceptar' : 'OK', onPress: () => navigation.goBack() }]
      );
    }
  }, [userRole, navigation, language]);

  if (userRole !== 'admin') {
    return null; 
  }

  const [variables, setVariables] = useState(selectedVariables && selectedVariables.length > 0 ? selectedVariables : ['Variable 1']);

  const screenWidth = Dimensions.get('window').width;

  const datasets = variables.map((variable) => ({
    data: [Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100],
    color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
    label: variable,
  }));

  const data = {
    labels: language === 'es' 
      ? ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'] 
      : ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: datasets.length > 0 ? datasets : [{ data: [0, 0, 0, 0, 0, 0], color: () => 'rgba(0, 0, 0, 1)', label: 'No Data' }],
  };

  const toggleVariableSelection = (variable) => {
    if (variables.includes(variable)) {
      setVariables(variables.filter(item => item !== variable));
    } else {
      setVariables([...variables, variable]);
    }
  };

  const handleGoBack = () => {
    navigation.navigate('GenerateReport');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        {language === 'es' ? 'Informe del Proyecto' : 'Project Report'}
      </Text>
      <Text style={styles.subtitle}>
        {language === 'es' ? 'Proyecto:' : 'Project:'} {projectName}
      </Text>
      <Text style={styles.subtitle}>
        {language === 'es' ? 'Variables Seleccionadas:' : 'Selected Variables:'} {variables.join(', ')}
      </Text>

      <View style={styles.variablesContainer}>
        <Text style={styles.sectionTitle}>
          {language === 'es' ? 'Seleccionar variables para el gráfico:' : 'Select variables for the chart:'}
        </Text>
        <TouchableOpacity style={styles.variableButton} onPress={() => toggleVariableSelection('Variable 1')}>
          <Text style={styles.variableButtonText}>
            {variables.includes('Variable 1') ? '✓' : ''} {language === 'es' ? 'Variable 1' : 'Variable 1'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.variableButton} onPress={() => toggleVariableSelection('Variable 2')}>
          <Text style={styles.variableButtonText}>
            {variables.includes('Variable 2') ? '✓' : ''} {language === 'es' ? 'Variable 2' : 'Variable 2'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.variableButton} onPress={() => toggleVariableSelection('Variable 3')}>
          <Text style={styles.variableButtonText}>
            {variables.includes('Variable 3') ? '✓' : ''} {language === 'es' ? 'Variable 3' : 'Variable 3'}
          </Text>
        </TouchableOpacity>
      </View>

      <LineChart
        data={data}
        width={screenWidth - 60} 
        height={200}
        chartConfig={{
          backgroundColor: '#e26a00',
          backgroundGradientFrom: '#fb8c00',
          backgroundGradientTo: '#ffa726',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        style={styles.chart}
      />

      <BarChart
        data={data}
        width={screenWidth - 60} 
        height={200} 
        chartConfig={{
          backgroundColor: '#022173',
          backgroundGradientFrom: '#1e3c72',
          backgroundGradientTo: '#2a5298',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        style={styles.chart}
      />

      <TouchableOpacity style={styles.exitButton} onPress={handleGoBack}>
        <Text style={styles.exitButtonText}>
          {language === 'es' ? 'Salir' : 'Exit'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Report;
