import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Pantalla8 = () => {
  const navigation = useNavigation();
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../assets/imageHome.png')} style={styles.course1Image} />
        <TouchableOpacity onPress={() => navigation.navigate('Pantalla7')}>
          <Text style={styles.navItem}>Matrícula</Text>
        </TouchableOpacity>

        <Text style={styles.navItem2}>William Estudiante</Text>
      </View>

      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>Bienvenido, William Fallas</Text>
      </View>

      <View style={styles.courseContainer}>
        <View style={styles.course}>
          <Image source={require('../assets/image9.png')} style={styles.courseImage} />
          <Text style={styles.courseTitle1}>Introducción al Desarrollo web</Text>
        </View>

        <View style={styles.course}>
          <Image source={require('../assets/image10.png')} style={styles.courseImage} />
          <Text style={styles.courseTitle}>Módulo 2</Text>
        </View>
        <View style={styles.course}>
          <Image source={require('../assets/image11.png')} style={styles.courseImage1} />
          <Text style={styles.courseTitle}>Módulo 3</Text>
        </View>
        <View style={styles.course}>
          <Image source={require('../assets/image12.png')} style={styles.courseImage2} />
          <Text style={styles.courseTitle}>Evaluaciones</Text>
        </View>
        <View style={styles.course}>
          <Image source={require('../assets/image13.png')} style={styles.courseImage} />
          <Text style={styles.courseTitle}>Certificado</Text>
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
    justifyContent: 'space-between',
    backgroundColor: '#195E63',
    padding: 20,
    marginTop: 20,
  },
  navItem: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
    marginRight: 20,
    width: 152,
    height: 26,
  },
  navItem2: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
    marginRight: 20,
    width: 104,
    height: 48,
  },

  welcomeContainer: {
    backgroundColor: '#3E838C',
    padding: 20,
    marginTop: 10,
    width: 405,
    height: 57,
    justifyContent: 'center'
  },
  welcomeText: {
    color: 'white',
    fontSize: 20,
    width: 253,
    height: 24,
    textAlign: 'center'
  },
  courseContainer: {
    padding: 25,
    marginTop: 5,
    justifyContent: 'center'

  },
  course: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderColor: '#ccc',
    borderWidth: 3,
    width: 343,
    height: 116,
    justifyContent: 'center'
  },
  course1Image: {
    width: 30,
    height: 28.64,

  },
  courseImage: {
    width: 91,
    height: 78,
    marginRight: 20,
  },
  courseImage1: {
    width: 71,
    height: 71,
    marginRight: 20,
  },
  courseImage2: {
    width: 86,
    height: 86,
    marginRight: 20,
  },
  courseTitle1: {
    fontSize: 20,
    color: '#195E63',
    textAlign: 'center',
    width: 161,
    height: 52,

  },
  courseTitle: {
    fontSize: 20,
    color: '#195E63',
    textAlign: 'center',
    width: 152,
    height: 25,

  },
});

export default Pantalla8;