import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../context/LanguageContext';
import { firestore } from '../firebase/firebase2';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useUserRole } from '../context/UserRoleContext'; // Importar el contexto del rol del usuario
import styles from '../styles/stylesProjectForm';  // Importar los estilos

const ProjectForm = () => {
  const { language } = useLanguage(); 
  const navigation = useNavigation();
  const { userRole } = useUserRole(); // Obtener el rol del usuario

  const [projectID, setProjectID] = useState('');
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectBudget, setProjectBudget] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activities, setActivities] = useState([{ id: 1, activity: '' }]);

  // Verificar si el usuario es admin
  useEffect(() => {
    if (userRole !== 'admin') {
      navigation.navigate('Home'); // Redirigir si no es admin
    }
  }, [userRole]);

  const formatDateInput = (text) => {
    if (/^\d{2}$/.test(text) || /^\d{2}\/\d{2}$/.test(text)) {
      text += '/';
    }
    return text;
  };

  const handleStartDateChange = (text) => {
    const formattedText = formatDateInput(text);
    setStartDate(formattedText);
  };

  const handleEndDateChange = (text) => {
    const formattedText = formatDateInput(text);
    setEndDate(formattedText);
  };

  const validateDate = (date) => {
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    if (!dateRegex.test(date)) {
      return false;
    }
    const [day, month, year] = date.split('/').map(Number);
    const dateObj = new Date(year, month - 1, day);
    return dateObj.getDate() === day && dateObj.getMonth() === month - 1 && dateObj.getFullYear() === year;
  };

  const validateInputs = () => {
    if (!projectID || !projectName || !projectDescription || !projectBudget || !startDate || !endDate) {
      Alert.alert(language === 'es' ? 'Por favor, complete todos los campos' : 'Please fill in all fields');
      return false;
    }
    if (isNaN(projectBudget)) {
      Alert.alert(language === 'es' ? 'Presupuesto debe ser un número' : 'Budget must be a number');
      return false;
    }
    if (!validateDate(startDate)) {
      Alert.alert(language === 'es' ? 'Fecha de inicio no válida' : 'Invalid start date');
      return false;
    }
    if (!validateDate(endDate)) {
      Alert.alert(language === 'es' ? 'Fecha de fin no válida' : 'Invalid end date');
      return false;
    }
    const [startDay, startMonth, startYear] = startDate.split('/').map(Number);
    const [endDay, endMonth, endYear] = endDate.split('/').map(Number);
    const start = new Date(startYear, startMonth - 1, startDay);
    const end = new Date(endYear, endMonth - 1, endDay);
    if (end < start) {
      Alert.alert(language === 'es' ? 'La fecha de fin no puede ser anterior a la fecha de inicio' : 'End date cannot be earlier than start date');
      return false;
    }
    for (const activity of activities) {
      if (!activity.activity.trim()) {
        Alert.alert(language === 'es' ? `La actividad ${activity.id} está vacía` : `Activity ${activity.id} is empty`);
        return false;
      }
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateInputs()) return;

    try {
      const docRef = doc(firestore, "projects", projectID);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        Alert.alert(language === 'es' ? 'El proyecto ya existe en la base de datos' : 'Project ID already exists');
      } else {
        await setDoc(docRef, {
          projectID,
          projectName,
          projectDescription,
          projectBudget,
          startDate,
          endDate,
          activities: activities.map(a => a.activity),
        });
        Alert.alert(language === 'es' ? 'Guardado exitosamente' : 'Saved successfully');
        navigation.navigate('Home');
      }
    } catch (e) {
      console.error("Error al agregar documento: ", e);
      Alert.alert(language === 'es' ? 'Error al guardar' : 'Error saving');
    }
  };

  const handleExit = () => {
    navigation.navigate('Home');
  };

  const handleAddActivity = () => {
    setActivities([...activities, { id: activities.length + 1, activity: '' }]);
  };

  const handleActivityChange = (text, id) => {
    const newActivities = activities.map(item => 
      item.id === id ? { ...item, activity: text } : item
    );
    setActivities(newActivities);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require('../assets/image.png')} style={styles.logo} />
      
      <TextInput
        style={styles.input}
        placeholder={language === 'es' ? "ID del proyecto" : "Project ID"}
        value={projectID}
        onChangeText={setProjectID}
        placeholderTextColor="#B0B0B0"
      />
      
      <TextInput
        style={styles.input}
        placeholder={language === 'es' ? "Nombre del proyecto" : "Project Name"}
        value={projectName}
        onChangeText={setProjectName}
        placeholderTextColor="#B0B0B0"
      />
      
      <TextInput
        style={styles.input}
        placeholder={language === 'es' ? "Descripción del proyecto" : "Project Description"}
        value={projectDescription}
        onChangeText={setProjectDescription}
        placeholderTextColor="#B0B0B0"
      />
      
      <TextInput
        style={styles.input}
        placeholder={language === 'es' ? "Presupuesto del proyecto" : "Project Budget"}
        value={projectBudget}
        onChangeText={setProjectBudget}
        keyboardType="numeric"
        placeholderTextColor="#B0B0B0"
      />

      <TextInput
        style={styles.input}
        placeholder={language === 'es' ? "Fecha de inicio (dd/mm/yyyy)" : "Start Date (dd/mm/yyyy)"}
        value={startDate}
        onChangeText={handleStartDateChange}
        placeholderTextColor="#B0B0B0"
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder={language === 'es' ? "Fecha de fin (dd/mm/yyyy)" : "End Date (dd/mm/yyyy)"}
        value={endDate}
        onChangeText={handleEndDateChange}
        placeholderTextColor="#B0B0B0"
        keyboardType="numeric"
      />

      {activities.map(({ id, activity }) => (
        <View key={id} style={styles.activityContainer}>
          <TextInput
            style={styles.activityInput}
            placeholder={language === 'es' ? `Actividad ${id}` : `Activity ${id}`}
            value={activity}
            onChangeText={(text) => handleActivityChange(text, id)}
            placeholderTextColor="#B0B0B0"
          />
          <TouchableOpacity onPress={() => handleEditActivity(id)} style={styles.iconButton}>
            <Icon name="edit" size={24} color="#67A6F2" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDeleteActivity(id)} style={styles.iconButton}>
            <Icon name="delete" size={24} color="#F28C32" />
          </TouchableOpacity>
        </View>
      ))}
      
      <TouchableOpacity style={styles.button} onPress={handleAddActivity}>
        <Text style={styles.buttonText}>
          {language === 'es' ? "Agregar actividad" : "Add Activity"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>
          {language === 'es' ? "Guardar" : "Save"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.exitButton]} onPress={handleExit}>
        <Text style={styles.buttonText}>
          {language === 'es' ? "Salir" : "Exit"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ProjectForm;
