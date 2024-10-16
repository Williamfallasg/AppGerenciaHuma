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
  const [selectedChartType, setSelectedChartType] = useState('bar');
  const [maleCount, setMaleCount] = useState(0); // Contador de masculinos
  const [femaleCount, setFemaleCount] = useState(0); // Contador de femeninos
  const [ageData, setAgeData] = useState([]); // Datos de edades
  const [countryData, setCountryData] = useState({}); // Datos de países
  const [activityData, setActivityData] = useState([]); // Datos de actividades
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

        // Contar usuarios masculinos y femeninos
        const males = usersData.filter(user => user.sex === 'male').length;
        const females = usersData.filter(user => user.sex === 'female').length;

        // Obtener edades, países y actividades
        const ages = usersData.map(user => user.age).filter(age => age); // Filtrar datos sin edad
        const countries = usersData.map(user => user.countries).flat().filter(country => country); // Unir los países
        const activities = usersData.map(user => user.activities?.length || 0); // Obtener actividades por usuario

        // Contar la distribución por países
        const countryCount = countries.reduce((acc, country) => {
          acc[country] = (acc[country] || 0) + 1;
          return acc;
        }, {});

        // Actualizar los estados
        setMaleCount(males);
        setFemaleCount(females);
        setAgeData(ages);
        setCountryData(countryCount);
        setActivityData(activities);

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
      // Datos de Sexo
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
      // Datos de Edad
      labels = ageData.map(age => `Edad ${age}`);
      dataset = ageData;
    } else if (selectedVariable === 'countries') {
      // Datos de País
      labels = Object.keys(countryData);
      dataset = Object.values(countryData);
    } else if (selectedVariable === 'activities') {
      // Datos de Actividades
      labels = activityData.map((_, index) => `Beneficiario ${index + 1}`);
      dataset = activityData;
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
      case 'bar':
        return (
          <BarChart
            data={{
              labels: chartData.labels,
              datasets: chartData.datasets,
            }}
            width={screenWidth - 40}
            height={300}
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
                rotation: 45,
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
      case 'line':
        return (
          <LineChart
            data={{
              labels: chartData.labels,
              datasets: chartData.datasets,
            }}
            width={screenWidth - 40}
            height={300}
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
                fontSize: 10,
                rotation: 30,
                translateX: -5,
              },
              style: {
                borderRadius: 16,
                padding: 10,
                elevation: 5,
              },
              skipXLabels: 4,
            }}
            style={{ marginVertical: 20, borderRadius: 16 }}
            bezier
          />
        );
      case 'pie':
        return (
          <PieChart
            data={chartData.pieData}
            width={screenWidth - 40}
            height={260}
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
        <Picker.Item label={translate('Sexo', 'Sex')} value="sex" />
        <Picker.Item label={translate('Edad', 'Age')} value="age" />
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
