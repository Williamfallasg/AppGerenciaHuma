import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#D3D3D3',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
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
    marginBottom: 15,
    width: '100%',
    height: height * 0.07,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#67A6F2',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  exitButton: {
    backgroundColor: '#F28C32',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  activityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    width: '100%',
  },
  activityInput: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
  },
  iconButton: {
    marginLeft: 10,
  },
});
