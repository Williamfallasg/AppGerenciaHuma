import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert, ActivityIndicator } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { useLanguage } from '../context/LanguageContext';
import { firestore } from '../firebase/firebase';
import { collection, query, where, getDocs, setDoc, addDoc, onSnapshot } from 'firebase/firestore';
import { useWindowDimensions } from 'react-native';
import { useFamily } from '../context/FamilyContext';
import styles from '../styles/stylesRegisterUser';

const RegisterUser = () => {
  const { language } = useLanguage();
  const [userData, setUserData] = useState({
    userID: '',
    idType: '',
    name: '',
    gender: '',
    birthDate: '',
    age: '',
    countries: [],  // Cambiado a una lista para soportar múltiples países
    province: '',
    canton: '',
    district: '',
    phone: '',
    projects: [],
    medicalCondition: '',
    activities: [],
  });

  const [qrValue, setQrValue] = useState('');
  const [isUserValid, setIsUserValid] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [showSummary, setShowSummary] = useState(false);
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const { familyMembers, setFamilyMembers } = useFamily();

  // Lista de países
  const countriesSpanish = [
    'Afganistán', 'Albania', 'Alemania', 'Andorra', 'Angola', 'Antigua y Barbuda', 'Arabia Saudita',
    'Argelia', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaiyán', 'Bahamas', 'Bangladés',
    // Más países...
  ];

  const countriesEnglish = [
    'Afghanistan', 'Albania', 'Germany', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Saudi Arabia',
    'Algeria', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bangladesh',
    // Más países...
  ];

  const selectedCountries = language === 'es' ? countriesSpanish : countriesEnglish;

  useEffect(() => {
    // Obtener proyectos desde Firestore
    const unsubscribeProjects = onSnapshot(collection(firestore, "projects"), (snapshot) => {
      try {
        setLoadingProjects(true);
        const projectsList = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            label: data?.projectName || 'Nombre no disponible',
            value: doc.id,
            activities: data?.activities || [],
          };
        });
        setProjects(projectsList);
      } catch (error) {
        console.error("Error fetching projects: ", error);
        Alert.alert(language === 'es' ? 'Error al obtener proyectos' : 'Error fetching projects');
      } finally {
        setLoadingProjects(false);
      }
    });

    return () => {
      unsubscribeProjects();
    };
  }, []);

  const handleInputChange = async (field, value) => {
    const updatedUserData = { ...userData, [field]: value };
    setUserData(updatedUserData);

    // Si el campo cambiado es el userID, intentamos obtener los datos del usuario registrado
    if (field === 'userID' && value) {
      try {
        const userQuery = query(collection(firestore, "users"), where("userID", "==", value));
        const querySnapshot = await getDocs(userQuery);

        if (!querySnapshot.empty && querySnapshot.docs.length > 0) {
          const userDoc = querySnapshot.docs[0];
          const userDataFromFirestore = userDoc.exists() ? userDoc.data() : null;

          if (userDataFromFirestore) {
            setUserData(prevData => ({
              ...prevData,
              ...userDataFromFirestore,
            }));
            setIsUserValid(true);

            // Limpiar los campos de ubicación y detalles del proyecto
            clearLocationAndProjectFields();
          } else {
            setIsUserValid(false);
          }
        } else {
          setUserData({ ...userData, userID: value });
          setIsUserValid(false);
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
        Alert.alert(language === 'es' ? 'Error al obtener datos del usuario' : 'Error fetching user data');
      }
    }
  };

  const clearLocationAndProjectFields = () => {
    setUserData(prevData => ({
      ...prevData,
      province: '',
      canton: '',
      district: '',
      projects: [],
      activities: [],
    }));
    setFilteredActivities([]);
  };

  const handleCountrySelection = (value) => {
    setUserData(prevData => ({
      ...prevData,
      countries: Array.from(new Set([...prevData.countries, value])),  // Agregar país sin duplicados
    }));
  };

  const handleProjectSelection = (value) => {
    setUserData(prevData => ({
      ...prevData,
      projects: Array.from(new Set([...prevData.projects, value])),  // Agregar proyecto sin duplicados
    }));

    // Filtrar actividades del proyecto seleccionado
    const selectedProject = projects.find((project) => project.value === value);
    if (selectedProject) {
      setFilteredActivities(selectedProject.activities.map(activity => activity.activity || 'Actividad no disponible'));
    } else {
      setFilteredActivities([]);
    }
  };

  const handleActivitySelection = (value) => {
    setUserData(prevData => ({
      ...prevData,
      activities: Array.from(new Set([...prevData.activities, value])),  // Agregar actividad sin duplicados
    }));
  };

  const validateFields = () => {
    let isValid = true;
    let missingFields = [];

    // Validar campos obligatorios
    for (const field in userData) {
      if (userData.hasOwnProperty(field)) {
        if (Array.isArray(userData[field]) && userData[field].length === 0) {
          missingFields.push(field);
          isValid = false;
        } else if (typeof userData[field] === 'string' && userData[field] === '') {
          missingFields.push(field);
          isValid = false;
        }
      }
    }

    if (!isValid) {
      Alert.alert(
        language === 'es' ? 'Campos obligatorios' : 'Missing Fields',
        language === 'es' ? `Por favor, complete todos los campos: ${missingFields.join(', ')}` : `Please fill in all fields: ${missingFields.join(', ')}`
      );
    }

    return isValid;
  };

  const handleSave = async () => {
    setFormSubmitted(true);

    if (!validateFields()) {
      return;
    }

    try {
      const userQuery = query(collection(firestore, "users"), where("userID", "==", userData.userID));
      const querySnapshot = await getDocs(userQuery);

      if (!querySnapshot.empty) {
        // Usuario encontrado, actualizar su información agregando nueva información de ubicación y proyecto
        const userDocRef = querySnapshot.docs[0].ref;
        const existingData = querySnapshot.docs[0].data();

        // Fusionar datos existentes con la nueva información (sin duplicar entradas)
        const updatedData = {
          ...existingData,
          countries: Array.from(new Set([...(existingData.countries || []), ...(userData.countries || [])])),
          province: userData.province || existingData.province,
          canton: userData.canton || existingData.canton,
          district: userData.district || existingData.district,
          projects: Array.from(new Set([...(existingData.projects || []), ...(userData.projects || [])])),
          activities: Array.from(new Set([...(existingData.activities || []), ...(userData.activities || [])])),
        };

        await setDoc(userDocRef, updatedData, { merge: true });
        Alert.alert(language === 'es' ? 'Datos actualizados' : 'Data updated', language === 'es' ? 'Datos actualizados exitosamente.' : 'Data updated successfully.');
      } else {
        // Añadir un nuevo documento si el usuario no está registrado
        await addDoc(collection(firestore, "users"), userData);
        Alert.alert(language === 'es' ? 'Datos guardados' : 'Data saved', language === 'es' ? 'Datos guardados exitosamente.' : 'Data saved successfully.');
      }

      setQrValue(userData.userID);
      setShowSummary(true); // Mostrar el resumen de los datos después de guardar
    } catch (error) {
      console.error("Error saving user data: ", error);
      Alert.alert(language === 'es' ? 'Error al guardar datos' : 'Error saving data');
    }
  };

  const handleFamilyNavigation = () => {
    if (!isUserValid) {
      Alert.alert(
        language === 'es' ? 'Error' : 'Error',
        language === 'es' ? 'Complete todos los datos del usuario antes de añadir un familiar' : 'Complete all user data before adding a family member'
      );
      return;
    }

    // Navegar a la pantalla de añadir familiar
    navigation.navigate('FamilyScreen');
  };

  return (
    <ScrollView contentContainerStyle={styles.container(width)}>
      <Image source={require('../assets/image.png')} style={styles.logo(width)} />

      {/* Sección: Datos del Usuario */}
      <Text style={styles.sectionTitle}>{language === 'es' ? 'Datos del Usuario' : 'User Information'}</Text>
      <View style={styles.sectionContainer}>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={userData.idType}
            style={styles.picker}
            onValueChange={(value) => handleInputChange('idType', value)}
            itemStyle={styles.pickerItem}
          >
            <Picker.Item label={language === 'es' ? "Seleccione tipo de identificación" : "Select ID Type"} value="" />
            <Picker.Item label={language === 'es' ? "Cédula" : "ID Card"} value="ID Card" />
            <Picker.Item label={language === 'es' ? "Pasaporte" : "Passport"} value="Passport" />
          </Picker>
        </View>

        <TextInput
          style={styles.input(width)}
          placeholder={language === 'es' ? "ID de usuario" : "User ID"}
          value={userData.userID}
          onChangeText={(value) => handleInputChange('userID', value)}
          placeholderTextColor="#B0B0B0"
        />

        <TextInput
          style={styles.input(width)}
          placeholder={language === 'es' ? "Nombre completo" : "Full name"}
          value={userData.name}
          onChangeText={(value) => handleInputChange('name', value)}
          placeholderTextColor="#B0B0B0"
        />

        {/* Picker para género */}
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={userData.gender}
            style={styles.picker}
            onValueChange={(value) => handleInputChange('gender', value)}
            itemStyle={styles.pickerItem}
          >
            <Picker.Item label={language === 'es' ? "Seleccione un sexo" : "Select a sex"} value="" />
            <Picker.Item label={language === 'es' ? "Masculino" : "Male"} value="Male" />
            <Picker.Item label={language === 'es' ? "Femenino" : "Female"} value="Female" />
          </Picker>
        </View>

        <TextInput
          style={styles.input(width)}
          placeholder={language === 'es' ? "Fecha de nacimiento (dd/mm/yyyy)" : "Birth Date (dd/mm/yyyy)"}
          value={userData.birthDate}
          onChangeText={(value) => handleInputChange('birthDate', value)}
          keyboardType="numeric"
          placeholderTextColor="#B0B0B0"
          maxLength={10}
        />

        <TextInput
          style={styles.input(width)}
          placeholder={language === 'es' ? "Edad" : "Age"}
          value={userData.age}
          onChangeText={(value) => handleInputChange('age', value)}
          keyboardType="numeric"
          placeholderTextColor="#B0B0B0"
        />

        <TextInput
          style={styles.input(width)}
          placeholder={language === 'es' ? "Celular" : "Phone"}
          value={userData.phone}
          onChangeText={(value) => handleInputChange('phone', value)}
          keyboardType="phone-pad"
          placeholderTextColor="#B0B0B0"
        />

        <TextInput
          style={styles.input(width)}
          placeholder={language === 'es' ? "Condición Médica" : "Medical Condition"}
          value={userData.medicalCondition}
          onChangeText={(value) => handleInputChange('medicalCondition', value)}
          placeholderTextColor="#B0B0B0"
        />
      </View>

      {/* Sección: Ubicación del Usuario */}
      <Text style={styles.sectionTitle}>{language === 'es' ? 'Ubicación del Usuario' : 'User Location'}</Text>
      <View style={styles.sectionContainer}>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={userData.countries[userData.countries.length - 1] || ''}
            style={styles.picker}
            onValueChange={(value) => handleCountrySelection(value)}
            itemStyle={styles.pickerItem}
          >
            <Picker.Item label={language === 'es' ? "Seleccione un país" : "Select a country"} value="" />
            {selectedCountries.map((country, index) => (
              <Picker.Item key={index} label={country} value={country} />
            ))}
          </Picker>
        </View>

        <TextInput
          style={styles.input(width)}
          placeholder={language === 'es' ? "Provincia" : "Province"}
          value={userData.province}
          onChangeText={(value) => handleInputChange('province', value)}
          placeholderTextColor="#B0B0B0"
        />

        <TextInput
          style={styles.input(width)}
          placeholder={language === 'es' ? "Cantón" : "Canton"}
          value={userData.canton}
          onChangeText={(value) => handleInputChange('canton', value)}
          placeholderTextColor="#B0B0B0"
        />

        <TextInput
          style={styles.input(width)}
          placeholder={language === 'es' ? "Distrito" : "District"}
          value={userData.district}
          onChangeText={(value) => handleInputChange('district', value)}
          placeholderTextColor="#B0B0B0"
        />
      </View>

      {/* Sección: Detalles del Proyecto */}
      <Text style={styles.sectionTitle}>{language === 'es' ? 'Detalles del Proyecto' : 'Project Details'}</Text>
      <View style={styles.sectionContainer}>
        <View style={styles.pickerContainer}>
          {loadingProjects ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <Picker
              selectedValue={userData.projects[0] || ''}
              style={styles.picker}
              onValueChange={(value) => handleProjectSelection(value)}
              itemStyle={styles.pickerItem}
            >
              <Picker.Item label={language === 'es' ? "Seleccione un proyecto" : "Select a project"} value="" />
              {projects.map((project, index) => (
                <Picker.Item key={index} label={project.label} value={project.value} />
              ))}
            </Picker>
          )}
        </View>

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={userData.activities[0] || ''}
            style={styles.picker}
            onValueChange={(value) => handleActivitySelection(value)}
            itemStyle={styles.pickerItem}
          >
            <Picker.Item label={language === 'es' ? "Seleccione una actividad" : "Select an activity"} value="" />
            {filteredActivities.length > 0 ? (
              filteredActivities.map((activity, index) => (
                <Picker.Item key={index} label={activity} value={activity} />
              ))
            ) : (
              <Picker.Item label={language === 'es' ? "No hay actividades disponibles" : "No activities available"} value="" />
            )}
          </Picker>
        </View>
      </View>

      {/* Botones para acciones */}
      <TouchableOpacity style={styles.button(width)} onPress={handleSave}>
        <Text style={styles.buttonText}>
          {language === 'es' ? "Guardar" : "Save"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.addButton(width), !isUserValid && { backgroundColor: '#ccc' }]}
        onPress={handleFamilyNavigation}
        disabled={!isUserValid}
      >
        <Text style={styles.buttonText}>
          {language === 'es' ? "Añadir Familiar" : "Add Family Member"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.exitButton(width)} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.buttonText}>
          {language === 'es' ? "Salir" : "Exit"}
        </Text>
      </TouchableOpacity>

      {/* Mostrar el QR si existe */}
      {qrValue && (
        <View style={styles.qrContainer(width)}>
          <QRCode value={qrValue} size={width * 0.5} />
        </View>
      )}
    </ScrollView>
  );
};

export default RegisterUser;
