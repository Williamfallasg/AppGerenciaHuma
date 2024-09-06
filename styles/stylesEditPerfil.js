import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#D3D3D3',
    alignItems: 'center',
  },
  profileImage: {
    width: 154,
    height: 154,
    borderRadius: 77,
    borderWidth: 5,
    borderColor: 'white',
    marginBottom: 20,
    marginTop: 30,
  },
  changePhotoButton: {
    width: 186,
    height: 47,
    backgroundColor: '#67A6F2',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  changePhotoButtonText: {
    color: 'black',
    fontSize: 16,
  },
  label: {
    alignSelf: 'flex-start',
    color: 'black',
    fontSize: 18,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  input: {
    width: '100%',
    height: 40,
    backgroundColor: 'white',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  updateButton: {
    width: '100%',
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
  linkButton: {
    marginVertical: 10,
  },
  linkText: {
    color: 'black',
    textDecorationLine: 'underline',
  },
});
