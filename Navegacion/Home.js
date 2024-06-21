import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';


const Home = () => {
  const navigation = useNavigation();

  const handlePress = () => {
    Linking.openURL('https://sdgs.un.org/2030agenda');
  };

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <Text style={styles.navbarText}>Home</Text>

        <TouchableOpacity onPress={() => navigation.navigate('Pantalla6')}>
          <Text style={styles.navbarText}>About</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('EditPerfil')}>
          <Text style={styles.navbarText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.header}>Welcome to United Nations</Text>
      <View style={styles.searchContainer}>
        <TextInput style={styles.searchInput} placeholder="Search" />
        <TouchableOpacity style={styles.searchButton}>
          <Text style={styles.searchButtonText}>🔍</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.mainButton}>
        <Text style={styles.mainButtonText}>LOS 17 OBJETIVOS</Text>
      </TouchableOpacity>

      <Image source={require('../assets/image3.png')} style={styles.mainImage} />

      <View style={styles.storyContainer}>
        <TouchableOpacity style={styles.subButton}>
          <Text style={styles.subButtonText}>Historias</Text>
        </TouchableOpacity>
        <Text style={styles.contentText} onPress={handlePress}>
          The 2030 Agenda for Sustainable Development.
        </Text>
      </View>
    </View>
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
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#2C6C6C',
    marginTop: 50,
    marginBottom: 20,
    width: 405,
    height: 79,
    alignItems: 'center',
  },
  navbarText: {
    color: 'white',
    fontSize: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 20,
    alignItems: 'center',
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
    backgroundColor: '#2C6C6C',
    borderRadius: 5,
  },
  searchButtonText: {
    color: 'white',
    fontSize: 16,
  },
  mainButton: {
    backgroundColor: '#2C6C6C',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 20,
    width: 268,
    height: 50,

  },
  mainButtonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  mainImage: {
    width: 355,
    height: 261,
    resizeMode: 'contain',
    marginBottom: 20,

  },
  subButton: {
    backgroundColor: '#2C6C6C',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 10,
    width: 268,
    height: 50,
    fontSize: 18,

  },
  subButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center'
  },
  contentText: {
    fontSize: 16,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },

  container: {
    flex: 1,
    justifyContent: 'left',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  storyContainer: {
    alignItems: 'left',
    width: '80%',
    borderWidth: 2,
    borderColor: '#438a92',
    padding: 30,
    borderRadius: 10,
  },

});

export default Home;