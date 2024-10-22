import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';
import styles from '../styles/stylesReport';

const ProjectChartScreen = ({ route }) => {
  const navigation = useNavigation();
  const { projectData } = route.params || {};
  const [chartData, setChartData] = useState(null);

  // Función para filtrar valores no válidos
  const sanitizeData = (data) => {
    return data.map(item => ({
      projectName: item.projectName || 'No Name',
      numberOfBeneficiaries: typeof item.numberOfBeneficiaries === 'number' && !isNaN(item.numberOfBeneficiaries)
        ? item.numberOfBeneficiaries
        : 0 // Asignar 0 si no es un número válido
    }));
  };

  useEffect(() => {
    if (projectData) {
      // Filtrar datos para eliminar valores no válidos
      const sanitizedData = sanitizeData(projectData);

      // Procesar los datos para el gráfico
      const formattedData = {
        labels: sanitizedData.map((item) => item.projectName), // Nombres de proyectos
        datasets: [
          {
            data: sanitizedData.map((item) => item.numberOfBeneficiaries), // Número de beneficiarios por proyecto
            strokeWidth: 2, // Ancho de la línea del gráfico
          },
        ],
      };
      setChartData(formattedData);
    }
  }, [projectData]);

  const handleGoBack = () => {
    navigation.navigate('GenerateReport'); // Volver a la pantalla de Generar Informe
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gráfico del Proyecto</Text>

      {chartData ? (
        <LineChart
          data={chartData}
          width={Dimensions.get('window').width - 16} // Ancho del gráfico
          height={220}
          yAxisLabel=""
          chartConfig={{
            backgroundColor: '#e26a00',
            backgroundGradientFrom: '#fb8c00',
            backgroundGradientTo: '#ffa726',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#ffa726',
            },
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      ) : (
        <Text>No hay datos para mostrar</Text>
      )}

      <TouchableOpacity style={styles.exitButton} onPress={handleGoBack}>
        <Text style={styles.exitButtonText}>Salir</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProjectChartScreen;
