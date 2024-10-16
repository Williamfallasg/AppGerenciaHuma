import React, { useEffect, useState } from 'react'; 
import { View, Text, Dimensions, ScrollView, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../context/LanguageContext';
import { useUserRole } from '../context/UserRoleContext';
import { firestore } from '../firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
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
  const [selectedVariable, setSelectedVariable] = useState('sex');
  const [selectedChartType, setSelectedChartType] = useState('line');
  const screenWidth = Dimensions.get('window').width;

  const translate = (textEs, textEn) => (language === 'es' ? textEs : textEn);

  useEffect(() => {
    fetchData();
  }, [userRole]);

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

  const processChartData = () => {
    let labels = [];
    let dataset = [];
    let pieData = [];

    if (selectedVariable === 'sex') {
      const maleCount = data.filter(item => item.sex === 'male').length;
      const femaleCount = data.filter(item => item.sex === 'female').length;

      labels = ['Masculino', 'Femenino'];
      dataset = [maleCount, femaleCount];

      pieData = [
        {
          name: 'Masculino',
          population: maleCount,
          color: 'rgba(33, 150, 243, 0.8)',
          legendFontColor: '#7F7F7F',
          legendFontSize: 12
        },
        {
          name: 'Femenino',
          population: femaleCount,
          color: 'rgba(244, 67, 54, 0.8)',
          legendFontColor: '#7F7F7F',
          legendFontSize: 12
        }
      ];
    } else if (selectedVariable === 'age') {
      const ageDistribution = data.filter(item => item.age !== undefined).map(item => item.age);
      labels = ageDistribution.map(age => `Edad ${age}`);
      dataset = ageDistribution;
      pieData = ageDistribution.map((age, index) => ({
        name: `Edad ${age}`,
        population: age,
        color: `rgba(33, 150, 243, ${0.8 - index * 0.1})`,
        legendFontColor: '#7F7F7F',
        legendFontSize: 12
      }));
    } else if (selectedVariable === 'countries') {
      const countryDistribution = data
        .filter(item => item.countries && item.countries.length > 0)
        .map(item => item.countries.join(', '));
      labels = countryDistribution.map(country => `País: ${country}`);
      dataset = countryDistribution.map(() => 1);
    } else if (selectedVariable === 'activities') {
      const activityDistribution = data
        .filter(item => item.activities && item.activities.length > 0)
        .map(item => item.activities.length);
      labels = activityDistribution.map((_, index) => `Beneficiario ${index + 1}`);
      dataset = activityDistribution;
    }

    return {
      labels,
      datasets: [{ data: dataset }],
      pieData,
    };
  };

  const renderChart = () => {
    const chartData = processChartData();

    switch (selectedChartType) {
      case 'line':
        return (
          <LineChart
            data={{
              labels: chartData.labels,
              datasets: chartData.datasets,
            }}
            width={screenWidth - 40} // Ajuste dinámico de ancho
            height={300}  // Altura aumentada para mejor legibilidad
            fromZero={true}
            chartConfig={{
              backgroundColor: '#f5f5f5',
              backgroundGradientFrom: '#e3f2fd',
              backgroundGradientTo: '#e1f5fe',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              propsForVerticalLabels: {
                fontSize: 12,
                translateY: 15,
              },
              propsForHorizontalLabels: {
                fontSize: 10, // Reducir tamaño de letra para más espacio
                rotation: 60,  // Rotación mayor para evitar solapamiento
                translateX: -20,  // Ajuste para mejor separación de etiquetas
              },
              style: {
                borderRadius: 16,
                padding: 10,
                elevation: 5,
              },
              skipXLabels: 2,  // Mostrar solo cada tercera etiqueta
            }}
            style={{ marginVertical: 20, borderRadius: 16 }}
            bezier
          />
        );
      case 'pie':
        return (
          <PieChart
            data={chartData.pieData}
            width={screenWidth - 40} // Ajuste dinámico de ancho
            height={260}  // Altura ajustada
            chartConfig={{
              color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        );
      case 'bar':
        return (
          <BarChart
            data={{ labels: chartData.labels, datasets: chartData.datasets }}
            width={screenWidth - 40} // Ajuste dinámico de ancho
            height={300}  // Altura aumentada
            fromZero={true}
            chartConfig={{
              backgroundColor: '#e3f2fd',
              backgroundGradientFrom: '#e3f2fd',
              backgroundGradientTo: '#e1f5fe',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              barPercentage: 0.7,
              propsForVerticalLabels: {
                fontSize: 12,
                rotation: 45,  // Rotación para evitar superposición
                translateY: 15,
              },
              propsForHorizontalLabels: {
                fontSize: 12,
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
      default:
        return null;
    }
  };

  const handleGoBack = () => {
    navigation.navigate('GenerateReport');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={[styles.title, { fontSize: 24, marginVertical: 15 }]}>
        {translate('Distribución de Datos', 'Data Distribution')}
      </Text>

      <Picker
        selectedValue={selectedVariable}
        style={{ height: 50, width: screenWidth * 0.8, marginBottom: 20, alignSelf: 'center' }}
        onValueChange={(itemValue) => setSelectedVariable(itemValue)}
      >
        <Picker.Item label={translate('Edad', 'Age')} value="age" />
        <Picker.Item label={translate('Sexo', 'Sex')} value="sex" />
        <Picker.Item label={translate('País', 'Country')} value="countries" />
        <Picker.Item label={translate('Actividades', 'Activities')} value="activities" />
      </Picker>

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

      <TouchableOpacity style={[styles.exitButton, { backgroundColor: '#FF8C00', borderRadius: 20, paddingVertical: 15, marginTop: 20 }]} onPress={handleGoBack}>
        <Text style={[styles.exitButtonText, { fontSize: 16, color: '#fff', fontWeight: 'bold' }]}>
          {translate('Salir', 'Exit')}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ChartScreen;
