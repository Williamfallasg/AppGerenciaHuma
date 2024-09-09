import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../context/LanguageContext';
import { firestore } from '../firebase/firebase1';
import { collection, addDoc } from 'firebase/firestore';
import { useUserRole } from '../context/UserRoleContext'; 
import styles from '../styles/stylesProgramForm';  // Importar los estilos

const ProgramForm = () => {
  const { language } = useLanguage();
  const navigation = useNavigation();
  const { userRole } = useUserRole(); 

  const [programID, setProgramID] = useState('');
  const [programName, setProgramName] = useState('');
  const [programDescription, setProgramDescription] = useState('');
  const [programBudget, setProgramBudget] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Verificar si el usuario es admin
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
    if (!dateRegex.test(date)) {
      return false;
    }
    const [day, month, year] = date.split('/').map(Number);
    const dateObj = new Date(year, month - 1, day);
    return dateObj.getDate() === day && dateObj.getMonth() === month - 1 && dateObj.getFullYear() === year;
  };

  const validateInputs = () => {
    if (!programID || !programName || !programDescription || !programBudget || !startDate || !endDate) {
      Alert.alert(language === 'es' ? 'Por favor, complete todos los campos' : 'Please fill in all fields');
      return false;
    }
    if (isNaN(programBudget)) {
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
    return true;
  };

  const handleSave = async () => {
    if (!validateInputs()) return;

    try {
      const docRef = await addDoc(collection(firestore, "programs"), {
        programID,
        programName,
        programDescription,
        programBudget,
        startDate,
        endDate,
      });
      console.log("Documento añadido con ID: ", docRef.id);
      Alert.alert(language === 'es' ? 'Guardado exitosamente' : 'Saved successfully');
    } catch (e) {
      console.error("Error al agregar documento: ", e);
      Alert.alert(language === 'es' ? 'Error al guardar' : 'Error saving');
    }
  };

  const handleGoHome = () => {
    navigation.navigate('Home');
  };

  const handleAddProject = () => {
    navigation.navigate('ProjectForm');  // Navegar a la página de ProjectForm.js
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require('../assets/image.png')} style={styles.logo} />
      
      <TextInput
        style={styles.input}
        placeholder={language === 'es' ? "ID del programa" : "Program ID"}
        value={programID}
        onChangeText={setProgramID}
        placeholderTextColor="#B0B0B0"
      />
      
      <TextInput
        style={styles.input}
        placeholder={language === 'es' ? "Nombre del programa" : "Program Name"}
        value={programName}
        onChangeText={setProgramName}
        placeholderTextColor="#B0B0B0"
      />
      
      <TextInput
        style={[styles.input, styles.multilineInput]}
        placeholder={language === 'es' ? "Descripción del programa" : "Program Description"}
        value={programDescription}
        onChangeText={setProgramDescription}
        placeholderTextColor="#B0B0B0"
        multiline={true}
      />
      
      <TextInput
        style={styles.input}
        placeholder={language === 'es' ? "Presupuesto del programa" : "Program Budget"}
        value={programBudget}
        onChangeText={setProgramBudget}
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
      
      <TouchableOpacity style={styles.addButton} onPress={handleAddProject}>
        <Text style={styles.buttontext1}>
          {language === 'es' ? 'Agregar proyecto' : 'Add Project'}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>
          {language === 'es' ? 'Guardar' : 'Save'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button1} onPress={handleGoHome}>
        <Text style={styles.buttonText}>
          {language === 'es' ? 'Salir' : 'Exit'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ProgramForm;
