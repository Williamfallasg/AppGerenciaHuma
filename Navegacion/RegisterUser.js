import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert, ActivityIndicator } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { useLanguage } from '../context/LanguageContext';
import { firestore } from '../firebase/firebase';
import { collection, query, where, getDocs, setDoc, doc, addDoc, onSnapshot } from 'firebase/firestore';
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
    country: '',
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
    'Barbados', 'Baréin', 'Bélgica', 'Belice', 'Benín', 'Bielorrusia', 'Birmania', 'Bolivia', 'Bosnia y Herzegovina',
    'Botsuana', 'Brasil', 'Brunéi', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Bután', 'Cabo Verde', 'Camboya',
    'Camerún', 'Canadá', 'Catar', 'Chad', 'Chile', 'China', 'Chipre', 'Colombia', 'Comoras', 'Corea del Norte',
    'Corea del Sur', 'Costa de Marfil', 'Costa Rica', 'Croacia', 'Cuba', 'Dinamarca', 'Dominica', 'Ecuador',
    'Egipto', 'El Salvador', 'Emiratos Árabes Unidos', 'Eritrea', 'Eslovaquia', 'Eslovenia', 'España',
    'Estados Unidos', 'Estonia', 'Esuatini', 'Etiopía', 'Filipinas', 'Finlandia', 'Fiyi', 'Francia',
    'Gabón', 'Gambia', 'Georgia', 'Ghana', 'Granada', 'Grecia', 'Guatemala', 'Guinea', 'Guinea-Bisáu',
    'Guinea Ecuatorial', 'Guyana', 'Haití', 'Honduras', 'Hungría', 'India', 'Indonesia', 'Irak', 'Irán',
    'Irlanda', 'Islandia', 'Islas Marshall', 'Islas Salomón', 'Israel', 'Italia', 'Jamaica', 'Japón',
    'Jordania', 'Kazajistán', 'Kenia', 'Kirguistán', 'Kiribati', 'Kuwait', 'Laos', 'Lesoto', 'Letonia',
    'Líbano', 'Liberia', 'Libia', 'Liechtenstein', 'Lituania', 'Luxemburgo', 'Macedonia del Norte',
    'Madagascar', 'Malasia', 'Malaui', 'Maldivas', 'Malí', 'Malta', 'Marruecos', 'Mauricio', 'Mauritania',
    'México', 'Micronesia', 'Moldavia', 'Mónaco', 'Mongolia', 'Montenegro', 'Mozambique', 'Namibia',
    'Nauru', 'Nepal', 'Nicaragua', 'Níger', 'Nigeria', 'Noruega', 'Nueva Zelanda', 'Omán', 'Países Bajos',
    'Pakistán', 'Palaos', 'Panamá', 'Papúa Nueva Guinea', 'Paraguay', 'Perú', 'Polonia', 'Portugal',
    'Reino Unido', 'República Centroafricana', 'República Checa', 'República Democrática del Congo',
    'República Dominicana', 'Ruanda', 'Rumania', 'Rusia', 'Samoa', 'San Cristóbal y Nieves', 'San Marino',
    'San Vicente y las Granadinas', 'Santa Lucía', 'Santo Tomé y Príncipe', 'Senegal', 'Serbia',
    'Seychelles', 'Sierra Leona', 'Singapur', 'Siria', 'Somalia', 'Sri Lanka', 'Sudáfrica',
    'Sudán', 'Sudán del Sur', 'Suecia', 'Suiza', 'Surinam', 'Tailandia', 'Tanzania', 'Tayikistán',
    'Timor Oriental', 'Togo', 'Tonga', 'Trinidad y Tobago', 'Túnez', 'Turkmenistán', 'Turquía',
    'Tuvalu', 'Ucrania', 'Uganda', 'Uruguay', 'Uzbekistán', 'Vanuatu', 'Venezuela', 'Vietnam',
    'Yemen', 'Yibuti', 'Zambia', 'Zimbabue'
  ];

  const countriesEnglish = [
    'Afghanistan', 'Albania', 'Germany', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Saudi Arabia',
    'Algeria', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bangladesh',
    'Barbados', 'Bahrain', 'Belgium', 'Belize', 'Benin', 'Belarus', 'Myanmar', 'Bolivia', 'Bosnia and Herzegovina',
    'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Bhutan', 'Cape Verde', 'Cambodia',
    'Cameroon', 'Canada', 'Qatar', 'Chad', 'Chile', 'China', 'Cyprus', 'Colombia', 'Comoros', 'North Korea',
    'South Korea', 'Ivory Coast', 'Costa Rica', 'Croatia', 'Cuba', 'Denmark', 'Dominica', 'Ecuador',
    'Egypt', 'El Salvador', 'United Arab Emirates', 'Eritrea', 'Slovakia', 'Slovenia', 'Spain',
    'United States', 'Estonia', 'Eswatini', 'Ethiopia', 'Philippines', 'Finland', 'Fiji', 'France',
    'Gabon', 'Gambia', 'Georgia', 'Ghana', 'Grenada', 'Greece', 'Guatemala', 'Guinea', 'Guinea-Bissau',
    'Equatorial Guinea', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 'India', 'Indonesia', 'Iraq', 'Iran',
    'Ireland', 'Iceland', 'Marshall Islands', 'Solomon Islands', 'Israel', 'Italy', 'Jamaica', 'Japan',
    'Jordan', 'Kazakhstan', 'Kenya', 'Kyrgyzstan', 'Kiribati', 'Kuwait', 'Laos', 'Lesotho', 'Latvia',
    'Lebanon', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'North Macedonia',
    'Madagascar', 'Malaysia', 'Malawi', 'Maldives', 'Mali', 'Malta', 'Morocco', 'Mauritius', 'Mauritania',
    'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Mozambique', 'Namibia',
    'Nauru', 'Nepal', 'Nicaragua', 'Niger', 'Nigeria', 'Norway', 'New Zealand', 'Oman', 'Netherlands',
    'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Poland', 'Portugal',
    'United Kingdom', 'Central African Republic', 'Czech Republic', 'Democratic Republic of the Congo',
    'Dominican Republic', 'Rwanda', 'Romania', 'Russia', 'Samoa', 'Saint Kitts and Nevis', 'San Marino',
    'Saint Vincent and the Grenadines', 'Saint Lucia', 'Sao Tome and Principe', 'Senegal', 'Serbia',
    'Seychelles', 'Sierra Leone', 'Singapore', 'Syria', 'Somalia', 'Sri Lanka', 'South Africa',
    'Sudan', 'South Sudan', 'Sweden', 'Switzerland', 'Suriname', 'Thailand', 'Tanzania', 'Tajikistan',
    'East Timor', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkmenistan', 'Turkey',
    'Tuvalu', 'Ukraine', 'Uganda', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Venezuela', 'Vietnam',
    'Yemen', 'Djibouti', 'Zambia', 'Zimbabwe'
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

  const handleInputChange = (field, value) => {
    const updatedUserData = { ...userData, [field]: value };
    setUserData(updatedUserData);
  };

  const handleProjectSelection = (value) => {
    setUserData({
      ...userData,
      projects: [value],
    });

    // Filtrar actividades del proyecto seleccionado
    const selectedProject = projects.find((project) => project.value === value);
    if (selectedProject) {
      setFilteredActivities(selectedProject.activities.map(activity => activity.activity || 'Actividad no disponible'));
    } else {
      setFilteredActivities([]);
    }
  };

  const handleActivitySelection = (value) => {
    setUserData({
      ...userData,
      activities: [value],
    });
  };

  const validateFields = () => {
    let isValid = true;
    let missingFields = [];

    // Validar campos obligatorios
    for (const field in userData) {
      if (userData.hasOwnProperty(field)) {
        if (userData[field] === '' || userData[field].length === 0) {
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
        Alert.alert(
          language === 'es' ? 'Usuario ya registrado' : 'User already registered',
          language === 'es' ? 'El usuario con el mismo ID ya está registrado.' : 'User with the same ID is already registered.'
        );
        return;
      }

      await addDoc(collection(firestore, "users"), userData);
      Alert.alert(language === 'es' ? 'Datos guardados' : 'Data saved', language === 'es' ? 'Datos guardados exitosamente.' : 'Data saved successfully.');
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
            <Picker.Item label={language === 'es' ? "Seleccione género" : "Select Gender"} value="" />
            <Picker.Item label={language === 'es' ? "Masculino" : "Male"} value="Male" />
            <Picker.Item label={language === 'es' ? "Femenino" : "Female"} value="Female" />
            <Picker.Item label={language === 'es' ? "Otro" : "Other"} value="Other" />
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
            selectedValue={userData.country}
            style={styles.picker}
            onValueChange={(value) => handleInputChange('country', value)}
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
