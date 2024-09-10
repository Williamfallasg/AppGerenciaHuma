import { StyleSheet, Dimensions } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'; // Necesitarás instalar este paquete

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: hp('0%'), // Espaciado dinámico
    paddingHorizontal: wp('0%'), // Espaciado horizontal para alinear con bordes
  },
  container: {
    flex: 1,
    backgroundColor: '#D3D3D3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: hp('1%'), // Espaciado dinámico alrededor del logo
  },
  logo: {
    width: wp('50%'), // Tamaño del logo ajustado dinámicamente
    height: wp('50%'), // Mantiene la proporción
    resizeMode: 'contain',
  },
  title: {
    fontSize: wp('6.5%'), // Tamaño de fuente dinámico
    fontWeight: 'bold',
    color: '#333',
    marginBottom: hp('1%'),
    textAlign: 'center',
  },
  label: {
    alignSelf: 'flex-start',
    color: 'black',
    fontSize: wp('4%'), // Tamaño de fuente dinámico
    marginBottom: hp('1%'),
    paddingHorizontal: wp('5%'),
  },
  input: {
    width: '90%',
    height: hp('6%'), // Altura más consistente
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: wp('4%'),
    marginBottom: hp('1%'),
    fontSize: wp('4%'),
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    marginBottom: hp('1%'),
  },
  inputPassword: {
    flex: 1,
    color: '#333',

  },
  iconButton: {
    paddingHorizontal: wp('5%'),
    justifyContent: 'center',
    height: hp('5%'),
    backgroundColor: 'transparent',
  },
  button: {
    width: '90%',
    height: hp('7%'),
    backgroundColor: '#67A6F2',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp('1%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    color: 'black',
    fontSize: wp('4.5%'), // Tamaño dinámico
    fontWeight: '600',
  },
  link: {
    marginTop: hp('1%'),
    color: 'black',
    textAlign: 'center',
    fontSize: wp('4%'), // Tamaño dinámico
    textDecorationLine: 'underline',
  },
  roleSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    marginVertical: hp('1%'),
  },
  roleButton: {
    padding: hp('1.5%'),
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    width: '45%',
    alignItems: 'center',
  },
  roleButtonSelected: {
    padding: hp('1.5%'),
    borderRadius: 8,
    backgroundColor: '#67A6F2',
    borderColor: '#4A90E2',
    width: '45%',
    alignItems: 'center',
  },
  roleButtonText: {
    color: '#FFF',
    fontSize: wp('4%'), // Tamaño dinámico
  },
});