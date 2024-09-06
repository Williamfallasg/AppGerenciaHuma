import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D3D3D3',
    alignItems: 'center',
    justifyContent: 'center',
    padding: width > 600 ? 20 : 10, // Ajuste dinámico del padding para pantallas más grandes
  },
  logo: {
    width: width * 0.5,
    height: undefined,
    aspectRatio: 1, // Mantiene la proporción original de la imagen
    marginBottom: height * 0.05,
  },
  mainButton: {
    backgroundColor: '#67A6F2',
    borderRadius: 10,
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.1,
    marginBottom: height * 0.02,
    width: width > 600 ? '60%' : '80%', // Ajuste dinámico del ancho del botón para pantallas más grandes
    alignItems: 'center',
  },
  mainButtonText: {
    color: 'black',
    fontSize: width > 600 ? 20 : width * 0.05, // Ajuste dinámico del tamaño de la fuente
    textAlign: 'center',
  },
  exitButton: {
    backgroundColor: '#F28C32',
    borderRadius: 10,
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.1,
    marginTop: height * 0.03,
    width: width > 600 ? '60%' : '80%', // Ajuste dinámico del ancho del botón para pantallas más grandes
    alignItems: 'center',
  },
  exitButtonText: {
    color: 'white',
    fontSize: width > 600 ? 20 : width * 0.05, // Ajuste dinámico del tamaño de la fuente
    textAlign: 'center',
  },
});
