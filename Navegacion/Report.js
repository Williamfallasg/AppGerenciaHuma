import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../context/LanguageContext';
import { useUserRole } from '../context/UserRoleContext';
import { firestore } from '../firebase/firebase'; // Importar firestore desde la configuración de Firebase
import { collection, getDocs } from 'firebase/firestore';
import styles from '../styles/stylesReport';

const Report = ({ route }) => {
  const navigation = useNavigation();
  const { language } = useLanguage();
  const { userRole } = useUserRole();
  const { selectedOption } = route.params || {};

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [beneficiariesCount, setBeneficiariesCount] = useState(0); // Nuevo estado para contar los beneficiarios
  const screenWidth = Dimensions.get('window').width;

  // Helper para cambiar el idioma
  const translate = (textEs, textEn) => (language === 'es' ? textEs : textEn);

  // Función para validar acceso del usuario
  const checkAccessAndRedirect = () => {
    if (userRole !== 'admin') {
      Alert.alert(
        'Acceso denegado',
        'No tiene permisos para acceder a esta sección.',
        [{ text: 'Aceptar', onPress: () => navigation.goBack() }]
      );
    }
  };

  useEffect(() => {
    checkAccessAndRedirect();
    fetchData(); // Llamada a la función para obtener datos
  }, [userRole]);

  // Función para obtener datos de Firestore según la opción seleccionada
  const fetchData = async () => {
    setLoading(true);
    try {
      let querySnapshot;

      // Obtener la colección correspondiente según la opción seleccionada
      if (selectedOption === 'Programas') {
        querySnapshot = await getDocs(collection(firestore, 'programs'));
      } else if (selectedOption === 'Proyectos') {
        querySnapshot = await getDocs(collection(firestore, 'projects'));
      } else if (selectedOption === 'Beneficiarios') {
        querySnapshot = await getDocs(collection(firestore, 'users')); // Cambiamos a 'users' para obtener beneficiarios
        setBeneficiariesCount(querySnapshot.size); // Guardar el número total de beneficiarios
      } else {
        throw new Error('Opción desconocida seleccionada');
      }

      // Mapear los documentos para obtener los datos
      const itemsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setData(itemsList);
    } catch (error) {
      Alert.alert('Error', `No se pudo obtener la información. Detalles del error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (userRole !== 'admin') {
    return null; 
  }

  const handleGoBack = () => {
    navigation.navigate('GenerateReport');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        {translate('Informe del Proyecto', 'Project Report')}
      </Text>
      <Text style={styles.subtitle}>
        {translate('Tipo de Informe:', 'Report Type:')} {selectedOption}
      </Text>

      {/* Mostrar el número de beneficiarios si se seleccionó "Beneficiarios" */}
      {selectedOption === 'Beneficiarios' && !loading && (
        <Text style={styles.subtitle}>
          {translate('Número de Beneficiarios Registrados:', 'Number of Registered Beneficiaries:')} {beneficiariesCount}
        </Text>
      )}

      {/* Mostrar el indicador de carga mientras se obtienen los datos */}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View style={styles.dataContainer}>
          {/* Renderizar los datos obtenidos */}
          {data.length > 0 ? (
            data.map((item, index) => (
              <View key={index} style={styles.dataItem}>
                <Text style={styles.itemTitle}>
                  {item.programName || item.projectName || item.name || 'Nombre no disponible'}
                </Text>
                <Text style={styles.itemDescription}>
                  {item.programDescription || item.projectDescription || item.country || 'Descripción no disponible'}
                </Text>
                <Text style={styles.itemDetail}>
                  {`${translate('Edad', 'Age')}: ${item.age || 'N/A'}`}
                </Text>
                <Text style={styles.itemDetail}>
                  {`${translate('Teléfono', 'Phone')}: ${item.phone || 'N/A'}`}
                </Text>
                <Text style={styles.itemDetail}>
                  {`${translate('Proyectos Asignados', 'Assigned Projects')}: ${item.projects ? item.projects.join(', ') : 'N/A'}`}
                </Text>
              </View>
            ))
          ) : (
            <Text>{translate('No se encontraron datos para mostrar.', 'No data available to display.')}</Text>
          )}
        </View>
      )}

      <TouchableOpacity style={styles.exitButton} onPress={handleGoBack}>
        <Text style={styles.exitButtonText}>
          {translate('Salir', 'Exit')}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Report;
