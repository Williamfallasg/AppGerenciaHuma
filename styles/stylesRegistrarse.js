import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: height * 0.02, // Espaciado dinámico
    paddingHorizontal: width * 0.05, // Espaciado horizontal para alinear con bordes
  },
  container: {
    flex: 1,
    backgroundColor: '#F3F3F3', // Fondo claro más neutral y profesional
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: height * 0.01, // Espaciado dinámico alrededor del logo
  },
  logo: {
    width: width * 0.5, // Tamaño del logo ajustado dinámicamente
    height: width * 0.5, // Mantiene la proporción
    resizeMode: 'contain', // No deformar el logo
  },
  title: {
    fontSize: 26, // Título grande para destacar
    fontWeight: 'bold',
    color: '#333', // Texto oscuro para buen contraste
    marginBottom: height * 0.01,
    textAlign: 'center',
  },
  label: {
    alignSelf: 'flex-start',
    color: '#555', // Color de texto ligeramente más suave para etiquetas
    fontSize: 16,
    marginBottom: height * 0.01, // Espaciado más suave
    paddingHorizontal: 20,
  },
  input: {
    width: '100%', // Asegura que los inputs ocupen todo el ancho disponible
    height: height * 0.06, // Altura más consistente
    backgroundColor: '#FFF', // Fondo blanco para inputs
    borderRadius: 8, // Bordes suaves y modernos
    paddingHorizontal: 15,
    marginBottom: height * 0.01, // Espacio uniforme entre inputs
    fontSize: 16,
    color: '#333', // Texto oscuro
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2, // Sombra ligera para hacer que los inputs resalten
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: height * 0.01,
  },
  inputPassword: {
    flex: 1,
    color: '#333', // Texto oscuro para la contraseña
  },
  iconButton: {
    paddingHorizontal: 10,
    justifyContent: 'center',
    height: height * 0.07, // Consistente con la altura del input
    backgroundColor: 'transparent',
  },
  button: {
    width: '100%',
    height: height * 0.07, // Altura más grande para mayor interacción
    backgroundColor: '#67A6F2', // color del boton
    borderRadius: 8, // Bordes redondeados
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: height * 0.01,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4, // Sombra más pronunciada para destacar el botón
  },
  buttonText: {
    color: 'black', // Texto blanco en los botones
    fontSize: 18,
    fontWeight: '600', // Mayor peso para mayor legibilidad
  },
  link: {
    marginTop: height * 0.01,
    color: 'black', // Consistencia de color para enlaces
    textAlign: 'center',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  roleSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: height * 0.01,
  },
  roleButton: {
    padding: height * 0.015,
    borderRadius: 8, // Bordes redondeados para consistencia
    borderWidth: 1,
    borderColor: '#ccc', // Color neutro para botones no seleccionados
    width: '45%',
    alignItems: 'center',
  },
  roleButtonSelected: {
    padding: height * 0.015,
    borderRadius: 8,
    backgroundColor: '#67A6F2', // Color consistente con los botones principales
    borderColor: '#4A90E2',
    width: '45%',
    alignItems: 'center',
  },
  roleButtonText: {
    color: '#FFF', // Texto blanco en el botón seleccionado
    fontSize: 16,
  },
});
