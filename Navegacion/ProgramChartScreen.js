import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { Picker } from '@react-native-picker/picker';
import styles from '../styles/stylesReport';
import { useNavigation } from '@react-navigation/native';

const ProgramChartScreen = ({ route }) => {
  const navigation = useNavigation();
  const { programData } = route.params || {}; // Recibimos los datos de programas desde Report

  const [selectedVariable, setSelectedVariable] = useState('projectCount'); // Se selecciona por defecto la cantidad de proyectos vinculados
  const [selectedChartType, setSelectedChartType] = useState('bar'); // Por defecto gráfico de barras
  const screenWidth = Dimensions.get('window').width;

  // Procesar los datos según la variable seleccionada
  const processChartData = () => {
    let labels = [];
    let dataset = [];
    let pieData = [];

    // Proceso para obtener el número de proyectos vinculados por programa
    if (selectedVariable === 'projectCount') {
      labels = programData.map(item => item.programName || 'Sin Nombre');
      dataset = programData.map(item => (item.projects ? item.projects.length : 0)); // Contamos el número de proyectos vinculados

      pieData = programData.map((item, index) => ({
        name: item.programName || 'Sin Nombre',
        population: item.projects ? item.projects.length : 0,
        color: `rgba(33, 150, 243, ${0.8 - index * 0.1})`,
        legendFontColor: '#7F7F7F',
        legendFontSize: 14,
      }));
    } else if (selectedVariable === 'countryCount') {
      // Proceso para obtener el número de países en cada programa
      labels = programData.map(item => item.programName || 'Sin Nombre');
      dataset = programData.map(item => (item.selectedCountries ? Object.values(item.selectedCountries).flat().length : 0)); // Contamos el número de países

      pieData = programData.map((item, index) => ({
        name: item.programName || 'Sin Nombre',
        population: item.selectedCountries ? Object.values(item.selectedCountries).flat().length : 0,
        color: `rgba(33, 150, 243, ${0.8 - index * 0.1})`,
        legendFontColor: '#7F7F7F',
        legendFontSize: 14,
      }));
    }

    return {
      labels,
      datasets: [{ data: dataset }],
      pieData,
    };
  };

  // Renderizar el gráfico según el tipo seleccionado
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
            width={screenWidth - 40}  // Ajuste dinámico de ancho
            height={300}
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
              propsForVerticalLabels: {
                fontSize: 12,
                translateY: 15,
              },
              propsForHorizontalLabels: {
                fontSize: 10,
                rotation: 90,  // Etiquetas rotadas 90 grados para mostrarlas en vertical
                translateX: -10,  // Ajuste para mejor separación
              },
              skipXLabels: 2, // Mostrar solo cada tercera etiqueta para evitar solapamiento
            }}
            style={{ marginVertical: 20, borderRadius: 16 }}
            bezier
          />
        );
      case 'pie':
        return (
          <PieChart
            data={chartData.pieData}
            width={screenWidth - 40}  // Ajuste dinámico de ancho
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
            width={screenWidth - 40}  // Ajuste dinámico de ancho
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
                rotation: 90,  // Etiquetas rotadas para mostrar los países verticalmente
                translateX: -15,  // Ajuste adicional
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={[styles.title, { fontSize: 24, marginVertical: 15 }]}>
        Distribución de Proyectos Vinculados por Programa
      </Text>

      {/* Selector para elegir qué variable graficar */}
      <Picker
        selectedValue={selectedVariable}
        style={{ height: 50, width: screenWidth * 0.8, marginBottom: 20, alignSelf: 'center' }}
        onValueChange={(itemValue) => setSelectedVariable(itemValue)}
      >
        <Picker.Item label="Cantidad de Proyectos Vinculados" value="projectCount" />
        <Picker.Item label="Cantidad de Países" value="countryCount" />
      </Picker>

      {/* Selector para elegir el tipo de gráfico */}
      <Picker
        selectedValue={selectedChartType}
        style={{ height: 50, width: screenWidth * 0.8, marginBottom: 20, alignSelf: 'center' }}
        onValueChange={(itemValue) => setSelectedChartType(itemValue)}
      >
        <Picker.Item label="Gráfico de Barras" value="bar" />
        <Picker.Item label="Gráfico de Tendencia" value="line" />
        <Picker.Item label="Gráfico de Pastel" value="pie" />
      </Picker>

      {programData.length === 0 ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View style={styles.dataContainer}>
          {renderChart()}
        </View>
      )}

      <TouchableOpacity style={[styles.exitButton, { backgroundColor: '#FF8C00', borderRadius: 20, paddingVertical: 15, marginTop: 20 }]} onPress={() => navigation.goBack()}>
        <Text style={[styles.exitButtonText, { fontSize: 16, color: '#fff', fontWeight: 'bold' }]}>
          Salir
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ProgramChartScreen;
