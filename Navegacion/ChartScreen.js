import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, ScrollView, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../context/LanguageContext';
import { useUserRole } from '../context/UserRoleContext';
import { firestore } from '../firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { BarChart, LineChart, PieChart } from 'react-native-chart-kit';
import styles from '../styles/stylesReport';
import { Picker } from '@react-native-picker/picker';

const ChartScreen = ({ route }) => {
  const navigation = useNavigation();
  const { language } = useLanguage();
  const { userRole } = useUserRole();
  const { selectedOption } = route.params || {};

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [itemCount, setItemCount] = useState(0);
  const [selectedVariable, setSelectedVariable] = useState('age'); // Variable seleccionada
  const [selectedChartType, setSelectedChartType] = useState('bar'); // Tipo de gráfico seleccionado
  const screenWidth = Dimensions.get('window').width;

  // Función de traducción
  const translate = (textEs, textEn) => (language === 'es' ? textEs : textEn);

  useEffect(() => {
    fetchData();
  }, [userRole]);

  // Obtener datos de Firestore
  const fetchData = async () => {
    setLoading(true);
    try {
      if (selectedOption === 'Beneficiarios') {
        const querySnapshot = await getDocs(collection(firestore, 'users'));
        setItemCount(querySnapshot.size);

        const usersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setData(usersData);
      }
    } catch (error) {
      Alert.alert('Error', `Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Procesar datos según la variable seleccionada
  const processChartData = () => {
    let labels = [];
    let dataset = [];
    let pieData = [];

    if (selectedVariable === 'age') {
      const ageDistribution = data.filter(item => item.age).map(item => item.age);
      labels = ageDistribution.map((age) => `Edad ${age}`);
      dataset = ageDistribution;
      pieData = ageDistribution.map((age, index) => ({
        name: `Edad ${age}`,
        population: age,
        color: `rgba(33, 150, 243, ${0.8 - index * 0.1})`, // Degradado de colores para pastel
        legendFontColor: '#7F7F7F',
        legendFontSize: 12
      }));
    } else if (selectedVariable === 'countries') {
      const countryDistribution = data.filter(item => item.countries).map(item => item.countries.join(', '));
      labels = countryDistribution.map((country) => `País: ${country}`);
      dataset = countryDistribution.map(() => 1); // Para mostrar cuántas veces aparece cada país
    } else if (selectedVariable === 'activities') {
      const activityDistribution = data.filter(item => item.activities).map(item => item.activities.length);
      labels = activityDistribution.map((_, index) => `Beneficiario ${index + 1}`);
      dataset = activityDistribution;
    }

    return {
      labels,
      datasets: [{ data: dataset }],
      pieData,
    };
  };

  // Función para mostrar el gráfico según el tipo seleccionado
  const renderChart = () => {
    const chartData = processChartData();

    switch (selectedChartType) {
      case 'bar':
        return (
          <BarChart
            data={{ labels: chartData.labels, datasets: chartData.datasets }}
            width={screenWidth - 40}
            height={320}
            fromZero={true}
            chartConfig={{
              backgroundColor: '#e3f2fd',
              backgroundGradientFrom: '#e3f2fd',
              backgroundGradientTo: '#e1f5fe',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              barPercentage: 0.7, // Ajusta el ancho de las barras para mayor separación
              propsForVerticalLabels: {
                fontSize: 12, // Reducir el tamaño de las etiquetas para evitar el solapamiento
                rotation: 45, // Rotar las etiquetas del eje X 45 grados
                translateY: 10, // Mover ligeramente las etiquetas hacia abajo
              },
              style: {
                borderRadius: 16,
                padding: 10,
                elevation: 5,
              },
            }}
            style={{ marginVertical: 20, borderRadius: 16 }}
          />
        );
      case 'line':
        return (
          <LineChart
            data={{ labels: chartData.labels, datasets: chartData.datasets }}
            width={screenWidth - 40}
            height={320}
            fromZero={true}
            chartConfig={{
              backgroundColor: '#f5f5f5',
              backgroundGradientFrom: '#e3f2fd',
              backgroundGradientTo: '#e1f5fe',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
                padding: 10,
                elevation: 5,
              },
            }}
            style={{ marginVertical: 20, borderRadius: 16 }}
            bezier // Añadir curva para un gráfico de tendencia suave
          />
        );
      case 'pie':
        return (
          <PieChart
            data={chartData.pieData}
            width={screenWidth - 40}
            height={220}
            chartConfig={{
              color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        );
      default:
        return null;
    }
  };

  // Botón para salir y regresar a la pantalla de GenerateReport
  const handleGoBack = () => {
    navigation.navigate('GenerateReport');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        {translate('Distribución de Datos', 'Data Distribution')}
      </Text>

      {/* Selector para elegir qué variable graficar */}
      <Picker
        selectedValue={selectedVariable}
        style={{ height: 50, width: screenWidth * 0.8, marginBottom: 20, alignSelf: 'center' }}
        onValueChange={(itemValue) => setSelectedVariable(itemValue)}
      >
        <Picker.Item label={translate('Edad', 'Age')} value="age" />
        <Picker.Item label={translate('País', 'Country')} value="countries" />
        <Picker.Item label={translate('Actividades', 'Activities')} value="activities" />
      </Picker>

      {/* Selector para elegir el tipo de gráfico */}
      <Picker
        selectedValue={selectedChartType}
        style={{ height: 50, width: screenWidth * 0.8, marginBottom: 20, alignSelf: 'center' }}
        onValueChange={(itemValue) => setSelectedChartType(itemValue)}
      >
        <Picker.Item label={translate('Gráfico de Barras', 'Bar Chart')} value="bar" />
        <Picker.Item label={translate('Gráfico de Tendencia', 'Line Chart')} value="line" />
        <Picker.Item label={translate('Gráfico de Pastel', 'Pie Chart')} value="pie" />
      </Picker>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View style={styles.dataContainer}>
          {data.length > 0 && renderChart()}
        </View>
      )}

      {/* Botón para regresar */}
      <TouchableOpacity style={styles.exitButton} onPress={handleGoBack}>
        <Text style={styles.exitButtonText}>
          {translate('Salir', 'Exit')}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ChartScreen;
