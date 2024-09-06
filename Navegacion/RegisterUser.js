import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert, Dimensions, Platform } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { useLanguage } from '../context/LanguageContext';
import { firestore } from '../firebase/firebase3';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { useWindowDimensions } from 'react-native';
import { useUserRole } from '../context/UserRoleContext'; // Importar el contexto del rol del usuario
import styles from '../styles/stylesRegisterUser'; // Importa el archivo de estilos

const RegisterUser = () => {
  const { language } = useLanguage();
  const { userRole } = useUserRole(); // Obtener el rol del usuario
  // Añadir campos de usuario
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
  const [qrValue, setQrValue] = useState(null);

  const navigation = useNavigation();
  const { width } = useWindowDimensions();

  // Lista de países
  const countries = [
    'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 
    'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 
    'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 
    'Cabo Verde', 'Cambodia', 'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 
    'Comoros', 'Congo (Congo-Brazzaville)', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 
    'Djibouti', 'Dominica', 'Dominican Republic', 'East Timor (Timor-Leste)', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 
    'Eritrea', 'Estonia', 'Eswatini (fmr. "Swaziland")', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 
    'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 
    'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Ivory Coast', 'Jamaica', 'Japan', 
    'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 
    'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 
    'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 
    'Morocco', 'Mozambique', 'Myanmar (formerly Burma)', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 
    'Niger', 'Nigeria', 'North Korea', 'North Macedonia (formerly Macedonia)', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Panama', 
    'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda', 
    'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 
    'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 
    'Somalia', 'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 
    'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 
    'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 
    'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
  ];

  const handleInputChange = (field, value) => {
    setUserData({ ...userData, [field]: value });
  };

  const handleSave = async () => {
    const { userID, idType, name, gender, birthDate, age, country, province, canton, district, phone } = userData;

    if (!userID || !idType || !name || !gender || !birthDate || !age || !country || !province || !canton || !district || !phone) {
      Alert.alert(language === 'es' ? 'Por favor, complete todos los campos' : 'Please fill in all fields');
      return;
    }

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

  const handleBirthDateChange = (value) => {
    const regex = /^[0-9/]*$/; // Solo aceptar números y '/'
    if (regex.test(value)) {
      if (value.length === 2 || value.length === 5) {
        value += '/';
      }
      setUserData({ ...userData, birthDate: value });
    }
  };

  const handleFamilyNavigation = () => {
    navigation.navigate('FamilyScreen', {
      family: userData.family,
      updateFamily: (updatedFamily) => {
        setUserData({ ...userData, family: updatedFamily });
      },
    });
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
        placeholder={language === 'es' ? "Nombre" : "Name"}
        value={userData.name}
        onChangeText={(value) => handleInputChange('name', value)}
        placeholderTextColor="#B0B0B0"
      />

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
        onChangeText={(value) => handleBirthDateChange(value)}
        keyboardType="numeric"
        placeholderTextColor="#B0B0B0"
        maxLength={10}
      />

      <TextInput
        style={styles.input(width)}
        placeholder={language === 'es' ? "Edad" : "Age"}
        value={userData.age}
        onChangeText={(value) => handleInputChange('age', value)}
        keyboardType="numeric" // Asegurarse de que solo se acepten números
        placeholderTextColor="#B0B0B0"
      />

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={userData.country}
          style={styles.picker}
          onValueChange={(value) => handleInputChange('country', value)}
          itemStyle={styles.pickerItem}
        >
          <Picker.Item label={language === 'es' ? "Seleccione un país" : "Select a country"} value="" />
          {countries.map((country, index) => (
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

      <TextInput
        style={styles.input(width)}
        placeholder={language === 'es' ? "Celular" : "Phone"}
        value={userData.phone}
        onChangeText={(value) => handleInputChange('phone', value)}
        keyboardType="phone-pad"
        placeholderTextColor="#B0B0B0"
      />

      <TouchableOpacity style={styles.addButton(width)} onPress={handleFamilyNavigation}>
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
