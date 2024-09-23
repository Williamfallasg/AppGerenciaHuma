import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#D3D3D3',
    alignItems: 'center',
    padding: 10,
  },
  logo: {
    width: width * 0.5,
    height: width * 0.5,
    marginBottom: 30,
    resizeMode: 'contain',
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    width: '100%',
    height: height * 0.07,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#67A6F2',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  exitButton: {
    backgroundColor: '#F28C32',
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#000',
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#67A6F2',
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
    width: '100%',
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  activityInput: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
  },
  iconButton: {
    marginLeft: 15,
  },
  // Cambiado a columna
  radioButtonContainer: {
    flexDirection: 'column', // Cambiado a 'column' para que se vea uno debajo de otro
    alignItems: 'flex-start', // Alinea el texto a la izquierda
    marginBottom: 10,
    width: '100%',
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10, // Espacio entre las opciones
  },
  radioSelected: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#007AFF',
    backgroundColor: '#007AFF',
    marginRight: 10,
  },
  radioUnselected: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#B0B0B0',
    backgroundColor: '#FFFFFF',
    marginRight: 10,
  },
  indicatorInput: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
  },
  beneficiariesInput: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
  },
});
