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
      fontSize: 12,
      translateY: 10,
    },
    propsForHorizontalLabels: {
      fontSize: 12,
      rotation: 45, // Para hacer que las etiquetas estén en diagonal
      translateX: -5,
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
      fontSize: 12,
      rotation: 45, // Rotar etiquetas en diagonal
      translateX: -5,
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
