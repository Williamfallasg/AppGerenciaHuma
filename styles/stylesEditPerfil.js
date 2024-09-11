import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: width * 0.0, // Ajuste proporcional al tamaño de la pantalla
    backgroundColor: '#D3D3D3',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    maxWidth: 400, // Un límite máximo en píxeles para evitar que se vea muy grande en pantallas grandes
    alignItems: 'center',
    backgroundColor: '#D3D3D3',
    borderRadius: 10,
    padding: width * 0.05, // Ajustar el padding proporcionalmente
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  profileImage: {
    width: width * 0.3, // Ajuste proporcional al ancho de la pantalla
    height: width * 0.3, // Mantener la relación 1:1
    borderRadius: (width * 0.3) / 2, // Hacer la imagen completamente circular
    borderWidth: 2,
    borderColor: '#67A6F2',
    marginBottom: 20,
  },
  changePhotoButton: {
    backgroundColor: '#67A6F2',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: width * 0.15, // Ajustar proporcionalmente
    marginBottom: 20,
  },
  changePhotoButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  label: {
    alignSelf: 'flex-start',
    color: '#333',
    fontSize: 14,
    marginBottom: 5,
  },
  input: {
    width: '100%',
    height: 40,
    backgroundColor: '#F1F1F1',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    borderColor: '#D1D1D1',
    borderWidth: 1,
  },
  updateButton: {
    width: '100%',
    height: 45,
    backgroundColor: '#67A6F2',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkButton: {
    marginTop: 15,
  },
  linkText: {
    color: 'black',
    textDecorationLine: 'underline',
  },
});
