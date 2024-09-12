import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../context/LanguageContext';
import { firestore } from '../firebase/firebase';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useUserRole } from '../context/UserRoleContext';
import styles from '../styles/stylesProjectForm';  // Importar los estilos

const ProjectForm = () => {
  const { language } = useLanguage(); 
  const navigation = useNavigation();
  const { userRole } = useUserRole(); 

  const [projectID, setProjectID] = useState('');
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectBudget, setProjectBudget] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activities, setActivities] = useState([{ id: 1, activity: '' }]);
  const [indicators, setIndicators] = useState([{ id: 1, description: '', beneficiaries: '' }]);

  useEffect(() => {
    if (userRole !== 'admin') {
      navigation.navigate('Home'); 
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
    return dateRegex.test(date);
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
    for (const activity of activities) {
      if (!activity.activity.trim()) {
        Alert.alert(language === 'es' ? `La actividad ${activity.id} está vacía` : `Activity ${activity.id} is empty`);
        return false;
      }
    }
    for (const indicator of indicators) {
      if (!indicator.description.trim() || isNaN(indicator.beneficiaries)) {
        Alert.alert(language === 'es' ? `El indicador ${indicator.id} está incompleto` : `Indicator ${indicator.id} is incomplete`);
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
          indicators: indicators.map(i => ({ description: i.description, beneficiaries: i.beneficiaries })),
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

  const handleAddIndicator = () => {
    setIndicators([...indicators, { id: indicators.length + 1, description: '', beneficiaries: '' }]);
  };

  const handleActivityChange = (text, id) => {
    const newActivities = activities.map(item => 
      item.id === id ? { ...item, activity: text } : item
    );
    setActivities(newActivities);
  };

  const handleIndicatorChange = (text, id, field) => {
    const newIndicators = indicators.map(item => 
      item.id === id ? { ...item, [field]: text } : item
    );
    setIndicators(newIndicators);
  };

  const confirmDeleteActivity = (id) => {
    Alert.alert(
      language === 'es' ? 'Eliminar actividad' : 'Delete Activity',
      language === 'es' ? '¿Está seguro de que desea eliminar esta actividad?' : 'Are you sure you want to delete this activity?',
      [
        { text: language === 'es' ? 'Cancelar' : 'Cancel', style: 'cancel' },
        { text: language === 'es' ? 'Eliminar' : 'Delete', onPress: () => handleDeleteActivity(id) }
      ]
    );
  };

  const confirmDeleteIndicator = (id) => {
    Alert.alert(
      language === 'es' ? 'Eliminar indicador' : 'Delete Indicator',
      language === 'es' ? '¿Está seguro de que desea eliminar este indicador?' : 'Are you sure you want to delete this indicator?',
      [
        { text: language === 'es' ? 'Cancelar' : 'Cancel', style: 'cancel' },
        { text: language === 'es' ? 'Eliminar' : 'Delete', onPress: () => handleDeleteIndicator(id) }
      ]
    );
  };

  const handleDeleteActivity = (id) => {
    setActivities(activities.filter(item => item.id !== id));
  };

  const handleDeleteIndicator = (id) => {
    setIndicators(indicators.filter(item => item.id !== id));
  };

  const handleEditIndicator = (id) => {
    Alert.alert(language === 'es' ? `Editar indicador ${id}` : `Edit Indicator ${id}`);
    // Lógica para editar si es necesario
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
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="edit" size={24} color="#67A6F2" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => confirmDeleteActivity(id)} style={styles.iconButton}>
            <Icon name="delete" size={24} color="#F28C32" />
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity style={styles.button} onPress={handleAddActivity}>
        <Text style={styles.buttonText}>
          {language === 'es' ? "Agregar actividad" : "Add Activity"}
        </Text>
      </TouchableOpacity>

      {/* Sección de Indicadores */}
      <Text style={styles.sectionTitle}>{language === 'es' ? 'Indicadores' : 'Indicators'}</Text>
      {indicators.map(({ id, description, beneficiaries }) => (
        <View key={id} style={styles.indicatorContainer}>
          <TextInput
            style={styles.indicatorInput}
            placeholder={language === 'es' ? `Descripción del indicador ${id}` : `Indicator Description ${id}`}
            value={description}
            onChangeText={(text) => handleIndicatorChange(text, id, 'description')}
            placeholderTextColor="#B0B0B0"
          />
          <TextInput
            style={styles.beneficiariesInput}
            placeholder={language === 'es' ? "Número de beneficiarios" : "Number of Beneficiaries"}
            value={beneficiaries}
            onChangeText={(text) => handleIndicatorChange(text, id, 'beneficiaries')}
            keyboardType="numeric"
            placeholderTextColor="#B0B0B0"
          />
          <TouchableOpacity onPress={() => handleEditIndicator(id)} style={styles.iconButton}>
            <Icon name="edit" size={24} color="#67A6F2" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => confirmDeleteIndicator(id)} style={styles.iconButton}>
            <Icon name="delete" size={24} color="#F28C32" />
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity style={styles.button} onPress={handleAddIndicator}>
        <Text style={styles.buttonText}>
          {language === 'es' ? "Agregar indicador" : "Add Indicator"}
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
