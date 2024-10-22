import React, { useState } from 'react';
import { View, Text, Dimensions, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { BarChart, LineChart, PieChart } from 'react-native-chart-kit';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import styles from '../styles/stylesReport'; // Asegúrate de tener tus estilos

const ProgramChartScreen = ({ route }) => {
  const navigation = useNavigation();
  const { programData } = route.params || {}; // Recibimos los datos del programa como parámetro

  const [selectedVariable, setSelectedVariable] = useState('numberOfBeneficiaries');
  const [selectedChartType, setSelectedChartType] = useState('bar');
  const screenWidth = Dimensions.get('window').width;

  // Procesar los datos según la variable seleccionada
  const processChartData = () => {
    let labels = [];
    let dataset = [];

    if (selectedVariable === 'numberOfBeneficiaries') {
      labels = programData.map(item => item.programName || 'Nombre no disponible'); // Usamos el nombre del programa
      dataset = programData.map(item => item.numberOfBeneficiaries || 0); // Beneficiarios en cada programa
    } else if (selectedVariable === 'fulfilledIndicators') {
      labels = programData.map(item => item.programName || 'Nombre no disponible'); // Usamos el nombre del programa
      dataset = programData.map(item => item.fulfilledIndicators || 0); // Indicadores cumplidos
    }

    return {
      labels,
      datasets: [{ data: dataset }],
    };
  };

  // Renderizar el gráfico según el tipo seleccionado
  const renderChart = () => {
    const chartData = processChartData();

    switch (selectedChartType) {
      case 'bar':
        return (
          <BarChart
            data={{ labels: chartData.labels, datasets: chartData.datasets }}
            width={screenWidth - 60}
            height={250}
            fromZero={true}
            yAxisInterval={2}  // Ajustar el intervalo del eje Y
            chartConfig={{
              backgroundColor: '#e3f2fd',
              backgroundGradientFrom: '#e3f2fd',
              backgroundGradientTo: '#e1f5fe',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              barPercentage: 0.7,
              propsForVerticalLabels: {
                fontSize: 10,  // Ajustar el tamaño de las etiquetas
                rotation: 45,  // Rotar las etiquetas del eje X para mejor legibilidad
                translateY: 10,  // Mover ligeramente hacia abajo las etiquetas
              },
              propsForHorizontalLabels: {
                fontSize: 12,  // Ajustar el tamaño de las etiquetas del eje Y
              },
            }}
            style={{ marginVertical: 10, borderRadius: 16 }}
          />
        );
      case 'line':
        return (
          <LineChart
            data={{ labels: chartData.labels, datasets: chartData.datasets }}
            width={screenWidth - 60}
            height={250}
            fromZero={true}
            yAxisInterval={2}  // Ajustar el intervalo del eje Y
            chartConfig={{
              backgroundColor: '#f5f5f5',
              backgroundGradientFrom: '#e3f2fd',
              backgroundGradientTo: '#e1f5fe',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              propsForVerticalLabels: {
                fontSize: 10,  // Ajustar el tamaño de las etiquetas
                rotation: 45,  // Rotar las etiquetas del eje X para mejor legibilidad
                translateY: 10,  // Mover ligeramente hacia abajo las etiquetas
              },
            }}
            style={{ marginVertical: 20, borderRadius: 16 }}
            bezier
          />
        );
      case 'pie':
        return (
          <PieChart
            data={chartData.datasets[0].data.map((value, index) => ({
              name: chartData.labels[index], // Usamos el nombre del programa en lugar de Programa 1, Programa 2...
              population: value,
              color: `rgba(33, 150, 243, ${0.8 - index * 0.1})`,
              legendFontColor: '#7F7F7F',
              legendFontSize: 10, // Reducimos el tamaño de la leyenda para mejor legibilidad
            }))}
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

  const handleGoBack = () => {
    navigation.goBack(); // Regresa a la pantalla anterior
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Gráfico de Programas</Text>

      {/* Selector para elegir qué variable graficar */}
      <Picker
        selectedValue={selectedVariable}
        style={{ height: 50, width: Dimensions.get('window').width * 0.8, marginBottom: 20, alignSelf: 'center' }}
        onValueChange={(itemValue) => setSelectedVariable(itemValue)}
      >
        <Picker.Item label="Número de Beneficiarios" value="numberOfBeneficiaries" />
        <Picker.Item label="Indicadores Cumplidos" value="fulfilledIndicators" />
      </Picker>

      {/* Selector para elegir el tipo de gráfico */}
      <Picker
        selectedValue={selectedChartType}
        style={{ height: 50, width: Dimensions.get('window').width * 0.8, marginBottom: 20, alignSelf: 'center' }}
        onValueChange={(itemValue) => setSelectedChartType(itemValue)}
      >
        <Picker.Item label="Gráfico de Barras" value="bar" />
        <Picker.Item label="Gráfico de Tendencia" value="line" />
        <Picker.Item label="Gráfico de Pastel" value="pie" />
      </Picker>

      {programData.length === 0 ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View style={styles.dataContainer}>{renderChart()}</View>
      )}

      <TouchableOpacity style={styles.exitButton} onPress={handleGoBack}>
        <Text style={styles.exitButtonText}>Salir</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ProgramChartScreen;
