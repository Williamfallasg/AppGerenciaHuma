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
    countries: [],
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
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const { familyMembers, setFamilyMembers } = useFamily();

  
     // Lista de países
     const countriesSpanish = [
      'Afganistán', 'Albania', 'Alemania', 'Andorra', 'Angola', 'Antigua y Barbuda', 'Arabia Saudita',
      'Argelia', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaiyán', 'Bahamas', 'Bangladés',
      'Barbados', 'Baréin', 'Bélgica', 'Belice', 'Benín', 'Bielorrusia', 'Birmania', 'Bolivia', 'Bosnia y Herzegovina',
      'Botsuana', 'Brasil', 'Brunéi', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Bután', 'Cabo Verde', 'Camboya',
      'Camerún', 'Canadá', 'Catar', 'Chad', 'Chile', 'China', 'Chipre', 'Ciudad del Vaticano', 'Colombia', 
      'Comoras', 'Corea del Norte', 'Corea del Sur', 'Costa de Marfil', 'Costa Rica', 'Croacia', 'Cuba', 
      'Dinamarca', 'Dominica', 'Ecuador', 'Egipto', 'El Salvador', 'Emiratos Árabes Unidos', 'Eritrea', 'Eslovaquia',
      'Eslovenia', 'España', 'Estados Unidos', 'Estonia', 'Esuatini', 'Etiopía', 'Filipinas', 'Finlandia', 'Fiyi',
      'Francia', 'Gabón', 'Gambia', 'Georgia', 'Ghana', 'Granada', 'Grecia', 'Guatemala', 'Guinea', 'Guinea-Bisáu',
      'Guinea Ecuatorial', 'Guyana', 'Haití', 'Honduras', 'Hungría', 'India', 'Indonesia', 'Irak', 'Irán', 'Irlanda',
      'Islandia', 'Islas Marshall', 'Islas Salomón', 'Israel', 'Italia', 'Jamaica', 'Japón', 'Jordania', 'Kazajistán',
      'Kenia', 'Kirguistán', 'Kiribati', 'Kosovo', 'Kuwait', 'Laos', 'Lesoto', 'Letonia', 'Líbano', 'Liberia', 'Libia',
      'Liechtenstein', 'Lituania', 'Luxemburgo', 'Madagascar', 'Malasia', 'Malaui', 'Maldivas', 'Malí', 'Malta',
      'Marruecos', 'Mauricio', 'Mauritania', 'México', 'Micronesia', 'Moldavia', 'Mónaco', 'Mongolia', 'Montenegro',
      'Mozambique', 'Namibia', 'Nauru', 'Nepal', 'Nicaragua', 'Níger', 'Nigeria', 'Noruega', 'Nueva Zelanda',
      'Omán', 'Países Bajos', 'Pakistán', 'Palaos', 'Panamá', 'Papúa Nueva Guinea', 'Paraguay', 'Perú', 'Polonia',
      'Portugal', 'Reino Unido', 'República Centroafricana', 'República Checa', 'República del Congo', 'República Democrática del Congo',
      'República Dominicana', 'Ruanda', 'Rumanía', 'Rusia', 'Samoa', 'San Cristóbal y Nieves', 'San Marino', 'San Vicente y las Granadinas',
      'Santa Lucía', 'Santo Tomé y Príncipe', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leona', 'Singapur', 'Siria', 'Somalia', 'Sri Lanka',
      'Sudáfrica', 'Sudán', 'Sudán del Sur', 'Suecia', 'Suiza', 'Surinam', 'Tailandia', 'Tanzania', 'Tayikistán', 'Timor Oriental', 
      'Togo', 'Tonga', 'Trinidad y Tobago', 'Túnez', 'Turkmenistán', 'Turquía', 'Tuvalu', 'Ucrania', 'Uganda', 'Uruguay', 'Uzbekistán',
      'Vanuatu', 'Venezuela', 'Vietnam', 'Yemen', 'Yibuti', 'Zambia', 'Zimbabue'
  ];
  
  const countriesEnglish = [
      'Afghanistan', 'Albania', 'Germany', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Saudi Arabia',
      'Algeria', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bangladesh',
      'Barbados', 'Bahrain', 'Belgium', 'Belize', 'Benin', 'Belarus', 'Myanmar', 'Bolivia', 'Bosnia and Herzegovina',
      'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Bhutan', 'Cape Verde', 'Cambodia',
      'Cameroon', 'Canada', 'Qatar', 'Chad', 'Chile', 'China', 'Cyprus', 'Vatican City', 'Colombia', 
      'Comoros', 'North Korea', 'South Korea', 'Ivory Coast', 'Costa Rica', 'Croatia', 'Cuba', 
      'Denmark', 'Dominica', 'Ecuador', 'Egypt', 'El Salvador', 'United Arab Emirates', 'Eritrea', 'Slovakia',
      'Slovenia', 'Spain', 'United States', 'Estonia', 'Eswatini', 'Ethiopia', 'Philippines', 'Finland', 'Fiji',
      'France', 'Gabon', 'Gambia', 'Georgia', 'Ghana', 'Grenada', 'Greece', 'Guatemala', 'Guinea', 'Guinea-Bissau',
      'Equatorial Guinea', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 'India', 'Indonesia', 'Iraq', 'Iran', 'Ireland',
      'Iceland', 'Marshall Islands', 'Solomon Islands', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan',
      'Kenya', 'Kyrgyzstan', 'Kiribati', 'Kosovo', 'Kuwait', 'Laos', 'Lesotho', 'Latvia', 'Lebanon', 'Liberia', 'Libya',
      'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar', 'Malaysia', 'Malawi', 'Maldives', 'Mali', 'Malta',
      'Morocco', 'Mauritius', 'Mauritania', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro',
      'Mozambique', 'Namibia', 'Nauru', 'Nepal', 'Nicaragua', 'Niger', 'Nigeria', 'Norway', 'New Zealand',
      'Oman', 'Netherlands', 'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Poland',
      'Portugal', 'United Kingdom', 'Central African Republic', 'Czech Republic', 'Congo', 'Democratic Republic of the Congo',
      'Dominican Republic', 'Rwanda', 'Romania', 'Russia', 'Samoa', 'Saint Kitts and Nevis', 'San Marino', 'Saint Vincent and the Grenadines',
      'Saint Lucia', 'Sao Tome and Principe', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Syria', 'Somalia', 'Sri Lanka',
      'South Africa', 'Sudan', 'South Sudan', 'Sweden', 'Switzerland', 'Suriname', 'Thailand', 'Tanzania', 'Tajikistan', 'East Timor',
      'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkmenistan', 'Turkey', 'Tuvalu', 'Ukraine', 'Uganda', 'Uruguay', 'Uzbekistan',
      'Vanuatu', 'Venezuela', 'Vietnam', 'Yemen', 'Djibouti', 'Zambia', 'Zimbabwe'
  ];
  const selectedCountries = language === 'es' ? countriesSpanish : countriesEnglish;

  useEffect(() => {
    const unsubscribeProjects = onSnapshot(collection(firestore, "projects"), (snapshot) => {
      setLoadingProjects(true);
      const projectsList = snapshot.docs.map(doc => ({
        label: doc.data()?.projectName || 'Nombre no disponible',
        value: doc.id,
        activities: doc.data()?.activities || [],
      }));
      setProjects(projectsList);
      setLoadingProjects(false);
    });
    return () => unsubscribeProjects();
  }, []);

  const handleInputChange = async (field, value) => {
    const updatedUserData = { ...userData, [field]: value };
    setUserData(updatedUserData);

    if (field === 'userID' && value) {
      try {
        const userQuery = query(collection(firestore, "users"), where("userID", "==", value));
        const querySnapshot = await getDocs(userQuery);
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0].data();
          setUserData(prevData => ({ ...prevData, ...userDoc }));
          setIsUserValid(true);
          clearLocationAndProjectFields();
        } else {
          setUserData({ ...userData, userID: value });
          setIsUserValid(false);
        }
      } catch (error) {
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
      countries: Array.from(new Set([...prevData.countries, value])),
    }));
  };

  const handleProjectSelection = (value) => {
    setUserData(prevData => ({
      ...prevData,
      projects: Array.from(new Set([...prevData.projects, value])),
    }));
    const selectedProject = projects.find(project => project.value === value);
    setFilteredActivities(selectedProject ? selectedProject.activities.map(activity => activity.activity || 'Actividad no disponible') : []);
  };

  const handleActivitySelection = (value) => {
    setUserData(prevData => ({
      ...prevData,
      activities: Array.from(new Set([...prevData.activities, value])),
    }));
  };

  const validateFields = () => {
    const fieldNames = {
      userID: language === 'es' ? 'ID de usuario' : 'User ID',
      idType: language === 'es' ? 'Tipo de identificación' : 'ID Type',
      name: language === 'es' ? 'Nombre' : 'Name',
      gender: language === 'es' ? 'Sexo' : 'Sex',
      birthDate: language === 'es' ? 'Fecha de nacimiento' : 'Birth Date',
      age: language === 'es' ? 'Edad' : 'Age',
      countries: language === 'es' ? 'País' : 'Country',
      province: language === 'es' ? 'Provincia' : 'Province',
      canton: language === 'es' ? 'Cantón' : 'Canton',
      district: language === 'es' ? 'Distrito' : 'District',
      phone: language === 'es' ? 'Teléfono' : 'Phone',
      projects: language === 'es' ? 'Proyectos' : 'Projects',
      medicalCondition: language === 'es' ? 'Condición Médica' : 'Medical Condition',
      activities: language === 'es' ? 'Actividades' : 'Activities'
    };

    const missingFields = Object.keys(userData).filter(key => {
      if (Array.isArray(userData[key])) return userData[key].length === 0;
      return !userData[key];
    }).map(key => fieldNames[key]);

    if (missingFields.length) {
      Alert.alert(
        language === 'es' ? 'Campos obligatorios' : 'Missing Fields',
        language === 'es'
          ? `Por favor, complete todos los campos: ${missingFields.join(', ')}`
          : `Please fill in all fields: ${missingFields.join(', ')}`
      );
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateFields()) return;

    try {
      const userQuery = query(collection(firestore, "users"), where("userID", "==", userData.userID));
      const querySnapshot = await getDocs(userQuery);
      const dataToSave = {
        ...userData,
        countries: Array.from(new Set(userData.countries)),
        projects: Array.from(new Set(userData.projects)),
        activities: Array.from(new Set(userData.activities)),
      };
      if (!querySnapshot.empty) {
        await setDoc(querySnapshot.docs[0].ref, dataToSave, { merge: true });
        Alert.alert(language === 'es' ? 'Datos actualizados' : 'Data updated');
      } else {
        await addDoc(collection(firestore, "users"), dataToSave);
        Alert.alert(language === 'es' ? 'Datos guardados' : 'Data saved');
      }
      setQrValue(userData.userID);
    } catch (error) {
      Alert.alert(language === 'es' ? 'Error al guardar datos' : 'Error saving data');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container(width)}>
      <Image source={require('../assets/image.png')} style={styles.logo(width)} />
      <Text style={styles.sectionTitle}>{language === 'es' ? 'Datos del Usuario' : 'User Information'}</Text>
      
      <View style={styles.sectionContainer}>
        <Picker selectedValue={userData.idType} style={styles.pickerContainer} onValueChange={(value) => handleInputChange('idType', value)}>
          <Picker.Item label={language === 'es' ? "Seleccione tipo de identificación" : "Select ID Type"} value="" />
          <Picker.Item label={language === 'es' ? "Cédula" : "ID Card"} value="ID Card" />
          <Picker.Item label={language === 'es' ? "Pasaporte" : "Passport"} value="Passport" />
        </Picker>

        <TextInput style={styles.input(width)} placeholder={language === 'es' ? "ID de usuario" : "User ID"} value={userData.userID} onChangeText={(value) => handleInputChange('userID', value)} />
        <TextInput style={styles.input(width)} placeholder={language === 'es' ? "Nombre completo" : "Full name"} value={userData.name} onChangeText={(value) => handleInputChange('name', value)} />
        
        <Picker selectedValue={userData.gender} style={styles.pickerContainer} onValueChange={(value) => handleInputChange('gender', value)}>
          <Picker.Item label={language === 'es' ? "Seleccione un sexo" : "Select a sex"} value="" />
          <Picker.Item label={language === 'es' ? "Masculino" : "Male"} value="Male" />
          <Picker.Item label={language === 'es' ? "Femenino" : "Female"} value="Female" />
        </Picker>

        <TextInput style={styles.input(width)} placeholder={language === 'es' ? "Fecha de nacimiento (dd/mm/yyyy)" : "Birth Date (dd/mm/yyyy)"} value={userData.birthDate} onChangeText={(value) => handleInputChange('birthDate', value)} />
        <TextInput style={styles.input(width)} placeholder={language === 'es' ? "Edad" : "Age"} value={userData.age} onChangeText={(value) => handleInputChange('age', value)} />
        <TextInput style={styles.input(width)} placeholder={language === 'es' ? "Celular" : "Phone"} value={userData.phone} onChangeText={(value) => handleInputChange('phone', value)} />
        <TextInput style={styles.input(width)} placeholder={language === 'es' ? "Condición Médica" : "Medical Condition"} value={userData.medicalCondition} onChangeText={(value) => handleInputChange('medicalCondition', value)} />
      </View>

      <Text style={styles.sectionTitle}>{language === 'es' ? 'Ubicación del Usuario' : 'User Location'}</Text>
      <View style={styles.sectionContainer}>
        <Picker selectedValue={userData.countries[userData.countries.length - 1] || ''} style={styles.pickerContainer} onValueChange={(value) => handleCountrySelection(value)}>
          <Picker.Item label={language === 'es' ? "Seleccione un país" : "Select a country"} value="" />
          {selectedCountries.map((country, index) => (
            <Picker.Item key={index} label={country} value={country} />
          ))}
        </Picker>
        <TextInput style={styles.input(width)} placeholder={language === 'es' ? "Provincia" : "Province"} value={userData.province} onChangeText={(value) => handleInputChange('province', value)} />
        <TextInput style={styles.input(width)} placeholder={language === 'es' ? "Cantón" : "Canton"} value={userData.canton} onChangeText={(value) => handleInputChange('canton', value)} />
        <TextInput style={styles.input(width)} placeholder={language === 'es' ? "Distrito" : "District"} value={userData.district} onChangeText={(value) => handleInputChange('district', value)} />
      </View>

      <Text style={styles.sectionTitle}>{language === 'es' ? 'Detalles del Proyecto' : 'Project Details'}</Text>
      <View style={styles.sectionContainer}>
        {loadingProjects ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <Picker selectedValue={userData.projects[0] || ''} style={styles.pickerContainer} onValueChange={(value) => handleProjectSelection(value)}>
            <Picker.Item label={language === 'es' ? "Seleccione un proyecto" : "Select a project"} value="" />
            {projects.map((project, index) => (
              <Picker.Item key={index} label={project.label} value={project.value} />
            ))}
          </Picker>
        )}
        <Picker selectedValue={userData.activities[0] || ''} style={styles.pickerContainer} onValueChange={(value) => handleActivitySelection(value)}>
          <Picker.Item label={language === 'es' ? "Seleccione una actividad" : "Select an activity"} value="" />
          {filteredActivities.length > 0 ? (
            filteredActivities.map((activity, index) => <Picker.Item key={index} label={activity} value={activity} />)
          ) : (
            <Picker.Item label={language === 'es' ? "No hay actividades disponibles" : "No activities available"} value="" />
          )}
        </Picker>
      </View>

      <TouchableOpacity style={styles.button(width)} onPress={handleSave}>
        <Text style={styles.buttonText}>{language === 'es' ? "Guardar" : "Save"}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.addButton(width), !isUserValid && { backgroundColor: '#ccc' }]} onPress={() => navigation.navigate('FamilyScreen')} disabled={!isUserValid}>
        <Text style={styles.buttonText}>{language === 'es' ? "Añadir Familiar" : "Add Family Member"}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.exitButton(width)} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.buttonText}>{language === 'es' ? "Salir" : "Exit"}</Text>
      </TouchableOpacity>

      {qrValue && (
        <TouchableOpacity onPress={() => navigation.navigate('UserDetailsScreen', { userData })} style={styles.qrContainer(width)}>
          <QRCode value={qrValue} size={width * 0.5} />
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

export default RegisterUser;
