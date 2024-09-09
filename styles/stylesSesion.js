import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F3F4F6', // Color de fondo claro y limpio
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: height * 0.03,
    paddingHorizontal: width > 600 ? 25 : 15,
  },
  logo: {
    width: '60%', // Tamaño más reducido para que se vea bien en pantallas grandes y pequeñas
    height: height * 0.2,
    marginBottom: height * 0.04,
    resizeMode: 'contain', // Para que la imagen no se deforme
  },
  label: {
    alignSelf: 'flex-start',
    color: '#333', // Texto más oscuro para mayor contraste y profesionalismo
    fontSize: width > 600 ? 20 : width * 0.045,
    marginBottom: height * 0.01,
    fontWeight: 'bold', // Añadir negrita para destacar etiquetas
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12, // Bordes más suaves
    marginBottom: height * 0.02,
    paddingLeft: 12,
    width: '100%',
    height: height * 0.07,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 }, // Sombra más pronunciada
    shadowOpacity: 0.1, // Opacidad más ligera
    shadowRadius: 5,
    elevation: 6,
  },
  input: {
    height: '100%',
    flex: 1,
    color: '#333', // Texto oscuro para mejor legibilidad
    fontSize: width > 600 ? 16 : 14,
    paddingRight: 10, // Espacio entre el borde derecho y el texto
  },
  iconContainer: {
    paddingHorizontal: 12, // Más espacio alrededor del ícono para mejor interacción
  },
  button: {
    backgroundColor: '#67A6F2', // color button
    borderRadius: 12,
    paddingVertical: height * 0.02,
    paddingHorizontal: '12%',
    marginBottom: height * 0.02,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  buttonText: {
    color: 'black', // Texto blanco para mayor contraste en los botones
    fontSize: width > 600 ? 18 : width * 0.045,
    fontWeight: '600', // Un peso mayor para que destaque
    textAlign: 'center',
  },
  linkText: {
    color: 'black', // Azul para enlaces que denotan acción
    marginTop: height * 0.02,
    fontSize: width > 600 ? 16 : width * 0.04,
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
  languageButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: height * 0.025,
    marginBottom: height * 0.02,
  },
  languageButton: {
    flex: 1,
    backgroundColor: '#67A6F2', // Consistente con el color de otros botones
    borderRadius: 10,
    paddingVertical: height * 0.015,
    marginHorizontal: width * 0.02,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
  },
  languageButtonText: {
    color: 'black',
    fontSize: width > 600 ? 16 : width * 0.04,
    fontWeight: '500',
    textAlign: 'center',
  },
});
