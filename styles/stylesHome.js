import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F3F3', // Fondo claro profesional
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: width * 0.6, // Ajustar tamaño de logotipo al 60% del ancho de pantalla
    height: width * 0.6,
    resizeMode: 'contain',
    marginBottom: 40, // Espaciado entre logo y botones
  },
  mainButton: {
    backgroundColor: '#67A6F2', // Color azul profesional
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginVertical: 10, // Espaciado vertical entre los botones
    width: '100%', // Ancho del botón ajustado al 80% del ancho de la pantalla
    alignItems: 'center',
  },
  mainButtonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  exitButton: {
    backgroundColor: '#F28C32', // Color naranja para el botón de salir
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginTop: 20, // Más espaciado superior para el botón de salir
    width: '100%', // Ancho del botón ajustado al 80% del ancho de la pantalla
    alignItems: 'center',
  },
  exitButtonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
