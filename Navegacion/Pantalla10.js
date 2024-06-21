import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Pantalla10 = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState('Presente');

  const handleSearch = (text) => {
    setSearchText(text);
  };

  const handleTabPress = (tab) => {
    setActiveTab(tab);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.navbar}>

        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Text style={styles.navItem}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Pantalla10')}>
          <Text style={styles.navItem}>Cursos</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Pantalla7')}>
          <Text style={styles.navItem}>Matrícula</Text>
        </TouchableOpacity>
      </View>


      <View style={styles.subNavbar}>
        <Image source={require('../assets/imageHome.png')} style={styles.course1Image} />
        <Text style={styles.subNavItem1}>Mi aula virtual </Text>
      </View>

      <View style={styles.subNavbar1}>
      <TouchableOpacity onPress={() => navigation.navigate('Pantalla11')}>
      <Text style={styles.subNavItem}>Mis cursos recientes</Text>
                </TouchableOpacity>
       
        <Text style={styles.subNavItem}>Apoyo Docente</Text>
      </View>



      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar curso..."
          value={searchText}
          onChangeText={handleSearch}
        />
        <TouchableOpacity style={styles.searchButton}>
          <Text style={styles.searchButtonText}>🔍</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, activeTab === 'Presente' && styles.activeButton]}
          onPress={() => handleTabPress('Presente')}
        >
          <Text style={styles.buttonText}>Presente</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, activeTab === 'Pasados' && styles.activeButton]}
          onPress={() => handleTabPress('Pasados')}
        >
          <Text style={styles.buttonText}>Pasados</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.courseContainer}>
        {activeTab === 'Presente' && (
          <>
            <View style={styles.course}>
              <Image source={require('../assets/image17.png')} style={styles.courseImage} />
              <Text style={styles.courseTitle}>Desarrollo web</Text>
            </View>
            <View style={styles.course}>
              <Image source={require('../assets/image18.png')} style={styles.courseImage} />
              <Text style={styles.courseTitle}>Mecánica</Text>
            </View>
            <View style={styles.course}>
              <Image source={require('../assets/image19.png')} style={styles.courseImage} />
              <Text style={styles.courseTitle}>Marketing</Text>
            </View>
          </>
        )}
        {activeTab === 'Pasados' && (
          <Text style={styles.noCoursesText}>No hay cursos pasados disponibles.</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    backgroundColor: '#FFFFFF',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#004d4d',
    paddingVertical: 20,

  },
  navItem: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  course1Image: {
    width: 30,
    height: 28.64,
  },
  subNavbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
  },
  subNavbar1: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#3E838C',
    paddingVertical: 20,
  },
  subNavItem1: {
    color: '#8EBDB6',
    fontWeight: 'regular',
    fontSize: 20,


  },
  subNavItem: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#f0f0f0',
  },
  searchInput: {
    flex: 1,
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 10,
  },
  searchButton: {
    padding: 10,
    backgroundColor: '#339999',
    borderRadius: 5,
  },
  searchButtonText: {
    color: 'white',
    fontSize: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
  },
  button: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#b3cccc',
    marginHorizontal: 20,
    width: 153,
    height: 40,

  },
  activeButton: {
    backgroundColor: '#004d4d',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center'
  },
  courseContainer: {
    padding: 20,
  },
  course: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#339999',
    padding: 30,
    borderRadius: 10,
    marginBottom: 20,
    width: 359,
    height: 116,
  },
  courseImage: {
    width: 91,
    height: 78,
    marginRight: 80,
  },
  courseTitle: {
    fontSize: 18,
    color: 'white',
    textDecorationLine: 'underline',
  },
  noCoursesText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#aaa',
  },
});

export default Pantalla10;