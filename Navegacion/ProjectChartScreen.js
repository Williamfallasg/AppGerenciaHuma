import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, ScrollView, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

const ProjectChartScreen = ({ route }) => {
  const navigation = useNavigation();
  const { projectData } = route.params || {};
  const [selectedVariable, setSelectedVariable] = useState('numberOfBeneficiaries');
  const [selectedChartType, setSelectedChartType] = useState('bar');
  const screenWidth = Dimensions.get('window').width - 40;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const truncateProjectName = (name) => {
    return name.length > 10 ? name.substring(0, 10) + '...' : name;
  };

  const sanitizeData = (data) => {
    return data.map(item => ({
      projectName: item.projectName ? truncateProjectName(item.projectName) : 'No Name',
      numberOfBeneficiaries: Math.max(0, typeof item.beneficiaryCount === 'number' && !isNaN(item.beneficiaryCount) ? item.beneficiaryCount : 0),
      linkedActivitiesCount: item.activities ? item.activities.split(', ').length : 0, 
      indicatorCount: item.indicators ? item.indicators.split(', ').length : 0,
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
    } else if (selectedVariable === 'indicatorCount') {
      labels = sanitizedData.map(item => item.projectName || 'No Name');
      dataset = sanitizedData.map(item => item.indicatorCount || 0);

      pieData = sanitizedData.map((item, index) => ({
        name: item.projectName || 'No Name',
        population: item.indicatorCount || 0,
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
            width={screenWidth}
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
            width={screenWidth}
            height={250}
            chartConfig={styles.pieChartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft={screenWidth > 400 ? '10' : '5'}
            absolute
          />
        );
      case 'bar':
        return (
          <BarChart
            data={{ labels: chartData.labels, datasets: chartData.datasets }}
            width={screenWidth}
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
        {selectedVariable === 'numberOfBeneficiaries'
          ? 'Número de Beneficiarios'
          : selectedVariable === 'linkedActivitiesCount'
          ? 'Cantidad de Actividades Vinculadas'
          : 'Cantidad de Indicadores'}
      </Text>

      <Picker
        selectedValue={selectedVariable}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedVariable(itemValue)}
      >
        <Picker.Item label="Número de Beneficiarios" value="numberOfBeneficiaries" />
        <Picker.Item label="Cantidad de Actividades Vinculadas" value="linkedActivitiesCount" />
        <Picker.Item label="Cantidad de Indicadores" value="indicatorCount" />
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

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginTop: 50,
    marginBottom: 20,
  },
  picker: {
    height: 40,
    width: '100%',
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    elevation: 2,
  },
  dataContainer: {
    marginTop: 10,
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 15,
    width: '100%',
  },
  chartStyle: {
    marginVertical: 10,
    borderRadius: 16,
    padding: 15,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  chartConfig: {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ecf0f1',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(52, 73, 94, ${opacity})`,
  },
  barChartConfig: {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ecf0f1',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(52, 73, 94, ${opacity})`,
    barPercentage: 0.7,
    propsForHorizontalLabels: {
      fontSize: 10,
      rotation: 30, // Rotate labels slightly for readability
      translateX: -10,
    },
  },
  pieChartConfig: {
    color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`,
    legendFontColor: '#34495e',
    legendFontSize: 12,
  },
  exitButton: {
    backgroundColor: '#F28C32',
    borderRadius: 10,
    paddingVertical: 15,
    width: '95%',
    alignItems: 'center',
  },
  exitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ProjectChartScreen;
