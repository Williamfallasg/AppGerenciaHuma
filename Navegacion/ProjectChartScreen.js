import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/styles';  // Importar los estilos

const ProjectChartScreen = ({ route }) => {
  const navigation = useNavigation();
  const { projectData } = route.params || {};
  const [selectedVariable, setSelectedVariable] = useState('numberOfBeneficiaries');
  const [selectedChartType, setSelectedChartType] = useState('bar');
  const screenWidth = Dimensions.get('window').width;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const sanitizeData = (data) => {
    return data.map(item => ({
      projectName: item.projectName || 'No Name',
      numberOfBeneficiaries: Math.max(0, typeof item.numberOfBeneficiaries === 'number' && !isNaN(item.numberOfBeneficiaries) ? item.numberOfBeneficiaries : 0),
      linkedActivitiesCount: item.activities ? item.activities.length : 0, 
    }));
  };

  const processChartData = () => {
    let labels = [];
    let dataset = [];
    let pieData = [];

    const sanitizedData = sanitizeData(projectData);

    if (selectedVariable === 'numberOfBeneficiaries') {
      labels = sanitizedData.map(item => item.projectName || 'No Name');
      dataset = sanitizedData.map(item => item.numberOfBeneficiaries || 0);

      pieData = sanitizedData.map((item, index) => ({
        name: item.projectName || 'No Name',
        population: item.numberOfBeneficiaries || 0,
        color: `rgba(52, 152, 219, ${0.9 - index * 0.1})`,
        legendFontColor: '#34495e',
        legendFontSize: 14,
      }));
    } else if (selectedVariable === 'linkedActivitiesCount') {
      labels = sanitizedData.map(item => item.projectName || 'No Name');
      dataset = sanitizedData.map(item => item.linkedActivitiesCount || 0);

      pieData = sanitizedData.map((item, index) => ({
        name: item.projectName || 'No Name',
        population: item.linkedActivitiesCount || 0,
        color: `rgba(52, 152, 219, ${0.9 - index * 0.1})`,
        legendFontColor: '#34495e',
        legendFontSize: 14,
      }));
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
            width={screenWidth - 40}
            height={300}
            fromZero={true}
            chartConfig={styles.chartConfig}
            style={styles.chartStyle}
            bezier
          />
        );
      case 'pie':
        return (
          <PieChart
            data={chartData.pieData}
            width={screenWidth - 40}
            height={300}
            chartConfig={styles.pieChartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft={screenWidth > 400 ? '20' : '15'}
            absolute
          />
        );
      case 'bar':
        return (
          <BarChart
            data={{ labels: chartData.labels, datasets: chartData.datasets }}
            width={screenWidth - 40}
            height={300}
            fromZero={true}
            chartConfig={styles.barChartConfig}
            style={styles.chartStyle}
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
      <Text style={styles.title}>
        Distribución de Datos
      </Text>

      <Picker
        selectedValue={selectedVariable}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedVariable(itemValue)}
      >
        <Picker.Item label="Número de Beneficiarios" value="numberOfBeneficiaries" />
        <Picker.Item label="Cantidad de Actividades Vinculadas" value="linkedActivitiesCount" />
      </Picker>

      <Picker
        selectedValue={selectedChartType}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedChartType(itemValue)}
      >
        <Picker.Item label="Gráfico de Barras" value="bar" />
        <Picker.Item label="Gráfico de Tendencia" value="line" />
        <Picker.Item label="Gráfico de Pastel" value="pie" />
      </Picker>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View style={styles.dataContainer}>
          {projectData.length > 0 && renderChart()}
        </View>
      )}

      <TouchableOpacity style={styles.exitButton} onPress={handleGoBack}>
        <Text style={styles.exitButtonText}>
          Salir
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ProjectChartScreen;
