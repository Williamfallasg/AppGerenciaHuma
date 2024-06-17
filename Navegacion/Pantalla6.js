import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native';

const Pantalla6 = () => {
  const handlePress = () => {
    // Aquí puedes manejar la acción del enlace
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.navItem}>Home</Text>
        <Text style={styles.navItem}>Cursos</Text>
        <Text style={styles.navItem}>Cursos en línea</Text>
      </View>
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
          <TouchableOpacity style={styles.filter1Button}>
            <Text style={styles.filterText}>Tema</Text>
            <Text style={styles.filterIcon}>👆</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filter2Button}>
            <Text style={styles.filterText}>Nivel</Text>
            <Text style={styles.filterIcon}>👆</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filter3Button}>
            <Text style={styles.filterText}>Ubicación</Text>
            <Text style={styles.filterIcon}>👆</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footerNav}>
          <Text style={styles.footer1NavItem}>Home</Text>
          <Text style={styles.footer2NavItem}>Cursos</Text>
          <Text style={styles.footer3NavItem}>Cursos en línea</Text>
        </View>
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>
            El aprendizaje en línea es una forma de aprender de forma remota sin asistir a lecciones en un aula o tener contacto cara a cara con un tutor.
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    padding: 0,
    marginTop: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#2C6C6C',
    paddingVertical: 20,
    marginBottom: 10,
    marginTop: 20,
    width: 393,
    height: 79,
  },
  navItem: {
    color: 'white',
    fontWeight: 'bold',
  },
  mainContent: {
    alignItems: 'center',
    marginTop: 20,
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
    color: '#004b44',
    marginBottom: 20,
    width: 320, 
    textAlign: 'left',
    fontWeight: 'bold',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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
    marginBottom: 5,
  },
  filter1Button: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#8EBDB6',
    borderRadius: 10,
    paddingVertical: 20,
    margin: 20,
    width: 107,
    height: 74,
  },
  filter2Button: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#8EBDB6',
    borderRadius: 10,
    paddingVertical: 20,
    margin: 20,
    width: 107,
    height: 74,
  },
  filter3Button: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#8EBDB6',
    borderRadius: 10,
    width: '30%',
    paddingVertical: 20,
    margin: 20,
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
    marginVertical: 20,
    paddingVertical: 20,
    width: 393,
    height: 79,
    color: '#195E63',
  },
  footerNavItem: {
    color: '#195E63',
  },
  footer1NavItem: {
    color: '#195E63',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
  footer2NavItem: {
    color: '#195E63',
    fontWeight: 'bold',
  },
  footer3NavItem: {
    color: '#195E63',
    fontWeight: 'bold',
  },
  descriptionContainer: {
    backgroundColor: '#3E838C',
    padding: 10,
    borderRadius: 25,
    marginBottom: 5,
    width: 371,
    height: 165,
    margin: 1,
  },
  descriptionText: {
    color: 'white',
    textAlign: 'left',
    fontSize: 20,
    justifyContent: 'center',
  },
});

export default Pantalla6;