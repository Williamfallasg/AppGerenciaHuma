import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Dimensions, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../context/LanguageContext';
import { firestore } from '../firebase/firebase1';
import { collection, addDoc } from 'firebase/firestore';
import { useUserRole } from '../context/UserRoleContext'; // Importar el contexto del rol del usuario

const { width, height } = Dimensions.get('window');

const ProgramForm = () => {
  const { language } = useLanguage();
  const navigation = useNavigation();
  const { userRole } = useUserRole(); // Obtener el rol del usuario

  const [programID, setProgramID] = useState('');
  const [programName, setProgramName] = useState('');
  const [programDescription, setProgramDescription] = useState('');
  const [programBudget, setProgramBudget] = useState('');
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

  const handleActivityChange = (index, value) => {
    const newActivities = [...activities];
    newActivities[index].activity = value;
    setActivities(newActivities);
  };

  const addActivity = () => {
    setActivities([...activities, { id: activities.length + 1, activity: '' }]);
  };

  const editActivity = (index, value) => {
    const newActivities = [...activities];
    newActivities[index].activity = value;
    setActivities(newActivities);
  };

  const deleteActivity = (index) => {
    const newActivities = activities.filter((_, i) => i !== index);
    setActivities(newActivities);
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
        activities,
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
      
      <Text style={styles.sectionTitle}>
        {language === 'es' ? 'Actividades' : 'Activities'}
      </Text>
      
      {activities.map((activity, index) => (
        <View key={index} style={styles.activityRow}>
          <TextInput
            style={styles.activityInput}
            placeholder={language === 'es' ? `Actividad ${index + 1}` : `Activity ${index + 1}`}
            value={activity.activity}
            onChangeText={(value) => handleActivityChange(index, value)}
            placeholderTextColor="#B0B0B0"
          />
          <TouchableOpacity onPress={() => editActivity(index, activity.activity)} style={styles.editButton}>
            <Text style={styles.buttonText}>
              {language === 'es' ? 'Editar' : 'Edit'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => deleteActivity(index)} style={styles.deleteButton}>
            <Text style={styles.buttonText}>
              {language === 'es' ? 'Eliminar' : 'Delete'}
            </Text>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity style={styles.addButton} onPress={addActivity}>
        <Text style={styles.addButtonText}>
          {language === 'es' ? 'Agregar actividad' : 'Add Activity'}
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

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#D3D3D3',
    alignItems: 'center',
    justifyContent: 'center',
    padding: width * 0.05,
  },
  logo: {
    width: width * 0.6,
    height: undefined,
    aspectRatio: 1,
    marginBottom: height * 0.05,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: height * 0.015,
    marginBottom: height * 0.025,
    width: '100%',
    fontSize: width * 0.04,
    height: height * 0.07,
  },
  multilineInput: {
    minHeight: height * 0.1,
  },
  sectionTitle: {
    fontSize: width * 0.045,
    color: 'black',
    marginBottom: height * 0.025,
    alignSelf: 'flex-start',
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.025,
    width: '100%',
  },
  activityInput: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: height * 0.015,
    fontSize: width * 0.04,
    marginRight: width * 0.02,
  },
  editButton: {
    backgroundColor: '#67A6F2',
    borderRadius: 8,
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.03,
  },
  deleteButton: {
    backgroundColor: '#F28C32',
    borderRadius: 8,
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.03,
    marginLeft: width * 0.02,
  },
  addButton: {
    backgroundColor: '#67A6F2',
    borderRadius: 8,
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.05,
    marginBottom: height * 0.04,
    alignItems: 'center',
    width: '100%',
  },
  addButtonText: {
    color: 'white',
    fontSize: width * 0.045,
  },
  button: {
    backgroundColor: '#67A6F2',
    borderRadius: 8,
    paddingVertical: height * 0.025,
    paddingHorizontal: width * 0.05,
    marginTop: height * 0.02,
    width: '100%',
    alignItems: 'center',
  },
  button1: {
    backgroundColor: '#F28C32',
    borderRadius: 8,
    paddingVertical: height * 0.025,
    paddingHorizontal: width * 0.05,
    marginTop: height * 0.02,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: width * 0.045,
    textAlign: 'center',
  },
});

export default ProgramForm;
