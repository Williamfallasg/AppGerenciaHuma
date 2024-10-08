// styles.js
import { StyleSheet, Dimensions, Platform } from 'react-native';
import { useWindowDimensions } from 'react-native-web'; // Importamos para ayudar a gestionar dimensiones en web

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#D3D3D3',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: height * 0.03,
    paddingHorizontal: width > 600 ? 25 : 15, // Ajuste de padding para pantallas más grandes
  },
  logo: {
    width: '60%',
    height: height * 0.2,
    marginBottom: height * 0.04,
    resizeMode: 'contain',
    maxWidth: 300,
  },
  label: {
    alignSelf: 'flex-start',
    color: '#333',
    fontSize: width > 600 ? 20 : width * 0.045,
    marginBottom: height * 0.01,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: height * 0.02,
    paddingLeft: 12,
    width: '100%',
    maxWidth: 400,
    height: height * 0.07,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: Platform.OS === 'web' ? 2 : 4 }, // Ajuste para web
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 6,
  },
  input: {
    height: '100%',
    flex: 1,
    color: '#333',
    fontSize: width > 600 ? 16 : 14,
    paddingRight: 10,
  },
  iconContainer: {
    paddingHorizontal: 12,
  },
  button: {
    backgroundColor: '#67A6F2',
    borderRadius: 12,
    paddingVertical: height * 0.02,
    paddingHorizontal: '12%',
    marginBottom: height * 0.02,
    width: '100%',
    maxWidth: 400,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: Platform.OS === 'web' ? 2 : 4 }, // Ajuste para web
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  buttonText: {
    color: 'black',
    fontSize: width > 600 ? 18 : width * 0.045,
    fontWeight: '600',
    textAlign: 'center',
  },
  linkText: {
    color: 'black',
    marginTop: height * 0.02,
    fontSize: width > 600 ? 16 : width * 0.04,
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
  languageButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 400,
    marginTop: height * 0.025,
    marginBottom: height * 0.02,
  },
  languageButton: {
    flex: 1,
    backgroundColor: '#67A6F2',
    borderRadius: 10,
    paddingVertical: height * 0.015,
    marginHorizontal: width * 0.02,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: Platform.OS === 'web' ? 2 : 3 }, // Ajuste para web
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
