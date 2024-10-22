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

const continents = {
  America: ['Argentina', 'Brasil', 'Chile', 'México', 'Estados Unidos', 'Canadá', 'Colombia', 'Venezuela', 'Perú', 'Uruguay', 'Paraguay', 'Bolivia', 'Ecuador', 'Costa Rica', 'Panamá', 'Guatemala', 'Honduras', 'El Salvador', 'Nicaragua', 'Cuba', 'Puerto Rico', 'República Dominicana', 'Haití', 'Jamaica'],
  Europa: ['España', 'Francia', 'Alemania', 'Italia', 'Reino Unido', 'Portugal', 'Suecia', 'Suiza', 'Austria', 'Holanda', 'Bélgica', 'Noruega', 'Dinamarca', 'Finlandia', 'Grecia', 'Irlanda', 'Polonia', 'Hungría', 'República Checa', 'Rusia', 'Ucrania', 'Turquía'],
  Asia: ['China', 'Japón', 'India', 'Corea del Sur', 'Tailandia', 'Vietnam', 'Malasia', 'Indonesia', 'Singapur', 'Filipinas', 'Taiwán', 'Hong Kong', 'Pakistán', 'Bangladés', 'Sri Lanka', 'Nepal', 'Kazajistán', 'Uzbekistán', 'Irán', 'Iraq'],
  Africa: ['Sudáfrica', 'Nigeria', 'Kenia', 'Egipto', 'Marruecos', 'Argelia', 'Túnez', 'Angola', 'Etiopía', 'Ghana', 'Senegal', 'Mozambique', 'Zimbabue', 'Namibia', 'Botsuana', 'Camerún', 'Costa de Marfil', 'Sudán', 'Somalia', 'Malawi', 'Zambia', 'República Democrática del Congo'],
  Oceania: ['Australia', 'Nueva Zelanda', 'Papúa Nueva Guinea', 'Fiyi', 'Samoa', 'Tonga', 'Vanuatu', 'Islas Salomón'],
};

// Función para obtener el símbolo de la moneda
const getCurrencySymbol = (currency) => {
  const currencyMap = {
    'USD': '$',
    'CRC': '₡',
    'MXN': '$',
    'EUR': '€',
    'CAD': 'CA$',
  };
  return currencyMap[currency] || ''; 
};

// Función para validar que la fecha de fin sea posterior a la fecha de inicio
const isEndDateValid = (startDate, endDate) => {
  const [startDay, startMonth, startYear] = startDate.split('/').map(Number);
  const [endDay, endMonth, endYear] = endDate.split('/').map(Number);

  const start = new Date(startYear, startMonth - 1, startDay);
  const end = new Date(endYear, endMonth - 1, endDay);

  return end >= start;
};

