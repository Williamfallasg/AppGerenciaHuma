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
  const [isUserValid, setIsUserValid] = useState(false); // Estado para verificar si el usuario es válido
  const [formSubmitted, setFormSubmitted] = useState(false); // Nuevo estado para saber si se intentó enviar el formulario
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const { familyMembers, setFamilyMembers } = useFamily(); // Usar el contexto de familia

  const countries = [
    'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan', 
    'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 
    'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Chile', 'China', 'Colombia', 
    'Congo', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Dominica', 'Dominican Republic', 'Ecuador', 
    'Egypt', 'El Salvador', 'Eritrea', 'Estonia', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Germany', 'Greece', 'Grenada', 'Guatemala', 
    'Guinea', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Jamaica', 
    'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kuwait', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Lithuania', 'Luxembourg', 
    'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Mexico', 'Micronesia', 'Monaco', 'Morocco', 'Mozambique', 'Nepal', 
    'Netherlands', 'New Zealand', 'Nicaragua', 'Nigeria', 'Norway', 'Pakistan', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 
    'Philippines', 'Poland', 'Portugal', 'Qatar', 'Russia', 'Rwanda', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 
    'Saudi Arabia', 'Serbia', 'Seychelles', 'Singapore', 'Slovakia', 'Slovenia', 'Somalia', 'South Africa', 'South Korea', 'Spain', 
    'Sri Lanka', 'Sudan', 'Sweden', 'Switzerland', 'Thailand', 'Turkey', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 
    'United States', 'Uruguay', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
  ];

  const handleInputChange = (field, value) => {
    setUserData({ ...userData, [field]: value });
  };

  // Función para validar los campos
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

    const phoneRegex = /^\d{8,15}$/; // Número de teléfono entre 8 y 15 dígitos
    if (!userData.phone || !phoneRegex.test(userData.phone)) {
      newErrors.phone = language === 'es' ? 'Número de teléfono inválido' : 'Invalid phone number';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Efecto para verificar si el formulario es válido
  useEffect(() => {
    setIsUserValid(validateFields());
  }, [userData]);

  const handleSave = async () => {
    // Marcar el formulario como enviado
    setFormSubmitted(true);

    // Validar todos los campos antes de guardar
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
          {countries.map((country, index) => (
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
        style={[styles.addButton(width), !isUserValid && { backgroundColor: '#ccc' }]} // Deshabilitar si no es válido
        onPress={handleFamilyNavigation}
        disabled={!isUserValid} // Deshabilitar si no es válido
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
