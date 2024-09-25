import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../context/LanguageContext';
import { firestore } from '../firebase/firebase';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore'; // Incluí deleteDoc para eliminar programas
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useUserRole } from '../context/UserRoleContext';
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
    startDate: '',
    endDate: ''
  }]);

  const [searchID, setSearchID] = useState(''); // ID del programa a buscar

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

  // Validar que un programa existente tenga el formato correcto
  const validateProgram = (programa) => {
    if (!programa.programID || !programa.programName || !programa.programDescription || !programa.programBudget || !programa.startDate || !programa.endDate) {
      Alert.alert(language === 'es' ? "Error" : "Error", language === 'es' ? "Por favor, completa todos los campos del programa" : "Please complete all fields for the program");
      return false;
    }

    const budget = parseFloat(programa.programBudget);
    if (isNaN(budget) || budget <= 0) {
      Alert.alert(language === 'es' ? "Error de presupuesto" : "Budget Error", language === 'es' ? "El presupuesto debe ser un número positivo" : "The budget must be a positive number");
      return false;
    }

    if (programa.programName.length < 3) {
      Alert.alert(language === 'es' ? "Error en el nombre" : "Name Error", language === 'es' ? "El nombre del programa debe tener al menos 3 caracteres" : "The program name must have at least 3 characters");
      return false;
    }

    if (programa.programDescription.length < 10) {
      Alert.alert(language === 'es' ? "Error en la descripción" : "Description Error", language === 'es' ? "La descripción del programa debe tener al menos 10 caracteres" : "The program description must have at least 10 characters");
      return false;
    }

    return true;
  };

  // Validar fechas válidas (evitar días/meses inválidos)
  const isValidDate = (day, month, year) => {
    const dayInt = parseInt(day, 10);
    const monthInt = parseInt(month, 10);
    const yearInt = parseInt(year, 10);
    if (monthInt < 1 || monthInt > 12) return false;

    const daysInMonth = [31, (yearInt % 4 === 0 && yearInt % 100 !== 0) || (yearInt % 400 === 0) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return dayInt > 0 && dayInt <= daysInMonth[monthInt - 1];
  };

  // Formatear fecha en formato dd/mm/yyyy
  const formatAndSetDate = (index, field, value) => {
    let formattedValue = value.replace(/[^\d]/g, '');
    
    if (formattedValue.length >= 2 && formattedValue.length <= 4) {
      formattedValue = `${formattedValue.substring(0, 2)}/${formattedValue.substring(2)}`;
    } else if (formattedValue.length > 4) {
      formattedValue = `${formattedValue.substring(0, 2)}/${formattedValue.substring(2, 4)}/${formattedValue.substring(4, 8)}`;
    }

    if (formattedValue.length === 10) {
      const [day, month, year] = formattedValue.split('/');
      if (!isValidDate(day, month, year)) {
        Alert.alert(language === 'es' ? "Error de fecha" : "Date Error", language === 'es' ? "La fecha es inválida. Verifica los días y meses." : "Invalid date. Check the day and month.");
        return;
      }
    }

    const newProgramas = [...programas];
    newProgramas[index][field] = formattedValue;
    setProgramas(newProgramas);
  };

  // Buscar un programa existente en Firestore
  const handleSearchProgram = async () => {
    if (!searchID) {
      Alert.alert(language === 'es' ? "Error" : "Error", language === 'es' ? "Por favor, introduce el ID del programa" : "Please enter the Program ID");
      return;
    }

    try {
      const docRef = doc(firestore, 'programs', searchID);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setProgramas([{
          programID: searchID,
          programName: data.programName,
          programDescription: data.programDescription,
          programBudget: data.programBudget,
          startDate: data.startDate,
          endDate: data.endDate
        }]);
        Alert.alert(language === 'es' ? "Programa encontrado" : "Program Found");
      } else {
        Alert.alert(language === 'es' ? "No encontrado" : "Not Found", language === 'es' ? "No existe un programa con este ID" : "There is no program with this ID");
      }
    } catch (error) {
      Alert.alert(language === 'es' ? "Error de búsqueda" : "Search Error", language === 'es' ? "Hubo un error al buscar el programa" : "There was an error searching for the program");
    }
  };

  // Guardar programa en Firestore
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
          startDate: programa.startDate,
          endDate: programa.endDate,
        });
      }
      Alert.alert(language === 'es' ? "Guardado exitoso" : "Saved successfully");
    } catch (error) {
      Alert.alert(language === 'es' ? "Error al guardar" : "Save Error", language === 'es' ? "Hubo un error al guardar los datos" : "There was an error saving the data");
    }
  };

  // Añadir un nuevo programa
  const handleAddProgram = () => {
    setProgramas([
      ...programas,
      {
        programID: '',
        programName: '',
        programDescription: '',
        programBudget: '',
        startDate: '',
        endDate: ''
      }
    ]);
  };

  // Eliminar un programa
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

  // Función para navegar a la pantalla de vinculación de proyectos
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
            navigation.navigate('ProjectForm'); // Asegúrate de que la ruta a 'ProjectForm' esté definida en tu navegación
          }
        }
      ]
    );
  };

  // Cambiar valor de un campo del programa
  const handleProgramChange = (index, field, value) => {
    const newProgramas = [...programas];
    newProgramas[index][field] = value;
    setProgramas(newProgramas);
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
          
          <TextInput
            style={styles.input}
            placeholder={language === 'es' ? "Presupuesto del programa" : "Program Budget"}
            value={programa.programBudget}
            onChangeText={(value) => handleProgramChange(index, 'programBudget', value)}
            keyboardType="numeric"
            placeholderTextColor="#B0B0B0"
          />

          <TextInput
            style={styles.input}
            placeholder={language === 'es' ? "Fecha de inicio (dd/mm/yyyy)" : "Start Date (dd/mm/yyyy)"}
            value={programa.startDate}
            onChangeText={(value) => formatAndSetDate(index, 'startDate', value)}
            placeholderTextColor="#B0B0B0"
            keyboardType="numeric"
          />

          <TextInput
            style={styles.input}
            placeholder={language === 'es' ? "Fecha de fin (dd/mm/yyyy)" : "End Date (dd/mm/yyyy)"}
            value={programa.endDate}
            onChangeText={(value) => formatAndSetDate(index, 'endDate', value)}
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

      {/* Botón para guardar */}
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>{language === 'es' ? "Guardar" : "Save"}</Text>
      </TouchableOpacity>

      {/* Botón para vincular proyecto */}
      <TouchableOpacity style={[styles.button, styles.linkProjectButton]} onPress={handleLinkProject}>
        <Text style={styles.buttonText}>{language === 'es' ? "Vincular proyecto" : "Link Project"}</Text>
      </TouchableOpacity>

      {/* Botón para agregar otro programa */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddProgram}>
        <Icon name="add" size={24} color="#FFFFFF" />
        <Text style={styles.addButtonText}>{language === 'es' ? 'Agregar programa' : 'Add Program'}</Text>
      </TouchableOpacity>

      {/* Botón para salir */}
      <TouchableOpacity style={[styles.button, styles.exitButton]} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.buttonText}>{language === 'es' ? "Salir" : "Exit"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ProgramForm;
