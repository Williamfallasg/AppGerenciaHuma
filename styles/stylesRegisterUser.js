import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
  container: (width) => ({
    flexGrow: 1,
    backgroundColor: '#D3D3D3',
    paddingHorizontal: width > 600 ? 40 : 20, // Ajusta el padding según el ancho de la pantalla
    paddingVertical: 10,
  }),
  logo: (width) => ({
    width: width * 0.4,
    height: width * 0.4,
    marginBottom: 20,
    alignSelf: 'center',
  }),
  input: (width) => ({
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: Platform.OS === 'ios' ? 12 : 10,
    marginBottom: 15,
    width: '100%',
    fontSize: width > 600 ? 18 : 16, // Ajusta el tamaño de fuente según el ancho de la pantalla
    borderColor: '#DDD',
    borderWidth: 1,
  }),
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 15,
    width: '100%',
    paddingHorizontal: 10,
    borderColor: '#DDD',
    borderWidth: 1,
  },
  picker: {
    height: 50,
    color: '#000',
  },
  pickerItem: {
    color: '#67A6F2',
    fontSize: Platform.OS === 'ios' ? 18 : 16,
  },
  button: (width) => ({
    backgroundColor: '#67A6F2',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  }),
  addButton: (width) => ({
    backgroundColor: '#67A6F2',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  }),
  buttonText: {
    color: 'black',
    fontSize: 18,
    textAlign: 'center',
    fontWeight:"bold"
  },
  qrContainer: (width) => ({
    marginTop: 30,
    alignItems: 'center',
  }),
  exitButton: (width) => ({
    backgroundColor: '#F28C32',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
    
  }),
});
