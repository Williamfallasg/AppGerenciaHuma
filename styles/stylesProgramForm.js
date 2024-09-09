import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#D3D3D3', // Fondo gris claro
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  logo: {
    width: width * 0.5, // Tamaño dinámico basado en el ancho de la pantalla
    height: width * 0.5,
    marginBottom: 30,
    resizeMode: 'contain', // Evitar que la imagen se deforme
  },
  input: {
    backgroundColor: 'white', // Fondo blanco para los inputs
    borderRadius: 10, // Bordes redondeados
    padding: 10, // Espaciado interno
    marginBottom: 10, // Espacio entre inputs
    width: '100%', // Ocupa todo el ancho
    height: height * 0.07, // Altura basada en la pantalla
    fontSize: 16, // Tamaño de la fuente
  },
  multilineInput: {
    backgroundColor: 'white', // Igual que los inputs normales
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    width: '100%',
    height: height * 0.1, // Más altura para entradas de múltiples líneas
    textAlignVertical: 'top', // Texto alineado arriba en el input
    fontSize: 16,
  },
  button: {
    backgroundColor: '#67A6F2', // Color azul para los botones de guardar y agregar
    borderRadius: 10,
    paddingVertical: 15, // Espaciado vertical
    paddingHorizontal: 20, // Espaciado horizontal
    marginTop: 20, // Margen superior
    width: '100%', // Ancho completo
    alignItems: 'center', // Alinea el texto al centro
  },
  addButton: {
    backgroundColor: '#67A6F2', // Mismo azul para el botón "Agregar proyecto"
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  button1: {
    backgroundColor: '#F28C32', // Naranja para el botón "Salir"
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttontext1:{
    color: 'black', // Texto blanco en los botones
    fontSize: 18, // Tamaño de texto grande
    textAlign: 'center', // Alineado al centro
    fontWeight:"bold"//negrita al text de los botones
  },
  buttonText: {
    color: 'black', // Texto blanco en los botones
    fontSize: 18, // Tamaño de texto grande
    textAlign: 'center', // Alineado al centro
    fontWeight:"bold"
  },
});
