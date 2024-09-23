import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { useLanguage } from '../context/LanguageContext';
import { firestore } from '../firebase/firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { useWindowDimensions } from 'react-native';
import { useFamily } from '../context/FamilyContext'; // Importar el contexto de familia
import styles from '../styles/stylesRegisterUser'; // Importa el archivo de estilos

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
  });

  const [errors, setErrors] = useState({});
  const [qrValue, setQrValue] = useState(null);
  const [isUserValid, setIsUserValid] = useState(false); 
  const [formSubmitted, setFormSubmitted] = useState(false); 
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const { familyMembers, setFamilyMembers } = useFamily(); 

  // Lista de países en español
  const countriesSpanish = [
    'Afganistán', 'Albania', 'Argelia', 'Andorra', 'Angola', 'Antigua y Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaiyán',
    'Bahamas', 'Baréin', 'Bangladés', 'Barbados', 'Bielorrusia', 'Bélgica', 'Belice', 'Benín', 'Bután', 'Bolivia', 'Bosnia y Herzegovina',
    'Botsuana', 'Brasil', 'Brunéi', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Camboya', 'Camerún', 'Canadá', 'República Centroafricana',
    'Chad', 'Chile', 'China', 'Colombia', 'Comoras', 'Congo', 'República Democrática del Congo', 'Costa Rica', 'Croacia', 'Cuba', 'Chipre',
    'República Checa', 'Dinamarca', 'Yibuti', 'Dominica', 'República Dominicana', 'Timor Oriental', 'Ecuador', 'Egipto', 'El Salvador', 'Guinea Ecuatorial',
    'Eritrea', 'Estonia', 'Esuatini', 'Etiopía', 'Fiyi', 'Finlandia', 'Francia', 'Gabón', 'Gambia', 'Georgia', 'Alemania', 'Ghana', 'Grecia', 'Granada',
    'Guatemala', 'Guinea', 'Guinea-Bisáu', 'Guyana', 'Haití', 'Honduras', 'Hungría', 'Islandia', 'India', 'Indonesia', 'Irán', 'Irak', 'Irlanda',
    'Israel', 'Italia', 'Costa de Marfil', 'Jamaica', 'Japón', 'Jordania', 'Kazajistán', 'Kenia', 'Kiribati', 'Kuwait', 'Kirguistán', 'Laos', 'Letonia',
    'Líbano', 'Lesoto', 'Liberia', 'Libia', 'Liechtenstein', 'Lituania', 'Luxemburgo', 'Madagascar', 'Malaui', 'Malasia', 'Maldivas', 'Malí',
    'Malta', 'Islas Marshall', 'Mauritania', 'Mauricio', 'México', 'Micronesia', 'Moldavia', 'Mónaco', 'Mongolia', 'Montenegro', 'Marruecos',
    'Mozambique', 'Birmania', 'Namibia', 'Nauru', 'Nepal', 'Países Bajos', 'Nueva Zelanda', 'Nicaragua', 'Níger', 'Nigeria', 'Corea del Norte', 'Macedonia del Norte',
    'Noruega', 'Omán', 'Pakistán', 'Palaos', 'Panamá', 'Papúa Nueva Guinea', 'Paraguay', 'Perú', 'Filipinas', 'Polonia', 'Portugal', 'Catar',
    'Rumanía', 'Rusia', 'Ruanda', 'San Cristóbal y Nieves', 'Santa Lucía', 'San Vicente y las Granadinas', 'Samoa', 'San Marino', 'Santo Tomé y Príncipe',
    'Arabia Saudita', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leona', 'Singapur', 'Eslovaquia', 'Eslovenia', 'Islas Salomón', 'Somalia',
    'Sudáfrica', 'Corea del Sur', 'Sudán del Sur', 'España', 'Sri Lanka', 'Sudán', 'Surinam', 'Suecia', 'Suiza', 'Siria', 'Taiwán',
    'Tayikistán', 'Tanzania', 'Tailandia', 'Togo', 'Tonga', 'Trinidad y Tobago', 'Túnez', 'Turquía', 'Turkmenistán', 'Tuvalu', 'Uganda',
    'Ucrania', 'Emiratos Árabes Unidos', 'Reino Unido', 'Estados Unidos', 'Uruguay', 'Uzbekistán', 'Vanuatu', 'Ciudad del Vaticano', 'Venezuela',
    'Vietnam', 'Yemen', 'Zambia', 'Zimbabue'
  ];

  // Lista de países en inglés
  const countriesEnglish = [
    'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan',
    'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina',
    'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia', 'Cameroon', 'Canada', 'Central African Republic',
    'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Democratic Republic of the Congo', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus',
    'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'East Timor', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea',
    'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada',
    'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland',
    'Israel', 'Italy', 'Ivory Coast', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia',
    'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali',
    'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco',
    'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia',
    'Norway', 'Oman', 'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar',
    'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe',
    'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia',
    'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Taiwan',
    'Tajikistan', 'Tanzania', 'Thailand', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda',
    'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela',
    'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
  ];

  const handleInputChange = (field, value) => {
    setUserData({ ...userData, [field]: value });
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
      newErrors.gender = language === 'es' ? 'Seleccione un sexo' : 'Select a sex';
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

    const phoneRegex = /^\d{8,15}$/; 
    if (!userData.phone || !phoneRegex.test(userData.phone)) {
      newErrors.phone = language === 'es' ? 'Número de teléfono inválido' : 'Invalid phone number';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    setIsUserValid(validateFields());
  }, [userData]);

  const handleSave = async () => {
    setFormSubmitted(true);

    if (!validateFields()) {
      Alert.alert(language === 'es' ? 'Error' : 'Error', language === 'es' ? 'Corrija los errores antes de continuar' : 'Please correct the errors before proceeding');
      return;
    }

    const { userID, idType, name, gender, birthDate, age, country, province, canton, district, phone } = userData;

    try {
      const q = query(collection(firestore, "users"), where("userID", "==", userID));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        Alert.alert(language === 'es' ? 'Este ID de usuario ya existe' : 'This User ID already exists');
        return;
      }

      const dataToSave = { ...userData, birthDate: userData.birthDate };
      await addDoc(collection(firestore, "users"), dataToSave);

      setQrValue(JSON.stringify(dataToSave));
      Alert.alert(language === 'es' ? 'Guardado exitosamente' : 'Saved successfully');
    } catch (error) {
      console.error("Error adding document: ", error);
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

  // Selecciona la lista de países dependiendo del idioma
  const selectedCountries = language === 'es' ? countriesSpanish : countriesEnglish;

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
          <Picker.Item label={language === 'es' ? "Seleccione un sexo" : "Select a sex"} value="" />
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
