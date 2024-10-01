// Path: src/components/RegisterUser.js

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert, ActivityIndicator } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { useLanguage } from '../context/LanguageContext';
import { firestore } from '../firebase/firebase';
import { collection, addDoc, query, where, getDocs, onSnapshot, setDoc, doc, updateDoc } from 'firebase/firestore';
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
  });

  const [errors, setErrors] = useState({});
  const [qrValue, setQrValue] = useState('');
  const [isUserValid, setIsUserValid] = useState(false); 
  const [formSubmitted, setFormSubmitted] = useState(false); 
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const { familyMembers, setFamilyMembers } = useFamily(); 

  // Lista de países en español e inglés
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
    'Seychelles', 'Sierra Leona', 'Singapur', 'Siria', 'Somalia', 'Sri Lanka', 'Suazilandia', 'Sudáfrica', 
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
    'Seychelles', 'Sierra Leone', 'Singapore', 'Syria', 'Somalia', 'Sri Lanka', 'Swaziland', 'South Africa', 
    'Sudan', 'South Sudan', 'Sweden', 'Switzerland', 'Suriname', 'Thailand', 'Tanzania', 'Tajikistan', 
    'East Timor', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkmenistan', 'Turkey', 
    'Tuvalu', 'Ukraine', 'Uganda', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Venezuela', 'Vietnam', 
    'Yemen', 'Djibouti', 'Zambia', 'Zimbabwe'
  ];

  const selectedCountries = language === 'es' ? countriesSpanish : countriesEnglish;

  // useEffect para escuchar los cambios de los proyectos en tiempo real
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(firestore, "projects"), (snapshot) => {
      try {
        setLoadingProjects(true);
        const projectsList = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            label: data?.projectName || 'Nombre no disponible',
            value: doc.id,
            beneficiaries: data?.beneficiaries || 0,
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

    return () => unsubscribe(); 
  }, []);

  const handleInputChange = async (field, value) => {
    const updatedUserData = { ...userData, [field]: value };
    setUserData(updatedUserData);

    if (field === 'userID') {
      // Verificar si el usuario ya está registrado
      try {
        const q = query(collection(firestore, "users"), where("userID", "==", value));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0].data();
          // Autocompletar los campos con la información del usuario existente
          const completedUserData = {
            ...updatedUserData,
            idType: userDoc.idType || '',
            name: userDoc.name || '',
            gender: userDoc.gender || '',
            birthDate: userDoc.birthDate || '',
            age: userDoc.age || '', 
            country: userDoc.country || '',
            province: userDoc.province || '',
            canton: userDoc.canton || '',
            district: userDoc.district || '',
            phone: userDoc.phone || '',
            projects: userDoc.projects || [],
          };
          setUserData(completedUserData);
          setQrValue(JSON.stringify(completedUserData));
          Alert.alert(language === 'es' ? 'Usuario encontrado y datos completados automáticamente' : 'User found, data completed automatically');
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
        Alert.alert(language === 'es' ? 'Error al buscar usuario' : 'Error fetching user');
      }
    }
  };

  const validateFields = () => {
    let newErrors = {};

    if (!userData.userID) {
      newErrors.userID = language === 'es' ? 'El ID de usuario es obligatorio' : 'User ID is required';
    }

    if (!userData.idType) {
      newErrors.idType = language === 'es' ? 'Seleccione un tipo de identificación' : 'Select an ID Type';
    }

    if (!userData.name) {
      newErrors.name = language === 'es' ? 'El nombre es obligatorio' : 'Name is required';
    }

    if (!userData.gender) {
      newErrors.gender = language === 'es' ? 'Seleccione un sexo' : 'Select a gender';
    }

    const birthDateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!userData.birthDate || !birthDateRegex.test(userData.birthDate)) {
      newErrors.birthDate = language === 'es' ? 'Fecha de nacimiento inválida (dd/mm/yyyy)' : 'Invalid birth date (dd/mm/yyyy)';
    }

    if (!userData.age || isNaN(userData.age)) {
      newErrors.age = language === 'es' ? 'La edad es obligatoria y debe ser un número' : 'Age is required and must be a number';
    }

    if (!userData.country) {
      newErrors.country = language === 'es' ? 'Seleccione un país' : 'Select a country';
    }

    if (!userData.province) {
      newErrors.province = language === 'es' ? 'La provincia es obligatoria' : 'Province is required';
    }

    if (!userData.canton) {
      newErrors.canton = language === 'es' ? 'El cantón es obligatorio' : 'Canton is required';
    }

    if (!userData.district) {
      newErrors.district = language === 'es' ? 'El distrito es obligatorio' : 'District is required';
    }

    if (userData.projects.length === 0) {
      newErrors.projects = language === 'es' ? 'Seleccione al menos un proyecto' : 'Select at least one project';
    }

    const phoneRegex = /^\d{8,15}$/; 
    if (!userData.phone || !phoneRegex.test(userData.phone)) {
      newErrors.phone = language === 'es' ? 'Número de teléfono inválido' : 'Invalid phone number';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    setIsUserValid(validateFields());
    // Actualizar el valor del QR si todos los campos son válidos
    if (validateFields()) {
      setQrValue(JSON.stringify(userData));
    }
  }, [userData]);

  const handleProjectSelection = (value) => {
    if (userData.projects.includes(value)) {
      Alert.alert(language === 'es' ? 'Ya está registrado en este proyecto' : 'You are already registered for this project');
    } else {
      setUserData({
        ...userData,
        projects: [...userData.projects, value],
      });
    }
  };

  const handleSave = async () => {
    setFormSubmitted(true);

    if (!validateFields()) {
      Alert.alert(language === 'es' ? 'Error' : 'Error', language === 'es' ? 'Corrija los errores antes de continuar' : 'Please correct the errors before proceeding');
      return;
    }

    try {
      const q = query(collection(firestore, "users"), where("userID", "==", userData.userID));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Si el usuario ya existe, actualizar los datos
        const userDocId = querySnapshot.docs[0].id;
        await setDoc(doc(firestore, "users", userDocId), userData);
        Alert.alert(language === 'es' ? 'Datos actualizados exitosamente' : 'Data updated successfully');
      } else {
        // Si el usuario no existe, guardar un nuevo documento
        await addDoc(collection(firestore, "users"), userData);
        Alert.alert(language === 'es' ? 'Guardado exitosamente' : 'Saved successfully');
      }

      // Reducir el número de beneficiarios de los proyectos seleccionados
      userData.projects.forEach(async (projectId) => {
        const selectedProject = projects.find(p => p.value === projectId);
        if (selectedProject) {
          const projectDocRef = doc(firestore, "projects", selectedProject.value);
          await updateDoc(projectDocRef, {
            beneficiaries: selectedProject.beneficiaries - 1,
          });
        }
      });

      // Actualizar el valor del código QR para reflejar los datos completos del usuario
      setQrValue(JSON.stringify(userData));
    } catch (error) {
      console.error("Error adding/updating document: ", error);
      Alert.alert(language === 'es' ? 'Error al guardar' : 'Error saving');
    }
  };

  const handleFamilyNavigation = () => {
    if (isUserValid) {
      navigation.navigate('FamilyScreen');
    } else {
      Alert.alert(language === 'es' ? 'Error' : 'Error', language === 'es' ? 'Complete todos los datos del usuario antes de añadir un familiar' : 'Complete all user data before adding a family member');
    }
  };

  const handleSalir = () => {
    navigation.navigate('Home');
  };

  return (
    <ScrollView contentContainerStyle={styles.container(width)}>
      <Image source={require('../assets/image.png')} style={styles.logo(width)} />

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
        {formSubmitted && errors.idType && <Text style={styles.errorText}>{errors.idType}</Text>}
      </View>

      <TextInput
        style={styles.input(width)}
        placeholder={language === 'es' ? "ID de usuario" : "User ID"}
        value={userData.userID}
        onChangeText={(value) => handleInputChange('userID', value)}
        placeholderTextColor="#B0B0B0"
      />
      {formSubmitted && errors.userID && <Text style={styles.errorText}>{errors.userID}</Text>}

      <TextInput
        style={styles.input(width)}
        placeholder={language === 'es' ? "Nombre completo" : "Full name"}
        value={userData.name}
        onChangeText={(value) => handleInputChange('name', value)}
        placeholderTextColor="#B0B0B0"
      />
      {formSubmitted && errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={userData.gender}
          style={styles.picker}
          onValueChange={(value) => handleInputChange('gender', value)}
          itemStyle={styles.pickerItem}
        >
          <Picker.Item label={language === 'es' ? "Seleccione un sexo" : "Select a gender"} value="" />
          <Picker.Item label={language === 'es' ? "Masculino" : "Male"} value="Male" />
          <Picker.Item label={language === 'es' ? "Femenino" : "Female"} value="Female" />
        </Picker>
        {formSubmitted && errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}
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
      {formSubmitted && errors.birthDate && <Text style={styles.errorText}>{errors.birthDate}</Text>}

      <TextInput
        style={styles.input(width)}
        placeholder={language === 'es' ? "Edad" : "Age"}
        value={userData.age}
        onChangeText={(value) => handleInputChange('age', value)}
        keyboardType="numeric"
        placeholderTextColor="#B0B0B0"
      />
      {formSubmitted && errors.age && <Text style={styles.errorText}>{errors.age}</Text>}

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
        {formSubmitted && errors.country && <Text style={styles.errorText}>{errors.country}</Text>}
      </View>

      <TextInput
        style={styles.input(width)}
        placeholder={language === 'es' ? "Provincia" : "Province"}
        value={userData.province}
        onChangeText={(value) => handleInputChange('province', value)}
        placeholderTextColor="#B0B0B0"
      />
      {formSubmitted && errors.province && <Text style={styles.errorText}>{errors.province}</Text>}

      <TextInput
        style={styles.input(width)}
        placeholder={language === 'es' ? "Cantón" : "Canton"}
        value={userData.canton}
        onChangeText={(value) => handleInputChange('canton', value)}
        placeholderTextColor="#B0B0B0"
      />
      {formSubmitted && errors.canton && <Text style={styles.errorText}>{errors.canton}</Text>}

      <TextInput
        style={styles.input(width)}
        placeholder={language === 'es' ? "Distrito" : "District"}
        value={userData.district}
        onChangeText={(value) => handleInputChange('district', value)}
        placeholderTextColor="#B0B0B0"
      />
      {formSubmitted && errors.district && <Text style={styles.errorText}>{errors.district}</Text>}

      <TextInput
        style={styles.input(width)}
        placeholder={language === 'es' ? "Celular" : "Phone"}
        value={userData.phone}
        onChangeText={(value) => handleInputChange('phone', value)}
        keyboardType="phone-pad"
        placeholderTextColor="#B0B0B0"
      />
      {formSubmitted && errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

      {/* Input para seleccionar Proyecto */}
      <View style={styles.pickerContainer}>
        {loadingProjects ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <Picker
            selectedValue=""
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
        {formSubmitted && errors.projects && <Text style={styles.errorText}>{errors.projects}</Text>}
      </View>

      <TouchableOpacity
        style={[styles.addButton(width), !isUserValid && { backgroundColor: '#ccc' }]} 
        onPress={handleFamilyNavigation}
        disabled={!isUserValid} 
      >
        <Text style={styles.buttonText}>
          {language === 'es' ? "Añadir Familiar" : "Add Family Member"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button(width)} onPress={handleSave}>
        <Text style={styles.buttonText}>
          {language === 'es' ? "Guardar" : "Save"}
        </Text>
      </TouchableOpacity>

      {qrValue && (
        <View style={styles.qrContainer(width)}>
          <QRCode value={qrValue} size={width * 0.5} />
        </View>
      )}

      <TouchableOpacity style={styles.exitButton(width)} onPress={handleSalir}>
        <Text style={styles.buttonText}>
          {language === 'es' ? "Salir" : "Exit"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default RegisterUser;
