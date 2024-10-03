import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F5F5F5', // Fondo gris claro para un aspecto profesional
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    marginTop: 10, // Añadir margen superior para bajar un poco el título
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
    color: '#333',
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 8,
    backgroundColor: '#FFF',
    marginBottom: 15,
  },
  pickerIcon: {
    marginLeft: 10,
  },
  customPicker: {
    flex: 1,
    height: 40,
    color: '#333',
  },
  addButton: {
    backgroundColor: '#67A6F2',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
    width: width * 0.9,
    alignSelf: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  button: {
    backgroundColor: '#67A6F2',
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 15,
    width: '100%',
    alignItems: 'center',
    alignSelf: 'center',
  },
  exitButton: {
    backgroundColor: '#F28C32', // Botón de color naranja para salir
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionButton: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  editButton: {
    backgroundColor: '#4CAF50', // Color verde para editar
  },
  deleteButton: {
    backgroundColor: '#FF4C4C', // Color rojo para eliminar
  },
  totalsContainer: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
});
