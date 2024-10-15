import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../context/LanguageContext';
import { firestore } from '../firebase/firebase';
import { doc, setDoc } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useUserRole } from '../context/UserRoleContext';
import { Picker } from '@react-native-picker/picker'; 
import styles from '../styles/stylesProgramForm';

const ProgramForm = () => {
  const { language } = useLanguage(); 
  const navigation = useNavigation();
  const { userRole } = useUserRole(); 

  const [programas, setProgramas] = useState([{
    programID: '',
    programName: '',
    programDescription: '',
    programBudget: '',
    programCurrency: 'USD', 
    startDate: '',
    endDate: ''
  }]);

  // Lista de monedas obtenida
  const currencyOptions = [
    { label: "USD (Dólares)", value: "USD" },
    { label: "CRC (Colones Costarricenses)", value: "CRC" },
    { label: "MXN (Pesos Mexicanos)", value: "MXN" },
    { label: "HNL (Lempiras Hondureñas)", value: "HNL" },
    { label: "EUR (Euros)", value: "EUR" },
    { label: "NIO (Córdoba Nicaragüense)", value: "NIO" },
    { label: "SVC (Colón Salvadoreño)", value: "SVC" },
    { label: "PAB (Balboa Panameño)", value: "PAB" },
    { label: "GTQ (Quetzal Guatemalteco)", value: "GTQ" },
    { label: "CAD (Dólar Canadiense)", value: "CAD" },
    { label: "AUD (Dólar Australiano)", value: "AUD" },
    { label: "GBP (Libra Esterlina)", value: "GBP" },
    { label: "JPY (Yen Japonés)", value: "JPY" }
  ];

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
  }, [userRole]);

  const getCurrencySymbol = (currency) => {
    const currencyMap = {
      'CRC': '₡',
      'USD': '$',
      'MXN': '$',
      'HNL': 'L',
      'EUR': '€',
      'NIO': 'C$',
      'SVC': '₡',
      'PAB': 'B/.',
      'GTQ': 'Q',
      'CAD': 'CA$',
      'AUD': 'A$',
      'GBP': '£',
      'JPY': '¥'
    };
    return currencyMap[currency] || '';
  };

  const isEndDateValid = (startDate, endDate) => {
    const [startDay, startMonth, startYear] = startDate.split('/').map(Number);
    const [endDay, endMonth, endYear] = endDate.split('/').map(Number);

    const start = new Date(startYear, startMonth - 1, startDay);
    const end = new Date(endYear, endMonth - 1, endDay);

    return end >= start; 
  };

  const validateProgram = (programa) => {
    if (!programa.programID) {
      Alert.alert(language === 'es' ? 'Error' : 'Error', language === 'es' ? 'El ID del programa es obligatorio' : 'Program ID is required');
      return false;
    }
    if (!programa.programName) {
      Alert.alert(language === 'es' ? 'Error' : 'Error', language === 'es' ? 'El nombre del programa es obligatorio' : 'Program name is required');
      return false;
    }
    if (!programa.programBudget || isNaN(parseFloat(programa.programBudget.replace(/[^0-9.]/g, '')))) {
      Alert.alert(language === 'es' ? 'Error' : 'Error', language === 'es' ? 'El presupuesto del programa es obligatorio y debe ser un número válido' : 'Program budget is required and must be a valid number');
      return false;
    }
    if (!programa.startDate) {
      Alert.alert(language === 'es' ? 'Error' : 'Error', language === 'es' ? 'La fecha de inicio es obligatoria' : 'Start date is required');
      return false;
    }
    if (!programa.endDate) {
      Alert.alert(language === 'es' ? 'Error' : 'Error', language === 'es' ? 'La fecha de fin es obligatoria' : 'End date is required');
      return false;
    }
    if (!isEndDateValid(programa.startDate, programa.endDate)) {
      Alert.alert(language === 'es' ? 'Error de fecha' : 'Date Error', language === 'es' ? 'La fecha de fin debe ser posterior a la fecha de inicio' : 'The end date must be after the start date');
      return false;
    }
    return true;
  };

  const handleCurrencyChange = (index, value) => {
    const newProgramas = [...programas];
    const symbol = getCurrencySymbol(value);
    
    const currentBudget = newProgramas[index].programBudget.replace(/[^\d.]/g, ''); 
    
    newProgramas[index].programCurrency = value;
    newProgramas[index].programBudget = `${symbol}${currentBudget}`; 

    setProgramas(newProgramas);
  };

  const handleProgramChange = (index, field, value) => {
    const newProgramas = [...programas];
    newProgramas[index][field] = value;
    setProgramas(newProgramas);
  };

  const confirmAndSave = () => {
    let summary = '';
    programas.forEach((programa, index) => {
      summary += `${language === 'es' ? 'Programa' : 'Program'} ${index + 1}:\n`;
      summary += `${language === 'es' ? 'ID del programa' : 'Program ID'}: ${programa.programID}\n`;
      summary += `${language === 'es' ? 'Nombre' : 'Name'}: ${programa.programName}\n`;
      summary += `${language === 'es' ? 'Descripción' : 'Description'}: ${programa.programDescription}\n`;
      summary += `${language === 'es' ? 'Presupuesto' : 'Budget'}: ${programa.programBudget}\n`;
      summary += `${language === 'es' ? 'Fecha de inicio' : 'Start Date'}: ${programa.startDate}\n`;
      summary += `${language === 'es' ? 'Fecha de fin' : 'End Date'}: ${programa.endDate}\n\n`;
    });

    Alert.alert(
      language === 'es' ? 'Confirmar Guardado' : 'Confirm Save',
      `${language === 'es' ? '¿Estás seguro de que deseas guardar los siguientes programas?\n\n' : 'Are you sure you want to save the following programs?\n\n'}${summary}`,
      [
        {
          text: language === 'es' ? 'Cancelar' : 'Cancel',
          style: 'cancel',
        },
        {
          text: language === 'es' ? 'Confirmar' : 'Confirm',
          onPress: () => handleSave(),
        },
      ]
    );
  };

  const handleSave = async () => {
    for (const programa of programas) {
      if (!validateProgram(programa)) {
        return; 
      }
    }
    
    try {
      for (const programa of programas) {
        const docRef = doc(firestore, 'programs', programa.programID);
        await setDoc(docRef, {
          programName: programa.programName,
          programDescription: programa.programDescription,
          programBudget: programa.programBudget,
          programCurrency: programa.programCurrency, 
          startDate: programa.startDate,
          endDate: programa.endDate,
        });
      }
      Alert.alert(language === 'es' ? "Guardado exitoso" : "Saved successfully");
    } catch (error) {
      Alert.alert(language === 'es' ? "Error al guardar" : "Save Error", language === 'es' ? "Hubo un error al guardar los datos" : "There was an error saving the data");
    }
  };

  const handleAddProgram = () => {
    setProgramas([
      ...programas,
      {
        programID: '',
        programName: '',
        programDescription: '',
        programBudget: '',
        programCurrency: 'USD',
        startDate: '',
        endDate: ''
      }
    ]);
  };

  const handleRemoveProgram = (index) => {
    Alert.alert(
      language === 'es' ? 'Eliminar programa' : 'Remove Program',
      language === 'es' ? '¿Estás seguro de que deseas eliminar este programa?' : 'Are you sure you want to remove this program?',
      [
        {
          text: language === 'es' ? 'Cancelar' : 'Cancel',
          style: 'cancel'
        },
        {
          text: language === 'es' ? 'Eliminar' : 'Remove',
          style: 'destructive',
          onPress: () => {
            const newProgramas = programas.filter((_, i) => i !== index);
            setProgramas(newProgramas);
          }
        }
      ]
    );
  };

  const handleLinkProject = () => {
    Alert.alert(
      language === 'es' ? 'Vincular proyecto' : 'Link Project',
      language === 'es' ? '¿Estás seguro de que deseas vincular un nuevo proyecto?' : 'Are you sure you want to link a new project?',
      [
        {
          text: language === 'es' ? 'Cancelar' : 'Cancel',
          style: 'cancel'
        },
        {
          text: language === 'es' ? 'Vincular' : 'Link',
          onPress: () => {
            navigation.navigate('ProjectForm'); 
          }
        }
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require('../assets/image.png')} style={styles.logo} />

      {programas.map((programa, index) => (
        <View key={index} style={styles.programContainer}>
          <Text>{`${language === 'es' ? "Programa" : "Program"} ${index + 1}`}</Text>

          <TextInput
            style={styles.input}
            placeholder={language === 'es' ? "ID del programa" : "Program ID"}
            value={programa.programID}
            onChangeText={(value) => handleProgramChange(index, 'programID', value)}
            placeholderTextColor="#B0B0B0"
          />

          <TextInput
            style={styles.input}
            placeholder={language === 'es' ? "Nombre del programa" : "Program Name"}
            value={programa.programName}
            onChangeText={(value) => handleProgramChange(index, 'programName', value)}
            placeholderTextColor="#B0B0B0"
          />

          <TextInput
            style={styles.input}
            placeholder={language === 'es' ? "Descripción del programa" : "Program Description"}
            value={programa.programDescription}
            onChangeText={(value) => handleProgramChange(index, 'programDescription', value)}
            placeholderTextColor="#B0B0B0"
          />

          {/* Selector de moneda */}
          <Picker
            selectedValue={programa.programCurrency}
            style={styles.picker}
            onValueChange={(value) => handleCurrencyChange(index, value)}
          >
            {currencyOptions.map(({ label, value }) => (
              <Picker.Item key={value} label={label} value={value} />
            ))}
          </Picker>

          <TextInput
            style={styles.input}
            placeholder={language === 'es' ? "Presupuesto del programa" : "Program Budget"}
            value={programa.programBudget}
            onChangeText={(value) => {
              const symbol = getCurrencySymbol(programa.programCurrency);
              const numericValue = value.replace(/[^\d.]/g, ''); 
              handleProgramChange(index, 'programBudget', `${symbol}${numericValue}`);
            }}
            keyboardType="numeric"
            placeholderTextColor="#B0B0B0"
          />

          <TextInput
            style={styles.input}
            placeholder={language === 'es' ? "Fecha de inicio (dd/mm/yyyy)" : "Start Date (dd/mm/yyyy)"}
            value={programa.startDate}
            onChangeText={(value) => handleProgramChange(index, 'startDate', value)}
            placeholderTextColor="#B0B0B0"
            keyboardType="numeric"
          />

          <TextInput
            style={styles.input}
            placeholder={language === 'es' ? "Fecha de fin (dd/mm/yyyy)" : "End Date (dd/mm/yyyy)"}
            value={programa.endDate}
            onChangeText={(value) => handleProgramChange(index, 'endDate', value)}
            placeholderTextColor="#B0B0B0"
            keyboardType="numeric"
          />

          {index > 0 && (
            <TouchableOpacity style={styles.deleteButton} onPress={() => handleRemoveProgram(index)}>
              <Icon name="delete" size={24} color="#F28C32" />
              <Text style={styles.deleteButtonText}>{language === 'es' ? 'Eliminar programa' : 'Remove Program'}</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}

      <TouchableOpacity style={styles.button} onPress={confirmAndSave}>
        <Text style={styles.buttonText}>{language === 'es' ? "Guardar" : "Save"}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.addButton} onPress={handleAddProgram}>
        <Icon name="add" size={24} color="#FFFFFF" />
        <Text style={styles.addButtonText}>{language === 'es' ? 'Agregar programa' : 'Add Program'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.linkProjectButton]} onPress={handleLinkProject}>
        <Text style={styles.buttonText}>{language === 'es' ? "Vincular Proyecto" : "Link Project"}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.exitButton]} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.buttonText}>{language === 'es' ? "Salir" : "Exit"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ProgramForm;
