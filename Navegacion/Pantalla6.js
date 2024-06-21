import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Pantalla6 = () => {
  const navigation = useNavigation();
 
  return (
    <View style={styles.container}>
      <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Text style={styles.navItem}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Pantalla7')}>
        <Text style={styles.navItem}>Cursos</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Pantalla8')}>
        <Text style={styles.navItem}>Cursos en línea</Text>
        </TouchableOpacity>
        
        
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.mainContent}>
          <View style={styles.iconContainer}>
            <Image source={require('../assets/image4.png')} style={styles.mainImage} />
          </View>

          <Text style={styles.mainTitle}>Aprender en línea</Text>

          <View style={styles.searchBar}>
            <TextInput style={styles.searchInput} placeholder="Inglés" />
            <TouchableOpacity style={styles.searchButton}>
              <Text style={styles.searchButtonText}>🔍</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.filterContainer}>
            <TouchableOpacity style={styles.filterButton}>
              <Text style={styles.filterText}>Tema</Text>
              <Text style={styles.filterIcon}>👆</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton}>
              <Text style={styles.filterText}>Nivel</Text>
              <Text style={styles.filterIcon}>👆</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton}>
              <Text style={styles.filterText}>Ubicación</Text>
              <Text style={styles.filterIcon}>👆</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.footerNav}>
            <Text style={styles.footerNavItem}>Home</Text>
            <Text style={styles.footerNavItem}>Cursos</Text>
            <Text style={styles.footerNavItem}>Cursos en línea</Text>
          </View>
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionText}>
              El aprendizaje en línea es una forma de aprender de forma remota sin asistir a lecciones en un aula o tener contacto cara a cara con un tutor.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#2C6C6C',
    marginTop: 50,
    marginBottom: 20,
    width: 405,
    height: 79,
    alignItems: 'center',
  },
  navItem: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
  scrollContent: {
    alignItems: 'center',
    padding: 20,
  },
  mainContent: {
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  iconContainer: {
    borderColor: '#004b44',
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    width: 320,
    height: 149,
    borderRadius: 25,
  },
  mainImage: {
    width: 119,
    height: 121,
  },
  mainTitle: {
    fontSize: 20,
    color: '#3E838C',
    marginBottom: 20,
    width: 320,
    textAlign: 'left',
    fontWeight: 'bold',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  searchInput: {
    flex: 1,
    padding: 10,
    borderColor: '#004b44',
    borderWidth: 2,
    borderRadius: 5,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  searchButton: {
    padding: 10,
    borderColor: '#004b44',
    borderWidth: 2,
    borderLeftWidth: 0,
    borderRadius: 5,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    backgroundColor: '#fff',
  },
  searchButtonText: {
    color: '#004b44',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    width: '100%',
  },
  filterButton: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#8EBDB6',
    borderRadius: 10,
    paddingVertical: 20,
    margin: 10,
    width: 107,
    height: 74,
  },
  filterText: {
    color: '#FFFFFF',
    marginBottom: 10,
  },
  filterIcon: {
    color: '#004b44',
  },
  footerNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    width: '100%',
    backgroundColor: '#FFFFFF',
  },
  footerNavItem: {
    color: '#195E63',
    fontWeight: 'bold',
  },
  descriptionContainer: {
    backgroundColor: '#3E838C',
    padding: 10,
    borderRadius: 25,
    marginBottom: 20,
    width: '100%',
  },
  descriptionText: {
    color: 'white',
    textAlign: 'left',
    fontSize: 20,
  },
});

export default Pantalla6;
