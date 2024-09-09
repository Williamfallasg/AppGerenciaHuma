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
    height: height * 0.07, // Altura dinámica basada en la pantalla
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
    backgroundColor: '#67A6F2', // Azul claro para los botones
    borderRadius: 10,
    paddingVertical: 10, // Espaciado vertical
    paddingHorizontal: 10, // Espaciado horizontal
    marginTop: 10, // Margen superior
    width: '100%', // Ancho completo
    alignItems: 'center', // Alinea el texto al centro
  },
  buttonText: {
    color: 'black', // Texto blanco en los botones
    fontSize: 18, // Tamaño de texto grande
    textAlign: 'center', // Alineado al centro
    fontWeight: "bold"
  },
  exitButton: {
    backgroundColor: '#F28C32', // Naranja para el botón "Salir"
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  activityContainer: {
    flexDirection: 'row', // Alinear elementos en fila
    alignItems: 'center',
    marginBottom: 10, // Espacio entre actividades
    width: '100%',
  },
  activityInput: {
    flex: 1, // Ocupa todo el espacio disponible
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
  },
  iconButton: {
    marginLeft: 20, // Separar los íconos de los inputs
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
    textAlign: 'center', // Título centrado para las secciones
  },
  // Estilos para Indicadores
  indicatorContainer: {
    flexDirection: 'row', // Los indicadores van en filas para los iconos
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
  },
  indicatorInput: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10, // Espacio entre el input y el siguiente
    fontSize: 16,
  },
  beneficiariesInput: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10, // Espacio para el número de beneficiarios
    fontSize: 16,
  },
});
