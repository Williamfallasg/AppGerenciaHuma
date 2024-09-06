import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
  },
  title: {
    fontSize: 22,
    marginBottom: 15,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  variablesContainer: {
    width: '100%',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
    color: '#000',
    textAlign: 'center',
  },
  variableButton: {
    backgroundColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  variableButtonText: {
    fontSize: 14,
    color: '#000',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  exitButton: {
    backgroundColor: '#F28C32',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 20,
    width: '80%',
    alignItems: 'center',
  },
  exitButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});