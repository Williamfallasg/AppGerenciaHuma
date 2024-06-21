import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Pantalla7 = () => {
  const navigation = useNavigation();

  const handleEnrollPress = () => {
    Alert.alert('Curso matriculado satisfactoriamente', '', [
      {
        text: 'OK',
        onPress: () => navigation.navigate('Pantalla9'),
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Text style={styles.navItem}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Pantalla10')}>
          <Text style={styles.navItem}>Cursos</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Pantalla8')}>
          <Text style={styles.navItem}>Cursos en línea</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mainContent}>
        <Text style={styles.mainTitle}>La Educación del Futuro</Text>

        <View style={styles.courseContainer}>
          <View style={styles.course}>
            <Image source={require('../assets/image6.png')} style={styles.courseImage} />
            <View style={styles.courseTextContainer}>
              <Text style={styles.courseTitle}>Construcción</Text>
              <TouchableOpacity style={styles.enrollButton} onPress={handleEnrollPress}>
                <Text style={styles.enrollButtonText}>Matricular</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.course}>
            <Image source={require('../assets/image7.png')} style={styles.courseImage} />
            <View style={styles.courseTextContainer}>
              <Text style={styles.courseTitle}>Idiomas</Text>
              <TouchableOpacity style={styles.enrollButton} onPress={handleEnrollPress}>
                <Text style={styles.enrollButtonText}>Matricular</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.course}>
            <Image source={require('../assets/image8.png')} style={styles.courseImage} />
            <View style={styles.courseTextContainer}>
              <Text style={styles.courseTitle}>Marketing</Text>
              <TouchableOpacity style={styles.enrollButton} onPress={handleEnrollPress}>
                <Text style={styles.enrollButtonText}>Matricular</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 0,
    marginTop: 30,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#2C6C6C',
    marginTop: 30,
    marginBottom: 20,
    width: 405,
    height: 79,
    alignItems: 'center',
  },
  navItem: {
    color: 'white',
    fontWeight: 'bold',
    paddingVertical: 10,
    marginBottom: 10,
  },
  mainContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  mainTitle: {
    fontSize: 24,
    color: '#004b44',
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  courseContainer: {
    width: '100%',
    alignItems: 'center',
  },
  course: {
    backgroundColor: '#195E63',
    borderRadius: 10,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: 352,
    height: 177,
  },
  courseImage: {
    width: 110,
    height: 107,
    borderRadius: 10,
    marginRight: 20,
  },
  courseTextContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  courseTitle: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 30,
    width: 160,
    height: 22,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  enrollButton: {
    backgroundColor: '#8EBDB6',
    padding: 10,
    borderRadius: 10,
    width: 157,
    height: 48,
  },
  enrollButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Pantalla7;
