import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../context/LanguageContext';
import { firestore } from '../firebase/firebase';
import { doc, setDoc } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useUserRole } from '../context/UserRoleContext';
import { Picker } from '@react-native-picker/picker'; // Import Picker
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
    programCurrency: 'USD', // Moneda inicial
    startDate: '',
    endDate: ''
  }]);

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
    switch (currency) {
      case 'CRC': return '₡'; // Colones Costarricenses
      case 'USD': return '$';  // Dólares Estadounidenses
      case 'MXN': return '$';  // Pesos Mexicanos
      case 'HNL': return 'L';  // Lempiras Hondureñas
      case 'EUR': return '€';  // Euros
      case 'NIO': return 'C$'; // Córdoba Nicaragüense
      case 'SVC': return '₡';  // Colón Salvadoreño
      case 'PAB': return 'B/.'; // Balboa Panameño
      case 'GTQ': return 'Q';   // Quetzal Guatemalteco
      case 'CAD': return 'CA$'; // Dólar Canadiense
      case 'AUD': return 'A$';  // Dólar Australiano
      case 'GBP': return '£';   // Libra Esterlina
      case 'JPY': return '¥';   // Yen Japonés
      default: return '';
    }
  };

  // Función para validar que la fecha de fin sea posterior a la fecha de inicio
  const isEndDateValid = (startDate, endDate) => {
    const [startDay, startMonth, startYear] = startDate.split('/').map(Number);
    const [endDay, endMonth, endYear] = endDate.split('/').map(Number);

    const start = new Date(startYear, startMonth - 1, startDay);
    const end = new Date(endYear, endMonth - 1, endDay);

    return end >= start; // La fecha de fin debe ser igual o posterior a la fecha de inicio
  };

  // Maneja el cambio de moneda
  const handleCurrencyChange = (index, value) => {
    const newProgramas = [...programas];
    const symbol = getCurrencySymbol(value);
    
    const currentBudget = newProgramas[index].programBudget.replace(/[^\d.]/g, ''); // Remover cualquier símbolo actual
    
    newProgramas[index].programCurrency = value;
    newProgramas[index].programBudget = `${symbol}${currentBudget}`; // Agregar símbolo al presupuesto

    setProgramas(newProgramas);
  };

  // Maneja el cambio de cualquier campo del programa
  const handleProgramChange = (index, field, value) => {
    const newProgramas = [...programas];
    newProgramas[index][field] = value;
    setProgramas(newProgramas);
  };

  // Confirmar y guardar el programa en Firestore
  const confirmAndSave = () => {
    // Crear un resumen de los programas para la confirmación
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

    // Mostrar alerta de confirmación
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

  // Guardar el programa en Firestore
  const handleSave = async () => {
    for (const programa of programas) {
      if (!validateProgram(programa)) {
        return; 
      }

      if (!isEndDateValid(programa.startDate, programa.endDate)) {
        Alert.alert(
          language === 'es' ? "Error de fecha" : "Date Error",
          language === 'es' ? "La fecha de fin debe ser posterior a la fecha de inicio" : "The end date must be after the start date"
        );
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
          programCurrency: programa.programCurrency, // Guardar la moneda
          startDate: programa.startDate,
          endDate: programa.endDate,
        });
      }
      Alert.alert(language === 'es' ? "Guardado exitoso" : "Saved successfully");
    } catch (error) {
      Alert.alert(language === 'es' ? "Error al guardar" : "Save Error", language === 'es' ? "Hubo un error al guardar los datos" : "There was an error saving the data");
    }
  };

  // Agregar un nuevo programa al estado
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

  // Eliminar un programa del estado
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

  // Vincular proyecto con programa
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

          {/* Nuevo picker para seleccionar la moneda */}
          <Picker
            selectedValue={programa.programCurrency}
            style={styles.picker}
            onValueChange={(value) => handleCurrencyChange(index, value)}
          >
            <Picker.Item label="USD (Dólares)" value="USD" />
            <Picker.Item label="CRC (Colones Costarricenses)" value="CRC" />
            <Picker.Item label="MXN (Pesos Mexicanos)" value="MXN" />
            <Picker.Item label="HNL (Lempiras Hondureñas)" value="HNL" />
            <Picker.Item label="EUR (Euros)" value="EUR" />
            <Picker.Item label="NIO (Córdoba Nicaragüense)" value="NIO" />
            <Picker.Item label="SVC (Colón Salvadoreño)" value="SVC" />
            <Picker.Item label="PAB (Balboa Panameño)" value="PAB" />
            <Picker.Item label="GTQ (Quetzal Guatemalteco)" value="GTQ" />
            <Picker.Item label="CAD (Dólar Canadiense)" value="CAD" />
            <Picker.Item label="AUD (Dólar Australiano)" value="AUD" />
            <Picker.Item label="GBP (Libra Esterlina)" value="GBP" />
            <Picker.Item label="JPY (Yen Japonés)" value="JPY" />
          </Picker>

          <TextInput
            style={styles.input}
            placeholder={language === 'es' ? "Presupuesto del programa" : "Program Budget"}
            value={programa.programBudget}
            onChangeText={(value) => {
              const symbol = getCurrencySymbol(programa.programCurrency);
              const numericValue = value.replace(/[^\d.]/g, ''); // Solo permitir números
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
