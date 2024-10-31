import React, { useEffect, useState } from 'react';
import { View, Text, Button, ScrollView, Alert, StyleSheet } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useLanguage } from '../context/LanguageContext';
import { firestore } from '../firebase/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

const UserDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { userData } = route.params;
  const { language } = useLanguage();
  const [projectNames, setProjectNames] = useState([]);

  useEffect(() => {
    const fetchProjectNames = async () => {
      try {
        if (userData.projects && userData.projects.length > 0) {
          const projectsRef = collection(firestore, "projects");
          const projectsQuery = query(projectsRef, where("__name__", "in", userData.projects));
          const querySnapshot = await getDocs(projectsQuery);
          const names = querySnapshot.docs.map(doc => doc.data().projectName || 'Nombre no disponible');
          setProjectNames(names);
        }
      } catch (error) {
        console.error("Error fetching project names: ", error);
        Alert.alert("Error", language === 'es' ? "No se pudieron cargar los nombres de los proyectos" : "Could not load project names");
      }
    };
    fetchProjectNames();
  }, [userData.projects]);

  const handleDownload = async () => {
    try {
      const jsonContent = JSON.stringify(userData, null, 2);
      const fileUri = `${FileSystem.documentDirectory}user_data.json`;
      await FileSystem.writeAsStringAsync(fileUri, jsonContent);

      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/json',
        dialogTitle: language === 'es' ? 'Descargar datos del usuario' : 'Download User Data',
        UTI: 'public.json',
      });
    } catch (error) {
      console.error("Error downloading file: ", error);
      Alert.alert("Error", language === 'es' ? "No se pudo descargar el archivo" : "Could not download the file");
    }
  };

  const handleExit = () => {
    navigation.navigate('Home');
  };

  const translations = {
    userID: language === 'es' ? 'ID de usuario' : 'User ID',
    idType: language === 'es' ? 'Tipo de identificación' : 'ID Type',
    name: language === 'es' ? 'Nombre completo' : 'Full Name',
    gender: language === 'es' ? 'Sexo' : 'Sex',
    birthDate: language === 'es' ? 'Fecha de nacimiento' : 'Birth Date',
    age: language === 'es' ? 'Edad' : 'Age',
    countries: language === 'es' ? 'Países' : 'Countries',
    province: language === 'es' ? 'Provincia' : 'Province',
    canton: language === 'es' ? 'Cantón' : 'Canton',
    district: language === 'es' ? 'Distrito' : 'District',
    phone: language === 'es' ? 'Teléfono' : 'Phone',
    projects: language === 'es' ? 'Proyectos' : 'Projects',
    medicalCondition: language === 'es' ? 'Condición Médica' : 'Medical Condition',
    activities: language === 'es' ? 'Actividades' : 'Activities',
  };

  const getTranslatedGender = (gender) => {
    if (gender.toLowerCase() === 'female') return language === 'es' ? 'Femenino' : 'Female';
    if (gender.toLowerCase() === 'male') return language === 'es' ? 'Masculino' : 'Male';
    return gender;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>
        {language === 'es' ? 'Detalles del Usuario' : 'User Details'}
      </Text>
      
      <View style={styles.card}>
        {Object.entries(userData).map(([key, value]) => (
          <View key={key} style={styles.itemContainer}>
            <Text style={styles.label}>{translations[key] || formatLabel(key)}</Text>
            <Text style={styles.value}>
              {key === 'gender'
                ? getTranslatedGender(value)
                : key === 'projects'
                ? projectNames.join(', ') // Mostrar nombres de proyectos
                : Array.isArray(value) ? value.join(', ') : value} 
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <Button title={language === 'es' ? 'Descargar datos' : 'Download Data'} onPress={handleDownload} color="#007BFF" />
      </View>
      <View style={[styles.buttonContainer, { marginTop: 10 }]}>
        <Button title={language === 'es' ? 'Salir' : 'Exit'} onPress={handleExit} color="#F28C32" />
      </View>
    </ScrollView>
  );
};

const formatLabel = (label) => {
  return label
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase());
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  itemContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 5,
    borderBottomWidth: 1,
    borderColor: '#EAEAEA',
    paddingBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    flex: 1,
  },
  value: {
    fontSize: 16,
    color: '#333',
    flex: 2,
  },
  buttonContainer: {
    marginVertical: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
});

export default UserDetailsScreen;
