import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#D3D3D3',
    alignItems: 'center',
    justifyContent: 'center',
    padding: width * 0.05,
  },
  logo: {
    width: width * 0.6,
    height: undefined,
    aspectRatio: 1,
    marginBottom: height * 0.05,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: height * 0.015,
    marginBottom: height * 0.025,
    width: '100%',
    fontSize: width * 0.04,
    height: height * 0.07,
  },
  multilineInput: {
    minHeight: height * 0.1,
  },
  sectionTitle: {
    fontSize: width * 0.045,
    color: 'black',
    marginBottom: height * 0.025,
    alignSelf: 'flex-start',
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.025,
    width: '100%',
  },
  activityInput: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: height * 0.015,
    fontSize: width * 0.04,
    marginRight: width * 0.02,
  },
  editButton: {
    backgroundColor: '#67A6F2',
    borderRadius: 8,
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.03,
  },
  deleteButton: {
    backgroundColor: '#F28C32',
    borderRadius: 8,
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.03,
    marginLeft: width * 0.02,
  },
  addButton: {
    backgroundColor: '#67A6F2',
    borderRadius: 8,
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.05,
    marginBottom: height * 0.04,
    alignItems: 'center',
    width: '100%',
  },
  addButtonText: {
    color: 'white',
    fontSize: width * 0.045,
  },
  button: {
    backgroundColor: '#67A6F2',
    borderRadius: 8,
    paddingVertical: height * 0.025,
    paddingHorizontal: width * 0.05,
    marginTop: height * 0.02,
    width: '100%',
    alignItems: 'center',
  },
  button1: {
    backgroundColor: '#F28C32',
    borderRadius: 8,
    paddingVertical: height * 0.025,
    paddingHorizontal: width * 0.05,
    marginTop: height * 0.02,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: width * 0.045,
    textAlign: 'center',
  },
});
