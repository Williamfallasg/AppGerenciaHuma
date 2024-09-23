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
  const [indicators, setIndicators] = useState([{ id: 1, description: '', beneficiaries: '', selectedOption: 'number' }]);

  useEffect(() => {
    if (userRole !== 'admin') {
      navigation.navigate('Home'); 
    }
  }, [userRole]);

  const handleSave = async () => {
    // Lógica de validación y guardado omitida por brevedad
  };

  const handleAddActivity = () => {
    setActivities([...activities, { id: activities.length + 1, activity: '' }]);
  };

  const handleAddIndicator = () => {
    setIndicators([...indicators, { id: indicators.length + 1, description: '', beneficiaries: '', selectedOption: 'number' }]);
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

  const handleOptionChange = (id, option) => {
    const updatedIndicators = indicators.map(item =>
      item.id === id ? { ...item, selectedOption: option } : item
    );
    setIndicators(updatedIndicators);
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
        onChangeText={setStartDate}
        placeholderTextColor="#B0B0B0"
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder={language === 'es' ? "Fecha de fin (dd/mm/yyyy)" : "End Date (dd/mm/yyyy)"}
        value={endDate}
        onChangeText={setEndDate}
        placeholderTextColor="#B0B0B0"
        keyboardType="numeric"
      />

      {/* Actividades */}
      <Text style={styles.sectionTitle}>{language === 'es' ? 'Actividades' : 'Activities'}</Text>
      {activities.map(({ id, activity }) => (
        <View key={id} style={styles.card}>
          <TextInput
            style={styles.activityInput}
            placeholder={language === 'es' ? `Actividad ${id}` : `Activity ${id}`}
            value={activity}
            onChangeText={(text) => handleActivityChange(text, id)}
            placeholderTextColor="#B0B0B0"
          />
          <TouchableOpacity onPress={() => confirmDeleteActivity(id)} style={styles.iconButton}>
            <Icon name="delete" size={24} color="#F28C32" />
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity style={styles.addButton} onPress={handleAddActivity}>
        <Icon name="add" size={24} color="#FFFFFF" />
        <Text style={styles.addButtonText}>{language === 'es' ? 'Agregar actividad' : 'Add Activity'}</Text>
      </TouchableOpacity>

      {/* Indicadores */}
      <Text style={styles.sectionTitle}>{language === 'es' ? 'Indicadores' : 'Indicators'}</Text>
      {indicators.map(({ id, description, beneficiaries, selectedOption }) => (
        <View key={id} style={styles.card}>
          <TextInput
            style={styles.indicatorInput}
            placeholder={language === 'es' ? `Descripción del indicador ${id}` : `Indicator Description ${id}`}
            value={description}
            onChangeText={(text) => handleIndicatorChange(text, id, 'description')}
            placeholderTextColor="#B0B0B0"
          />
          <View style={styles.radioButtonContainer}>
            <TouchableOpacity onPress={() => handleOptionChange(id, 'number')} style={styles.radioButton}>
              <View style={selectedOption === 'number' ? styles.radioSelected : styles.radioUnselected} />
              <Text>{language === 'es' ? 'Número de beneficiarios' : 'Number of Beneficiaries'}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleOptionChange(id, 'percentage')} style={styles.radioButton}>
              <View style={selectedOption === 'percentage' ? styles.radioSelected : styles.radioUnselected} />
              <Text>{language === 'es' ? 'Porcentaje de beneficiarios' : 'Percentage of Beneficiaries'}</Text>
            </TouchableOpacity>
          </View>

          {selectedOption === 'number' ? (
            <TextInput
              style={styles.beneficiariesInput}
              placeholder={language === 'es' ? "Número de beneficiarios" : "Number of Beneficiaries"}
              value={beneficiaries}
              onChangeText={(text) => handleIndicatorChange(text, id, 'beneficiaries')}
              keyboardType="numeric"
              placeholderTextColor="#B0B0B0"
            />
          ) : (
            <TextInput
              style={styles.beneficiariesInput}
              placeholder={language === 'es' ? "Porcentaje de beneficiarios" : "Percentage of Beneficiaries"}
              value={`${beneficiaries}%`}
              onChangeText={(text) => handleIndicatorChange(text.replace('%', ''), id, 'beneficiaries')}
              keyboardType="numeric"
              placeholderTextColor="#B0B0B0"
            />
          )}

          <TouchableOpacity onPress={() => confirmDeleteIndicator(id)} style={styles.iconButton}>
            <Icon name="delete" size={24} color="#F28C32" />
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity style={styles.addButton} onPress={handleAddIndicator}>
        <Icon name="add" size={24} color="#FFFFFF" />
        <Text style={styles.addButtonText}>{language === 'es' ? 'Agregar indicador' : 'Add Indicator'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>{language === 'es' ? "Guardar" : "Save"}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.exitButton]} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.buttonText}>{language === 'es' ? "Salir" : "Exit"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ProjectForm;
