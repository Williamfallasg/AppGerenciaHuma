import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../context/LanguageContext';
import { useUserRole } from '../context/UserRoleContext';
import styles from '../styles/stylesFamilyScreen'; // Importar los estilos desde el archivo separado

const FamilyScreen = ({ route }) => {
  const { language } = useLanguage();
  const { userRole } = useUserRole();
  const navigation = useNavigation();
  const [familyMembers, setFamilyMembers] = useState(route.params?.family || []);

  useEffect(() => {
    if (userRole !== 'admin' && userRole !== 'user') {
      Alert.alert(
        language === 'es' ? 'Acceso denegado' : 'Access Denied',
        language === 'es' ? 'No tiene permisos para acceder a esta sección.' : 'You do not have permission to access this section.',
        [{ text: language === 'es' ? 'Aceptar' : 'OK', onPress: () => navigation.goBack() }]
      );
    }
  }, [userRole, navigation, language]);

  if (userRole !== 'admin' && userRole !== 'user') {
    return null;
  }

  const handleEditFamilyMember = (index, field, value) => {
    const updatedFamily = [...familyMembers];
    updatedFamily[index][field] = value;
    setFamilyMembers(updatedFamily);
  };

  const handleDeleteFamilyMember = (index) => {
    const updatedFamily = familyMembers.filter((_, i) => i !== index);
    setFamilyMembers(updatedFamily);
  };

  const handleAddFamilyMember = () => {
    setFamilyMembers([...familyMembers, { name: '', surname: '', relationship: '', country: '', phone: '' }]);
  };

  const handleSave = () => {
    Alert.alert(
      language === 'es' ? "Confirmación" : "Confirmation",
      language === 'es' ? "¿Está seguro de guardar los cambios?" : "Are you sure you want to save the changes?",
      [
        {
          text: language === 'es' ? "Cancelar" : "Cancel",
          style: "cancel"
        },
        {
          text: language === 'es' ? "Guardar" : "Save",
          onPress: () => {
            route.params.updateFamily(familyMembers);
            navigation.navigate('RegisterUser', { qrVisible: true });
          }
        }
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require('../assets/image.png')} style={styles.logo} />

      {familyMembers.map((member, index) => (
        <View key={index} style={styles.familyContainer}>
          <TextInput
            style={styles.input}
            placeholder={language === 'es' ? "Nombre del familiar" : "Family Member Name"}
            value={member.name}
            onChangeText={(value) => handleEditFamilyMember(index, 'name', value)}
            placeholderTextColor="#B0B0B0"
          />
          <TextInput
            style={styles.input}
            placeholder={language === 'es' ? "Apellido del familiar" : "Family Member Surname"}
            value={member.surname}
            onChangeText={(value) => handleEditFamilyMember(index, 'surname', value)}
            placeholderTextColor="#B0B0B0"
          />
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={member.relationship}
              style={styles.picker}
              onValueChange={(value) => handleEditFamilyMember(index, 'relationship', value)}
              itemStyle={styles.pickerItem}
            >
              <Picker.Item label={language === 'es' ? "Seleccione una relación" : "Select a relationship"} value="" />
              <Picker.Item label={language === 'es' ? "Esposa" : "Wife"} value="Esposa" />
              <Picker.Item label={language === 'es' ? "Esposo" : "Husband"} value="Esposo" />
              <Picker.Item label={language === 'es' ? "Novia" : "Girlfriend"} value="Novia" />
              <Picker.Item label={language === 'es' ? "Novio" : "Boyfriend"} value="Novio" />
              <Picker.Item label={language === 'es' ? "Hermano" : "Brother"} value="Hermano" />
              <Picker.Item label={language === 'es' ? "Hermana" : "Sister"} value="Hermana" />
              <Picker.Item label={language === 'es' ? "Tío" : "Uncle"} value="Tio" />
              <Picker.Item label={language === 'es' ? "Tía" : "Aunt"} value="Tia" />
              <Picker.Item label={language === 'es' ? "Papá" : "Father"} value="Papa" />
              <Picker.Item label={language === 'es' ? "Mamá" : "Mother"} value="Mama" />
              <Picker.Item label={language === 'es' ? "Abuelo" : "Grandfather"} value="Abuelo" />
              <Picker.Item label={language === 'es' ? "Abuela" : "Grandmother"} value="Abuela" />
            </Picker>
          </View>
          <TextInput
            style={styles.input}
            placeholder={language === 'es' ? "País" : "Country"}
            value={member.country}
            onChangeText={(value) => handleEditFamilyMember(index, 'country', value)}
            placeholderTextColor="#B0B0B0"
          />
          <TextInput
            style={styles.input}
            placeholder={language === 'es' ? "Celular del familiar" : "Family Member Phone"}
            value={member.phone}
            onChangeText={(value) => handleEditFamilyMember(index, 'phone', value)}
            keyboardType="phone-pad"
            placeholderTextColor="#B0B0B0"
          />
          <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteFamilyMember(index)}>
            <Text style={styles.buttonText}>
              {language === 'es' ? "Eliminar" : "Delete"}
            </Text>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity style={styles.addButton} onPress={handleAddFamilyMember}>
        <Text style={styles.buttonText}>
          {language === 'es' ? "Añadir Familiar" : "Add Family Member"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.buttonText}>
          {language === 'es' ? "Guardar cambios" : "Save Changes"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default FamilyScreen;
