const styles = {
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginTop: 20,
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
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  dataContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    width: '100%',
    alignItems: 'center',
  },
  chartStyle: {
    marginVertical: 10,
    borderRadius: 16,
    padding: 5,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  chartConfig: {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ecf0f1',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(52, 73, 94, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForVerticalLabels: {
      fontSize: 10,
      translateY: 10,
    },
    propsForHorizontalLabels: {
      fontSize: 10,
      rotation: 90, // Incrementar la rotación a 90 grados para una legibilidad máxima
      translateX: -10, // Ajustar la posición de las etiquetas para evitar que se corten
    },
    propsForDots: {
      r: '4',
    },
    skipXLabels: 0, // Mostrar todas las etiquetas
  },
  pieChartConfig: {
    color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`,
    legendFontColor: '#34495e',
    legendFontSize: 12,
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
      rotation: 90, // Rotar etiquetas a 90 grados para evitar solapamientos
      translateX: -10, // Ajustar la posición de las etiquetas para mejor presentación
    },
    propsForVerticalLabels: {
      fontSize: 10,
    },
  },
  exitButton: {
    backgroundColor: '#F28C32',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  exitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
};

export default styles;
