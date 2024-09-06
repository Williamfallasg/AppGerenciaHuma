// styles.js
import { StyleSheet, Dimensions } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D3D3D3',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: Dimensions.get('window').width * 0.5,
    height: Dimensions.get('window').width * 0.5,
    marginBottom: 40,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    color: '#000',
  },
  radioContainer: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 10,
    padding: 20,
    marginBottom: 30,
    width: '90%',
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioText: {
    fontSize: 18,
    color: '#000',
  },
  generateButton: {
    backgroundColor: '#67A6F2',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 20,
    width: '90%',
    alignItems: 'center',
  },
  generateButtonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  exitButton: {
    backgroundColor: '#F28C32',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    width: '90%',
    alignItems: 'center',
  },
  exitButtonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  reportContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  reportTitle: {
    fontSize: 22,
    marginBottom: 20,
  },
  chart: {
    marginVertical: 10,
    borderRadius: 16,
  },
});

export default styles;
