import React, { useEffect, useState } from 'react'; // Asegúrate de importar useState
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../context/LanguageContext';
import { useUserRole } from '../context/UserRoleContext'; // Importar el contexto del rol del usuario

const Report = ({ route }) => {
  const navigation = useNavigation();
  const { language } = useLanguage(); 
  const { userRole } = useUserRole(); // Obtener el rol del usuario
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
    return null; // No renderizar nada si el usuario no es admin
  }

  const [variables, setVariables] = useState(selectedVariables && selectedVariables.length > 0 ? selectedVariables : ['Variable 1']);

  const screenWidth = Dimensions.get('window').width;

  const datasets = variables.map((variable) => ({
    data: [Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100],
    color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // Color del gráfico
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
        width={screenWidth - 60} // Ajuste de ancho del gráfico
        height={200} // Ajuste de altura del gráfico
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
        width={screenWidth - 60} // Ajuste de ancho del gráfico
        height={200} // Ajuste de altura del gráfico
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

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15, // Ajuste del padding general
  },
  title: {
    fontSize: 22, // Ajuste de tamaño de fuente
    marginBottom: 15, // Ajuste del margen inferior
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16, // Ajuste de tamaño de fuente
    marginBottom: 10,
    textAlign: 'center',
  },
  variablesContainer: {
    width: '100%',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
    color: '#000',
    textAlign: 'center',
  },
  variableButton: {
    backgroundColor: '#ccc',
    borderRadius: 5,
    padding: 8, // Ajuste del padding del botón
    marginBottom: 8,
    alignItems: 'center', // Centrar el texto
  },
  variableButtonText: {
    fontSize: 14, // Ajuste de tamaño de fuente
    color: '#000',
  },
  chart: {
    marginVertical: 8, // Ajuste del margen vertical
    borderRadius: 16,
  },
  exitButton: {
    backgroundColor: '#F28C32',
    borderRadius: 10,
    paddingVertical: 12, // Ajuste del padding vertical
    paddingHorizontal: 20,
    marginTop: 20,
    width: '80%', // Ajuste del ancho del botón
    alignItems: 'center',
  },
  exitButtonText: {
    color: 'white',
    fontSize: 16, // Ajuste de tamaño de fuente
    textAlign: 'center',
  },
});

export default Report;
