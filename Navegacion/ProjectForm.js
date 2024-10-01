import React, { useState, useEffect } from 'react'; 
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { getDocs, collection, doc, setDoc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebase/firebase'; // Importar Firestore de la configuración
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from '../styles/stylesProjectForm'; // Importar el archivo de estilos
import { useNavigation } from '@react-navigation/native'; // Para la navegación
import { useLanguage } from '../context/LanguageContext'; // Contexto de idioma
import { useUserRole } from '../context/UserRoleContext'; // Contexto del rol del usuario
import { Picker } from '@react-native-picker/picker'; // Importar Picker desde el paquete correcto

const ProjectForm = () => {
  const navigation = useNavigation();
  const { language } = useLanguage(); 
  const { userRole } = useUserRole(); 

  const [projectID, setProjectID] = useState('');
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectBudget, setProjectBudget] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('USD'); // Estado para la moneda seleccionada
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activities, setActivities] = useState([{ id: 1, activity: '' }]);
  const [indicators, setIndicators] = useState([{ id: 1, description: '', beneficiaries: '', selectedOption: 'number' }]);
  const [programID, setProgramID] = useState(''); // Estado para vincular proyecto con programa
  const [availablePrograms, setAvailablePrograms] = useState([]); // Lista de programas disponibles

  const currencySymbols = {
    USD: '$',
    MXN: 'MX$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    CAD: 'CA$',
    AUD: 'A$',
    CHF: 'CHF',
    CNY: '¥',
    INR: '₹',
    CRC: '₡',
    NIO: 'C$',
    SVC: '₡',
    PAB: 'B/.',
    GTQ: 'Q'
  };

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

  const clearForm = () => {
    setProjectID('');
    setProjectName('');
    setProjectDescription('');
    setProjectBudget('');
    setSelectedCurrency('USD'); // Limpiar moneda seleccionada
    setStartDate('');
    setEndDate('');
    setActivities([{ id: 1, activity: '' }]);
    setIndicators([{ id: 1, description: '', beneficiaries: '', selectedOption: 'number' }]);
    setProgramID('');
  };

  const handleSave = async () => {
    if (!validateDate(startDate) || !validateDate(endDate)) {
      Alert.alert(language === 'es' ? 'Error' : 'Error', language === 'es' ? 'Las fechas ingresadas no son válidas' : 'The entered dates are not valid');
      return;
    }

    try {
      if (!projectID || !projectName || !programID) {
        Alert.alert(language === 'es' ? 'Error' : 'Error', language === 'es' ? 'Por favor, completa todos los campos obligatorios' : 'Please fill out all required fields');
        return;
      }

      await setDoc(doc(firestore, 'projects', projectID), {
        projectName,
        projectDescription,
        projectBudget: `${currencySymbols[selectedCurrency]} ${projectBudget}`, // Guardar el presupuesto con la moneda seleccionada
        selectedCurrency,
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
      clearForm(); // Limpiar los campos después de guardar
    } catch (error) {
      console.error("Error saving project:", error);
      Alert.alert(language === 'es' ? 'Error' : 'Error', language === 'es' ? 'Hubo un error al guardar el proyecto' : 'There was an error saving the project');
    }
  };

  const handleEditProject = async () => {
    try {
      if (!projectID) {
        Alert.alert(language === 'es' ? 'Error' : 'Error', language === 'es' ? 'Por favor, ingresa el ID del proyecto' : 'Please enter the Project ID');
        return;
      }

      const projectRef = doc(firestore, 'projects', projectID);
      const projectSnap = await getDoc(projectRef);

      if (projectSnap.exists()) {
        const projectData = projectSnap.data();
        setProjectName(projectData.projectName);
        setProjectDescription(projectData.projectDescription);
        setProjectBudget(projectData.projectBudget.replace(/[^0-9.]/g, '')); // Remover símbolo de moneda
        setSelectedCurrency(projectData.selectedCurrency);
        setStartDate(projectData.startDate);
        setEndDate(projectData.endDate);
        setProgramID(projectData.programID);
        setActivities(projectData.activities || []);
        setIndicators(projectData.indicators || []);

        Alert.alert(language === 'es' ? 'Proyecto cargado para edición' : 'Project loaded for editing');
      } else {
        Alert.alert(language === 'es' ? 'Error' : 'Error', language === 'es' ? 'El proyecto no existe' : 'The project does not exist');
      }
    } catch (error) {
      console.error("Error fetching project:", error);
      Alert.alert(language === 'es' ? 'Error' : 'Error', language === 'es' ? 'Hubo un error al obtener el proyecto' : 'There was an error fetching the project');
    }
  };

  // Función para formatear la fecha e insertar '/' automáticamente
  const formatDate = (text) => {
    let cleaned = text.replace(/[^0-9]/g, ''); // Elimina cualquier caracter que no sea un número
    let formattedText = '';

    if (cleaned.length >= 1) formattedText += cleaned.substring(0, 2);
    if (cleaned.length >= 3) formattedText += '/' + cleaned.substring(2, 4);
    if (cleaned.length >= 5) formattedText += '/' + cleaned.substring(4, 8);

    return formattedText;
  };

  // Función para validar la fecha
  const validateDate = (date) => {
    const datePattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = date.match(datePattern);

    if (!match) return false;

    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);

    if (day < 1 || day > 31) return false;
    if (month < 1 || month > 12) return false;
    if (year < 1000 || year > 9999) return false;

    // Verificar días máximos por mes (sin considerar años bisiestos en este simple ejemplo)
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (day > daysInMonth[month - 1]) return false;

    return true;
  };

  // Gestión de Actividades
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

  // Gestión de Indicadores
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

      {/* Selector de moneda */}
      <View style={[styles.input, { justifyContent: 'center' }]}>
        <Picker
          selectedValue={selectedCurrency}
          style={{ height: '100%', width: '100%' }}
          onValueChange={(itemValue) => setSelectedCurrency(itemValue)}
        >
          {Object.entries(currencySymbols).map(([key, value]) => (
            <Picker.Item key={key} label={`${key} - ${value}`} value={key} />
          ))}
        </Picker>
      </View>

      {/* Input del presupuesto con moneda */}
      <View style={styles.input}>
        <TextInput
          style={{ flex: 1 }}
          placeholder={language === 'es' ? 'Presupuesto del proyecto' : 'Project Budget'}
          value={projectBudget}
          onChangeText={(text) => setProjectBudget(text.replace(/[^0-9]/g, ''))} // Evita caracteres no numéricos
          keyboardType="numeric"
        />
      </View>

      <TextInput
        style={styles.input}
        placeholder={language === 'es' ? 'Fecha de inicio (dd/mm/yyyy)' : 'Start Date (dd/mm/yyyy)'}
        value={startDate}
        onChangeText={(text) => setStartDate(formatDate(text))}
        keyboardType="numeric"
        maxLength={10}
      />

      <TextInput
        style={styles.input}
        placeholder={language === 'es' ? 'Fecha de fin (dd/mm/yyyy)' : 'End Date (dd/mm/yyyy)'}
        value={endDate}
        onChangeText={(text) => setEndDate(formatDate(text))}
        keyboardType="numeric"
        maxLength={10}
      />

      {/* Sección para gestionar actividades */}
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

      {/* Sección para gestionar indicadores */}
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

          <TextInput
            style={styles.beneficiariesInput}
            placeholder={language === 'es' ? (selectedOption === 'number' ? 'Número de beneficiarios' : 'Porcentaje de beneficiarios') : (selectedOption === 'number' ? 'Number of Beneficiaries' : 'Percentage of Beneficiaries')}
            value={beneficiaries}
            onChangeText={(text) => handleIndicatorChange(text.replace('%', ''), id, 'beneficiaries')}
            keyboardType="numeric"
          />

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

      {/* Botón para guardar el proyecto */}
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>
          {language === 'es' ? 'Guardar' : 'Save'}
        </Text>
      </TouchableOpacity>

      {/* Botón para editar el proyecto */}
      <TouchableOpacity style={styles.button} onPress={handleEditProject}>
        <Text style={styles.buttonText}>
          {language === 'es' ? 'Editar Proyecto' : 'Edit Project'}
        </Text>
      </TouchableOpacity>

      {/* Botón para salir */}
      <TouchableOpacity style={[styles.button, styles.exitButton]} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.buttonText}>
          {language === 'es' ? 'Salir' : 'Exit'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ProjectForm;
