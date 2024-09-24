import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#D3D3D3',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  logo: {
    width: width * 0.5,
    height: width * 0.5,
    marginBottom: 20, // Increased margin for better spacing
    resizeMode: 'contain',
  },
  programContainer: {
    backgroundColor: '#FFFFFF', // Add background color to the container
    borderRadius: 15, // Make the container rounded
    padding: 15, // Padding inside the container
    width: '90%', // Set width of the container
    marginBottom: 20, // Space between containers
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, // Subtle shadow
    shadowRadius: 3,
    elevation: 2, // Elevation for shadow on Android
  },
  programTitle: {
    fontSize: 20, // Increased size for better readability
    fontWeight: 'bold',
    marginBottom: 10, // Space between the title and inputs
    textAlign: 'center', // Center the title
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 15, // Increased margin for spacing between inputs
    width: '100%', // Make input take full width of container
    fontSize: 16, // Adjusted font size for consistency
    height: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  button: {
    backgroundColor: '#67A6F2',
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginTop: 20, // Space above buttons
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  addButton: {
    backgroundColor: '#67A6F2',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginTop: 20,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  addButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    textAlign: 'center',
  },
  button1: {
    backgroundColor: '#F28C32',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginTop: 10,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  exitButton: {
    backgroundColor: '#F28C32',
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 10,
  },
});
