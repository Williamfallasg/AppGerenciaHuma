import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#D3D3D3',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: height * 0.02,
    paddingHorizontal: width > 600 ? 20 : 10,
  },
  logo: {
    width: '70%',
    height: height * 0.2,
    marginBottom: height * 0.05,
  },
  label: {
    alignSelf: 'flex-start',
    color: 'black',
    fontSize: width > 600 ? 18 : width * 0.045,
    marginBottom: height * 0.01,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: height * 0.02,
    paddingLeft: 10,
    width: '100%',
    height: height * 0.07,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    height: '100%',
    flex: 1,
    color: 'black',
  },
  iconContainer: {
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#67A6F2',
    borderRadius: 10,
    paddingVertical: height * 0.02,
    paddingHorizontal: '10%',
    marginBottom: height * 0.02,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontSize: width > 600 ? 18 : width * 0.045,
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
    marginTop: height * 0.02,
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
  },
  languageButtonText: {
    color: 'black',
    fontSize: width > 600 ? 16 : width * 0.04,
    textAlign: 'center',
  },
});
