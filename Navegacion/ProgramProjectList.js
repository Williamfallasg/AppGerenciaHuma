import React, { useState, useEffect } from 'react'; 
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../context/LanguageContext';
import { firestore } from '../firebase/firebase';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from '../styles/stylesProgramProjectList';

const ProgramProjectList = () => {
  const { language } = useLanguage(); 
  const navigation = useNavigation();
  
  const [programs, setPrograms] = useState([]);
  const [projects, setProjects] = useState([]);

  // Función para obtener los programas desde Firestore
  const fetchPrograms = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, 'programs'));
      const programsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPrograms(programsList);
    } catch (error) {
      Alert.alert(language === 'es' ? "Error" : "Error", language === 'es' ? "Hubo un error al cargar los programas" : "There was an error loading the programs");
    }
  };

  // Función para obtener los proyectos desde Firestore
  const fetchProjects = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, 'projects'));
      const projectsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProjects(projectsList);
    } catch (error) {
      Alert.alert(language === 'es' ? "Error" : "Error", language === 'es' ? "Hubo un error al cargar los proyectos" : "There was an error loading the projects");
    }
  };

  useEffect(() => {
    fetchPrograms();
    fetchProjects();
  }, []);

  // Función para editar un programa o proyecto
  const handleEdit = (item) => {
    navigation.navigate('ProgramForm', { item });
  };

  // Función para eliminar un programa o proyecto
  const handleDelete = async (item) => {
    Alert.alert(
      language === 'es' ? 'Eliminar' : 'Delete',
      language === 'es' ? '¿Estás seguro de que deseas eliminar este elemento?' : 'Are you sure you want to delete this item?',
      [
        { text: language === 'es' ? 'Cancelar' : 'Cancel', style: 'cancel' },
        {
          text: language === 'es' ? 'Eliminar' : 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(firestore, item.programName ? 'programs' : 'projects', item.id));
              if (item.programName) setPrograms(programs.filter(program => program.id !== item.id));
              else setProjects(projects.filter(project => project.id !== item.id));
              Alert.alert(language === 'es' ? 'Eliminado exitosamente' : 'Deleted successfully');
            } catch (error) {
              Alert.alert(language === 'es' ? 'Error al eliminar' : 'Delete Error', language === 'es' ? 'Hubo un error al eliminar el elemento' : 'There was an error deleting the item');
            }
          },
        },
      ]
    );
  };

  // Renderizar un programa o proyecto en la lista
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemTitle}>{item.programName || item.projectName}</Text>
      <Text style={styles.itemDescription}>{item.programDescription || item.projectDescription}</Text>
      <Text style={styles.itemDetail}>{`${language === 'es' ? "Presupuesto" : "Budget"}: ${item.programBudget || item.projectBudget}`}</Text>
      <Text style={styles.itemDetail}>{`${language === 'es' ? "Fecha de inicio" : "Start Date"}: ${item.startDate}`}</Text>
      <Text style={styles.itemDetail}>{`${language === 'es' ? "Fecha de fin" : "End Date"}: ${item.endDate}`}</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item)}>
          <Icon name="edit" size={24} color="#FFF" />
          <Text style={styles.editButtonText}>{language === 'es' ? 'Editar' : 'Edit'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item)}>
          <Icon name="delete" size={24} color="#FFF" />
          <Text style={styles.deleteButtonText}>{language === 'es' ? 'Eliminar' : 'Delete'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{language === 'es' ? "Programas y Proyectos Registrados" : "Registered Programs and Projects"}</Text>

      <Text style={styles.sectionHeading}>{language === 'es' ? "Programas" : "Programs"}</Text>
      <FlatList
        data={programs}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text>{language === 'es' ? "No hay programas registrados" : "No programs registered"}</Text>}
      />

      <Text style={styles.sectionHeading}>{language === 'es' ? "Proyectos" : "Projects"}</Text>
      <FlatList
        data={projects}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text>{language === 'es' ? "No hay proyectos registrados" : "No projects registered"}</Text>}
      />

      {/* Botón para salir y regresar a Home */}
      <TouchableOpacity style={styles.exitButton} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.exitButtonText}>
          {language === 'es' ? 'Salir' : 'Exit'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProgramProjectList;
