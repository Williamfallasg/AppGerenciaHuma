import React, { useEffect, useState } from 'react'; // Importar useState y useEffect correctamente
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert, Dimensions } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { useLanguage } from '../context/LanguageContext';
import { useUserRole } from '../context/UserRoleContext'; // Importar el contexto del rol del usuario

const GenerateReport = () => {
  const { language } = useLanguage();
  const { userRole } = useUserRole(); // Obtener el rol del usuario
  const [selectedOption, setSelectedOption] = useState('Programas'); // Usar useState correctamente
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
    return null; // No renderizar nada si el usuario no es admin
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

const Report = ({ route }) => {
  const { language } = useLanguage();
  const { userRole } = useUserRole(); // Obtener el rol del usuario
  const { selectedOption } = route.params;
  const screenWidth = Dimensions.get('window').width;

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
    return null; // No renderizar nada si el usuario no es admin
  }

  const data = {
    labels: language === 'es' 
      ? ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'] 
      : ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // Color del gráfico
      },
    ],
  };

  return (
    <View style={styles.reportContainer}>
      <Text style={styles.reportTitle}>
        {language === 'es' ? `Informe de ${selectedOption}` : `Report of ${selectedOption}`}
      </Text>

      <LineChart
        data={data}
        width={screenWidth - 40}
        height={220}
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
        width={screenWidth - 40}
        height={220}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D3D3D3',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: Dimensions.get('window').width * 0.5,
    height: Dimensions.get('window').width * 0.5,
    marginBottom: 40,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    color: '#000',
  },
  radioContainer: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 10,
    padding: 20,
    marginBottom: 30,
    width: '90%',
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioText: {
    fontSize: 18,
    color: '#000',
  },
  generateButton: {
    backgroundColor: '#67A6F2',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 20,
    width: '90%',
    alignItems: 'center',
  },
  generateButtonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  exitButton: {
    backgroundColor: '#F28C32',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    width: '90%',
    alignItems: 'center',
  },
  exitButtonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  reportContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  reportTitle: {
    fontSize: 22,
    marginBottom: 20,
  },
  chart: {
    marginVertical: 10,
    borderRadius: 16,
  },
});

export default GenerateReport;
export { Report };
