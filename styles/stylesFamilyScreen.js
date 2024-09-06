// styles.js
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#D3D3D3',
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
    alignSelf: 'center',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    width: '100%',
    fontSize: 16,
    borderColor: '#DDD',
    borderWidth: 1,
  },
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
    fontSize: 16,
  },
  familyContainer: {
    backgroundColor: '#EEE',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    width: '100%',
  },
  addButton: {
    backgroundColor: '#67A6F2',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#F28C32',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#67A6F2',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default styles;
