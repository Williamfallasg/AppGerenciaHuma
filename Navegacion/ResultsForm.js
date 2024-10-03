import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { setDoc, doc, collection, getDocs } from 'firebase/firestore';
import { firestore } from '../firebase/firebase'; 
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../context/LanguageContext'; 
import { Picker } from '@react-native-picker/picker';
import styles from '../styles/stylesResultsForm'; 

const ResultsForm = () => {
  const navigation = useNavigation();
  const { language } = useLanguage();

  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [activities, setActivities] = useState([
    {
      id: 1,
      activity: '',
      globalIndicator: '',
      countries: {},
    },
  ]);

  const [totalCompleted, setTotalCompleted] = useState(0); // Total de indicadores cumplidos
  const [totalPending, setTotalPending] = useState(0); // Total pendiente de cumplir
  const [newCountryName, setNewCountryName] = useState(''); // Nombre del país a agregar

  const currencies = {
    USD: '$',
    CRC: '₡',
    EUR: '€',
    PAB: 'B/.',
    SVC: '₡',
  };

  useEffect(() => {
    // Obtener los proyectos desde Firestore
    const fetchProjects = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, 'projects'));
        const fetchedProjects = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProjects(fetchedProjects);
      } catch (error) {
        console.error("Error fetching projects: ", error);
      }
    };

    fetchProjects();
  }, []);

  const handleAddCountry = (activityId) => {
    if (!newCountryName.trim()) {
      Alert.alert(
        language === 'es' ? 'Error' : 'Error',
        language === 'es' ? 'Por favor, ingresa un nombre de país válido' : 'Please enter a valid country name'
      );
      return;
    }

    setActivities(activities.map(activity => {
      if (activity.id === activityId) {
        if (activity.countries[newCountryName]) {
          Alert.alert(
            language === 'es' ? 'Error' : 'Error',
            language === 'es' ? 'El país ya existe para esta actividad' : 'Country already exists for this activity'
          );
          return activity;
        }

        const newCountry = {
          goal: '', progress: '', pending: '', budgeted: '', executed: '', difference: '', currency: 'USD', executedCurrency: 'USD'
        };
        const updatedCountries = { ...activity.countries, [newCountryName]: newCountry };
        return { ...activity, countries: updatedCountries };
      }
      return activity;
    }));

    setNewCountryName(''); // Limpiar el campo del nombre del país después de agregarlo
    updateTotals();
  };

  const handleActivityChange = (activityId, countryName, field, value) => {
    setActivities(activities.map(activity => {
      if (activity.id === activityId) {
        if (countryName === null) {
          return { ...activity, [field]: value };
        }

        if (activity.countries[countryName]) {
          const updatedCountries = { ...activity.countries };
          updatedCountries[countryName][field] = value;

          // Calcular 'pending' si cambian 'goal' o 'progress' para cada país
          if (field === 'goal' || field === 'progress') {
            updatedCountries[countryName].pending =
              parseFloat(updatedCountries[countryName].goal || 0) - parseFloat(updatedCountries[countryName].progress || 0);
          }

          // Verificar las monedas y calcular 'difference' si son iguales para cada país
          if (field === 'budgeted' || field === 'executed' || field === 'currency' || field === 'executedCurrency') {
            if (updatedCountries[countryName].currency !== updatedCountries[countryName].executedCurrency) {
              Alert.alert(
                language === 'es' ? 'Error de Moneda' : 'Currency Mismatch',
                language === 'es' ? 'Las monedas de Presupuesto y Ejecutado deben ser iguales para calcular la diferencia' : 'The Budgeted and Executed currencies must be the same to calculate the difference'
              );
              updatedCountries[countryName].difference = ''; // Limpiar el campo diferencia si las monedas son diferentes
            } else {
              updatedCountries[countryName].difference =
                parseFloat(updatedCountries[countryName].budgeted || 0) - parseFloat(updatedCountries[countryName].executed || 0);
            }
          }

          return { ...activity, countries: updatedCountries };
        }
      }
      return activity;
    }));

    updateTotals();
  };

  const updateTotals = () => {
    let totalProgress = 0;
    let totalGoal = 0;

    activities.forEach(activity => {
      if (activity.countries) {
        Object.values(activity.countries).forEach(country => {
          totalProgress += parseFloat(country.progress || 0);
          totalGoal += parseFloat(country.goal || 0);
        });
      }
    });

    setTotalCompleted(totalProgress);
    setTotalPending(totalGoal - totalProgress);
  };

  const handleSave = async () => {
    try {
      if (!selectedProject) {
        Alert.alert(
          language === 'es' ? 'Error' : 'Error',
          language === 'es' ? 'Por favor, selecciona un proyecto' : 'Please select a project'
        );
        return;
      }

      const currentActivity = activities[activities.length - 1]; // Última actividad agregada

      if (!currentActivity.activity) {
        Alert.alert(
          language === 'es' ? 'Error' : 'Error',
          language === 'es' ? 'Por favor, completa todos los campos obligatorios' : 'Please fill out all required fields'
        );
        return;
      }

      // Guardar la actividad actual en Firestore vinculada con el proyecto seleccionado
      const activityToSave = { ...currentActivity, projectId: selectedProject };
      await setDoc(doc(firestore, 'results', currentActivity.activity), activityToSave);

      Alert.alert(language === 'es' ? 'Guardado exitoso' : 'Saved successfully');

      // Preparar la siguiente actividad automáticamente
      const nextActivity = {
        id: currentActivity.id + 1,
        activity: '',
        globalIndicator: '',
        countries: {},
      };
      setActivities([...activities, nextActivity]);

    } catch (error) {
      console.error("Error saving results:", error);
      Alert.alert(language === 'es' ? 'Error' : 'Error', language === 'es' ? 'Hubo un error al guardar los resultados' : 'There was an error saving the results');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.sectionTitle}>
        {language === 'es' ? 'Actividades del proyecto' : 'Project Activities'}
      </Text>

      {/* Selector del Proyecto */}
      <Text style={styles.label}>
        {language === 'es' ? 'Seleccionar Proyecto' : 'Select Project'}
      </Text>
      <Picker
        selectedValue={selectedProject}
        onValueChange={(value) => setSelectedProject(value)}
        style={styles.customPicker}
      >
        <Picker.Item label={language === 'es' ? 'Selecciona un proyecto' : 'Select a project'} value="" />
        {projects.map((project) => (
          <Picker.Item key={project.id} label={project.projectName} value={project.id} />
        ))}
      </Picker>

      {activities.map(({ id, activity, globalIndicator, countries }) => (
        <View key={id} style={styles.card}>
          <Text style={styles.subTitle}>
            {language === 'es' ? `Actividad ${id}` : `Activity ${id}`}
          </Text>

          <TextInput
            style={styles.input}
            placeholder={language === 'es' ? 'Actividad' : 'Activity'}
            value={activity}
            onChangeText={(text) => handleActivityChange(id, null, 'activity', text)}
          />

          <TextInput
            style={styles.input}
            placeholder={language === 'es' ? 'Indicador Global' : 'Global Indicator'}
            value={globalIndicator}
            onChangeText={(text) => handleActivityChange(id, null, 'globalIndicator', text)}
            keyboardType="numeric"
          />

          {Object.keys(countries).map((countryName) => (
            <View key={countryName}>
              <Text style={styles.subTitle}>
                {countryName}
              </Text>

              <TextInput
                style={styles.input}
                placeholder={language === 'es' ? 'Meta País' : 'Country Goal'}
                value={countries[countryName].goal}
                onChangeText={(text) => handleActivityChange(id, countryName, 'goal', text)}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.input}
                placeholder={language === 'es' ? 'Avance' : 'Progress'}
                value={countries[countryName].progress}
                onChangeText={(text) => handleActivityChange(id, countryName, 'progress', text)}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.input}
                placeholder={language === 'es' ? 'Pendiente' : 'Pending'}
                value={countries[countryName].pending.toString()}
                editable={false}
              />

              {/* Budget and Executed Fields with Currency */}
              <Text style={styles.label}>
                {language === 'es' ? 'Moneda del Presupuesto' : 'Budget Currency'}
              </Text>
              <View style={styles.pickerContainer}>
                <Icon name="monetization-on" size={24} color="#333" style={styles.pickerIcon} />
                <Picker
                  selectedValue={countries[countryName].currency}
                  onValueChange={(value) => handleActivityChange(id, countryName, 'currency', value)}
                  style={styles.customPicker}
                >
                  {Object.entries(currencies).map(([key, symbol]) => (
                    <Picker.Item key={key} label={`${key} (${symbol})`} value={key} />
                  ))}
                </Picker>
              </View>

              <TextInput
                style={styles.input}
                placeholder={language === 'es' ? 'Presupuestado' : 'Budgeted'}
                value={countries[countryName].budgeted}
                onChangeText={(text) => handleActivityChange(id, countryName, 'budgeted', text)}
                keyboardType="numeric"
              />

              <Text style={styles.label}>
                {language === 'es' ? 'Moneda Ejecutada' : 'Executed Currency'}
              </Text>
              <View style={styles.pickerContainer}>
                <Icon name="monetization-on" size={24} color="#333" style={styles.pickerIcon} />
                <Picker
                  selectedValue={countries[countryName].executedCurrency}
                  onValueChange={(value) => handleActivityChange(id, countryName, 'executedCurrency', value)}
                  style={styles.customPicker}
                >
                  {Object.entries(currencies).map(([key, symbol]) => (
                    <Picker.Item key={key} label={`${key} (${symbol})`} value={key} />
                  ))}
                </Picker>
              </View>

              <TextInput
                style={styles.input}
                placeholder={language === 'es' ? 'Ejecutado' : 'Executed'}
                value={countries[countryName].executed}
                onChangeText={(text) => handleActivityChange(id, countryName, 'executed', text)}
                keyboardType="numeric"
              />

              <TextInput
                style={styles.input}
                placeholder={language === 'es' ? 'Diferencia' : 'Difference'}
                value={countries[countryName].difference.toString()}
                editable={false}
              />
            </View>
          ))}

          {/* Campo para ingresar el nombre del nuevo país */}
          <TextInput
            style={styles.input}
            placeholder={language === 'es' ? 'Nombre del País' : 'Country Name'}
            value={newCountryName}
            onChangeText={(text) => setNewCountryName(text)}
          />

          <TouchableOpacity style={styles.addButton} onPress={() => handleAddCountry(id)}>
            <Icon name="add" size={24} color="#FFFFFF" />
            <Text style={styles.addButtonText}>
              {language === 'es' ? 'Agregar País' : 'Add Country'}
            </Text>
          </TouchableOpacity>
        </View>
      ))}

      {/* Total Indicador Cumplido */}
      <View style={styles.totalsContainer}>
        <Text style={styles.totalLabel}>
          {language === 'es' ? 'Total Indicador Cumplido' : 'Total Completed Indicator'}: {totalCompleted}
        </Text>
        <Text style={styles.totalLabel}>
          {language === 'es' ? 'Total Pendiente' : 'Total Pending'}: {totalPending}
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>
          {language === 'es' ? 'Guardar' : 'Save'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.exitButton]} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.buttonText}>
          {language === 'es' ? 'Salir' : 'Exit'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ResultsForm;
