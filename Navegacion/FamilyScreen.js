import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../context/LanguageContext';
import { useFamily } from '../context/FamilyContext'; // Importar el contexto de familia
import styles from '../styles/stylesFamilyScreen';

const FamilyScreen = () => {
  const { language } = useLanguage();
  const navigation = useNavigation();
  const { familyMembers, setFamilyMembers } = useFamily(); // Usar el contexto de familia

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
            navigation.navigate('RegisterUser', { qrVisible: true });
          }
        }
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {familyMembers.map((member, index) => (
        <View key={index} style={styles.familyContainer}>
          <TextInput
            style={styles.input}
            placeholder={language === 'es' ? "Nombre del familiar" : "Family Member Name"}
            value={member.name}
            onChangeText={(value) => handleEditFamilyMember(index, 'name', value)}
            placeholderTextColor="#B0B0B0"
          />
          {/* Resto de los campos del familiar */}
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
