import React, { useState, useEffect } from 'react'; 
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { getDocs, collection, doc, setDoc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebase/firebase'; // Importar Firestore de la configuración
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from '../styles/stylesProjectForm'; // Importar el archivo de estilos
import { useNavigation } from '@react-navigation/native'; // Para la navegación
import { useLanguage } from '../context/LanguageContext'; // Contexto de idioma
import { useUserRole } from '../context/UserRoleContext'; // Contexto del rol del usuario

const ProjectForm = () => {
  const navigation = useNavigation();
  const { language } = useLanguage(); 
  const { userRole } = useUserRole(); 

  const [projectID, setProjectID] = useState('');
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectBudget, setProjectBudget] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activities, setActivities] = useState([{ id: 1, activity: '' }]);
  const [indicators, setIndicators] = useState([{ id: 1, description: '', beneficiaries: '', selectedOption: 'number' }]);
  const [programID, setProgramID] = useState(''); // Estado para vincular proyecto con programa
  const [availablePrograms, setAvailablePrograms] = useState([]); // Lista de programas disponibles

  useEffect(() => {
    if (userRole !== 'admin') {
      Alert.alert(
        language === 'es' ? 'Acceso Denegado' : 'Access Denied',
        language === 'es' ? 'No tienes permisos para acceder a esta sección' : 'You do not have permission to access this section',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Home'), 
          }
        ]
      );
    }
  }, [userRole, language, navigation]);

  useEffect(() => {
    fetchPrograms();
    // Formatear fechas al montar el componente
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear()}`;
    setStartDate(formattedDate);
    setEndDate(formattedDate);
  }, []);

  const fetchPrograms = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, 'programs'));
      const programs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAvailablePrograms(programs);
    } catch (error) {
      console.error("Error fetching programs:", error);
    }
  };

  const handleSave = async () => {
    try {
      if (!projectID || !projectName || !programID) {
        Alert.alert(language === 'es' ? 'Error' : 'Error', language === 'es' ? 'Por favor, completa todos los campos obligatorios' : 'Please fill out all required fields');
        return;
      }

      await setDoc(doc(firestore, 'projects', projectID), {
        projectName,
        projectDescription,
        projectBudget,
        startDate,
        endDate,
        programID,
        activities,
        indicators,
      });

      const programRef = doc(firestore, 'programs', programID);
      const programSnap = await getDoc(programRef);
      if (programSnap.exists()) {
        const programData = programSnap.data();
        const updatedProjects = [...(programData.projects || []), projectID];
        await setDoc(programRef, { ...programData, projects: updatedProjects }, { merge: true });
      }

      Alert.alert(language === 'es' ? 'Guardado exitoso' : 'Saved successfully');
    } catch (error) {
      console.error("Error saving project:", error);
      Alert.alert(language === 'es' ? 'Error' : 'Error', language === 'es' ? 'Hubo un error al guardar el proyecto' : 'There was an error saving the project');
    }
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

  const handleDeleteActivity = (id) => {
    setActivities(activities.filter(item => item.id !== id));
  };

  const handleAddIndicator = () => {
    setIndicators([...indicators, { id: indicators.length + 1, description: '', beneficiaries: '', selectedOption: 'number' }]);
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

  const handleDeleteIndicator = (id) => {
    setIndicators(indicators.filter(item => item.id !== id));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require('../assets/image.png')}
        style={styles.logo}
      />

      <Text style={styles.sectionTitle}>
        {language === 'es' ? 'Seleccionar Programa' : 'Select Program'}
      </Text>
      <View style={styles.selectContainer}>
        {availablePrograms.length > 0 ? (
          availablePrograms.map((program) => (
            <TouchableOpacity 
              key={program.id} 
              onPress={() => setProgramID(program.id)}
              style={programID === program.id ? styles.selected : styles.option} // Aplicar estilo condicional
            >
              <Text style={styles.optionText}>{program.programName}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text>{language === 'es' ? 'No hay programas disponibles' : 'No programs available'}</Text>
        )}
      </View>

      <TextInput
        style={styles.input}
        placeholder={language === 'es' ? 'ID del proyecto' : 'Project ID'}
        value={projectID}
        onChangeText={setProjectID}
      />
      
      <TextInput
        style={styles.input}
        placeholder={language === 'es' ? 'Nombre del proyecto' : 'Project Name'}
        value={projectName}
        onChangeText={setProjectName}
      />

      <TextInput
        style={styles.input}
        placeholder={language === 'es' ? 'Descripción del proyecto' : 'Project Description'}
        value={projectDescription}
        onChangeText={setProjectDescription}
      />
      
      <TextInput
        style={styles.input}
        placeholder={language === 'es' ? 'Presupuesto del proyecto' : 'Project Budget'}
        value={projectBudget}
        onChangeText={setProjectBudget}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder={language === 'es' ? 'Fecha de inicio (dd/mm/yyyy)' : 'Start Date (dd/mm/yyyy)'}
        value={startDate}
        onChangeText={setStartDate}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder={language === 'es' ? 'Fecha de fin (dd/mm/yyyy)' : 'End Date (dd/mm/yyyy)'}
        value={endDate}
        onChangeText={setEndDate}
        keyboardType="numeric"
      />

      <Text style={styles.sectionTitle}>
        {language === 'es' ? 'Actividades' : 'Activities'}
      </Text>
      {activities.map(({ id, activity }) => (
        <View key={id} style={styles.card}>
          <TextInput
            style={styles.activityInput}
            placeholder={language === 'es' ? `Actividad ${id}` : `Activity ${id}`}
            value={activity}
            onChangeText={(text) => handleActivityChange(text, id)}
          />
          <TouchableOpacity onPress={() => handleDeleteActivity(id)} style={styles.iconButton}>
            <Icon name="delete" size={24} color="#F28C32" />
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity style={styles.addButton} onPress={handleAddActivity}>
        <Icon name="add" size={24} color="#FFFFFF" />
        <Text style={styles.addButtonText}>
          {language === 'es' ? 'Agregar actividad' : 'Add Activity'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>
        {language === 'es' ? 'Indicadores' : 'Indicators'}
      </Text>
      {indicators.map(({ id, description, beneficiaries, selectedOption }) => (
        <View key={id} style={styles.card}>
          <TextInput
            style={styles.indicatorInput}
            placeholder={language === 'es' ? `Descripción del indicador ${id}` : `Indicator Description ${id}`}
            value={description}
            onChangeText={(text) => handleIndicatorChange(text, id, 'description')}
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
              placeholder={language === 'es' ? 'Número de beneficiarios' : 'Number of Beneficiaries'}
              value={beneficiaries}
              onChangeText={(text) => handleIndicatorChange(text, id, 'beneficiaries')}
              keyboardType="numeric"
            />
          ) : (
            <TextInput
              style={styles.beneficiariesInput}
              placeholder={language === 'es' ? 'Porcentaje de beneficiarios' : 'Percentage of Beneficiaries'}
              value={`${beneficiaries}%`}
              onChangeText={(text) => handleIndicatorChange(text.replace('%', ''), id, 'beneficiaries')}
              keyboardType="numeric"
            />
          )}

          <TouchableOpacity onPress={() => handleDeleteIndicator(id)} style={styles.iconButton}>
            <Icon name="delete" size={24} color="#F28C32" />
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity style={styles.addButton} onPress={handleAddIndicator}>
        <Icon name="add" size={24} color="#FFFFFF" />
        <Text style={styles.addButtonText}>
          {language === 'es' ? 'Agregar indicador' : 'Add Indicator'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>
          {language === 'es' ? 'Guardar' : 'Save'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.exitButton]} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.buttonText}>
          {language === 'es' ? 'Salir' : 'Exit'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ProjectForm;
