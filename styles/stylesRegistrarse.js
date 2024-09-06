import { StyleSheet } from 'react-native';

//   -----------------------Styles de la pantalla Registrarse.js -------------------------------- //
export default StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#D3D3D3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: 5,
  },
  logo: {
    width: 200,
    height: 201,
    marginBottom: 20,
  },
  label: {
    alignSelf: 'flex-start',
    color: 'black',
    fontSize: 18,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
  },
  input: {
    width: '90%',
    height: 40,
    backgroundColor: 'white',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    marginBottom: 10,
  },
  inputPassword: {
    flex: 1,
  },
  iconButton: {
    paddingHorizontal: 0,
    marginLeft: -25,
    height: 40,
    justifyContent: 'center',
  },
  button: {
    width: '90%',
    height: 40,
    backgroundColor: '#67A6F2',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
  },
  link: {
    marginTop: 20,
    color: 'black',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  roleSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    marginVertical: 20,
  },
  roleButton: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  roleButtonSelected: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#67A6F2',
    borderColor: '#67A6F2',
  },
});
//   ------------------------------------------------------------------- //