// Función para validar los datos del programa
const validateProgram = (programa, language) => {
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
    endDate: '',
    selectedContinent: '', // Continente seleccionado
    selectedCountries: {}, // Almacenar los países seleccionados por continente
  }]);

  const currencyOptions = [
    { label: "USD (Dólares)", value: "USD" },
    { label: "CRC (Colones Costarricenses)", value: "CRC" },
    { label: "MXN (Pesos Mexicanos)", value: "MXN" },
    { label: "EUR (Euros)", value: "EUR" },
    { label: "CAD (Dólar Canadiense)", value: "CAD" },
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

  const handleContinentChange = (index, continent) => {
    const newProgramas = [...programas];
    newProgramas[index].selectedContinent = continent;

    if (!newProgramas[index].selectedCountries[continent]) {
      newProgramas[index].selectedCountries[continent] = [];
    }

    setProgramas(newProgramas);
  };

  const handleCountryChange = (index, country) => {
    const newProgramas = [...programas];
    const continent = newProgramas[index].selectedContinent;
    const selectedCountries = newProgramas[index].selectedCountries[continent];

    if (selectedCountries.includes(country)) {
      newProgramas[index].selectedCountries[continent] = selectedCountries.filter(c => c !== country); // Eliminar si ya está seleccionado
    } else {
      newProgramas[index].selectedCountries[continent] = [...selectedCountries, country]; // Agregar país
    }

    setProgramas(newProgramas);
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
        endDate: '',
        selectedContinent: '',
        selectedCountries: {},
      }
    ]);
  };

  const handleRemoveProgram = (index) => {
    const newProgramas = programas.filter((_, i) => i !== index);
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
      summary += `${language === 'es' ? 'Fecha de fin' : 'End Date'}: ${programa.endDate}\n`;

      Object.keys(programa.selectedCountries).forEach(continent => {
        summary += `${language === 'es' ? 'Continente' : 'Continent'}: ${continent}\n`;
        summary += `${language === 'es' ? 'Países seleccionados' : 'Selected Countries'}: ${programa.selectedCountries[continent].join(', ')}\n`;
      });

      summary += '\n';
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
      if (!validateProgram(programa, language)) {
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
          selectedCountries: programa.selectedCountries,
        });
      }
      Alert.alert(language === 'es' ? "Guardado exitoso" : "Saved successfully");
    } catch (error) {
      Alert.alert(language === 'es' ? "Error al guardar" : "Save Error", language === 'es' ? "Hubo un error al guardar los datos" : "There was an error saving the data");
    }
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

          {/* Selector de continente */}
          <Text>{language === 'es' ? "Seleccione el continente donde el programa está disponible:" : "Select the continent where the program is available:"}</Text>
          <Picker
            selectedValue={programa.selectedContinent}
            style={styles.picker}
            onValueChange={(value) => handleContinentChange(index, value)}
          >
            {Object.keys(continents).map(continent => (
              <Picker.Item key={continent} label={continent} value={continent} />
            ))}
          </Picker>

          {/* Selector de país según continente seleccionado */}
          {programa.selectedContinent && (
            <>
              <Text>{language === 'es' ? "Seleccione el país donde el programa está disponible:" : "Select the country where the program is available:"}</Text>
              <Picker
                selectedValue="" 
                style={styles.picker}
                onValueChange={(value) => handleCountryChange(index, value)}
              >
                {continents[programa.selectedContinent].map(country => (
                  <Picker.Item key={country} label={country} value={country} />
                ))}
              </Picker>
            </>
          )}

          {/* Lista de países seleccionados */}
          {Object.keys(programa.selectedCountries).length > 0 && (
            <View style={styles.selectedCountriesContainer}>
              {Object.keys(programa.selectedCountries).map(continent => (
                <View key={continent}>
                  <Text>{`${language === 'es' ? "Continente" : "Continent"}: ${continent}`}</Text>
                  {programa.selectedCountries[continent].map((country, idx) => (
                    <View key={idx} style={styles.selectedCountryItem}>
                      <Text>{country}</Text>
                      <TouchableOpacity onPress={() => handleCountryChange(index, country)}>
                        <Icon name="delete" size={20} color="red" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          )}

          {/* Botón para eliminar programa */}
          <TouchableOpacity style={styles.deleteButton} onPress={() => handleRemoveProgram(index)}>
            <Icon name="delete" size={24} color="#F28C32" />
            <Text style={styles.deleteButtonText}>{language === 'es' ? 'Eliminar programa' : 'Remove Program'}</Text>
          </TouchableOpacity>
        </View>
      ))}

      {/* Botón para guardar */}
      <TouchableOpacity style={styles.button} onPress={confirmAndSave}>
        <Text style={styles.buttonText}>{language === 'es' ? "Guardar" : "Save"}</Text>
      </TouchableOpacity>

      {/* Botón para agregar programa */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddProgram}>
        <Icon name="add" size={24} color="#FFFFFF" />
        <Text style={styles.addButtonText}>{language === 'es' ? 'Agregar programa' : 'Add Program'}</Text>
      </TouchableOpacity>

      {/* Botón para vincular proyecto */}
      <TouchableOpacity style={[styles.button, styles.linkProjectButton]} onPress={() => navigation.navigate('ProjectForm')}>
        <Text style={styles.buttonText}>{language === 'es' ? "Vincular Proyecto" : "Link Project"}</Text>
      </TouchableOpacity>

      {/* Botón para salir */}
      <TouchableOpacity style={[styles.button, styles.exitButton]} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.buttonText}>{language === 'es' ? "Salir" : "Exit"}</Text>
      </TouchableOpacity>

    </ScrollView>
  );
};

export default ProgramForm;
