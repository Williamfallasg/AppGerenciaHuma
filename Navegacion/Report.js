import React, { useEffect, useState } from 'react'; 
import { View, Text, Dimensions, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../context/LanguageContext';
import { useUserRole } from '../context/UserRoleContext';
import { firestore } from '../firebase/firebase';
import { collection, getDocs, doc, getDoc, query, where } from 'firebase/firestore';
import styles from '../styles/stylesReport';

const Report = ({ route }) => {
  const navigation = useNavigation();
  const { language } = useLanguage();
  const { userRole } = useUserRole();
  const { selectedOption } = route.params || {};

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [itemCount, setItemCount] = useState(0);
  const screenWidth = Dimensions.get('window').width;

  const translate = (textEs, textEn) => (language === 'es' ? textEs : textEn);

  // Navegación condicional dependiendo del tipo de reporte seleccionado
  const handleNavigateToChart = () => {
    if (selectedOption === 'Programas') {
      navigation.navigate('ProgramChartScreen', { programData: data });
    } else if (selectedOption === 'Beneficiarios') {
      navigation.navigate('ChartScreen', { selectedOption });
    }
  };

  const checkAccessAndRedirect = () => {
    if (userRole !== 'admin') {
      Alert.alert(
        translate('Acceso denegado', 'Access Denied'),
        translate('No tiene permisos para acceder a esta sección.', 'You do not have permission to access this section.'),
        [{ text: translate('Aceptar', 'OK'), onPress: () => navigation.goBack() }]
      );
    }
  };

  useEffect(() => {
    checkAccessAndRedirect();
    fetchData();
  }, [userRole]);

  // Obtener datos de Firestore según la opción seleccionada
  const fetchData = async () => {
    setLoading(true);
    try {
      let querySnapshot;

      if (selectedOption === 'Programas') {
        querySnapshot = await getDocs(collection(firestore, 'programs'));
        setItemCount(querySnapshot.size);

        const programsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const updatedProgramsData = await Promise.all(programsData.map(async (program) => {
          if (program.projects && program.projects.length > 0) {
            const projectNames = await Promise.all(program.projects.map(async (projectId) => {
              try {
                const projectDoc = await getDoc(doc(firestore, 'projects', projectId));
                return projectDoc.exists() ? projectDoc.data().projectName : translate('Nombre no disponible', 'Name not available');
              } catch (error) {
                console.error(`Error al obtener el nombre del proyecto con ID: ${projectId}`, error);
                return translate('Nombre no disponible', 'Name not available');
              }
            }));

            // Consulta para contar los beneficiarios vinculados a los proyectos del programa
            const usersSnapshot = await getDocs(query(collection(firestore, 'users'), where('projects', 'array-contains-any', program.projects)));
            const numberOfBeneficiaries = usersSnapshot.size;

            return {
              ...program,
              projectNames: projectNames || [], // Asegurando que projectNames siempre sea un arreglo
              numberOfBeneficiaries, // Aquí se almacena el número de beneficiarios
              fulfilledIndicators: program.fulfilledIndicators || 0, // Campo de indicadores cumplidos
              countries: program.countries || [], // Campo de países (asegurar que existe en Firestore)
            };
          }
          return { ...program, projectNames: [], numberOfBeneficiaries: 0, fulfilledIndicators: 0, countries: [] };
        }));

        setData(updatedProgramsData);
      } else if (selectedOption === 'Proyectos') {
        querySnapshot = await getDocs(collection(firestore, 'projects'));
        setItemCount(querySnapshot.size);

        const projectsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setData(projectsData);
      } else if (selectedOption === 'Beneficiarios') {
        querySnapshot = await getDocs(collection(firestore, 'users'));
        setItemCount(querySnapshot.size);

        const usersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const updatedUsersData = await Promise.all(usersData.map(async (user) => {
          if (user.projects && user.projects.length > 0) {
            const projectNames = await Promise.all(user.projects.map(async (projectId) => {
              try {
                const projectDoc = await getDoc(doc(firestore, 'projects', projectId));
                return projectDoc.exists() ? projectDoc.data().projectName : translate('Nombre no disponible', 'Name not available');
              } catch (error) {
                console.error(`Error al obtener el nombre del proyecto con ID: ${projectId}`, error);
                return translate('Nombre no disponible', 'Name not available');
              }
            }));
            return { ...user, projectNames: projectNames || [] }; // Asegurando que projectNames siempre sea un arreglo
          }
          return { ...user, projectNames: [] };
        }));

        setData(updatedUsersData);
      } else {
        throw new Error(translate('Opción desconocida seleccionada', 'Unknown option selected'));
      }
    } catch (error) {
      Alert.alert('Error', `${translate('No se pudo obtener la información.', 'Could not fetch information.')}\n${translate('Detalles del error:', 'Error details:')} ${error.message}`);
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
        {translate('Informe del Programa', 'Program Report')}
      </Text>
      <Text style={styles.subtitle}>
        {translate('Tipo de Informe:', 'Report Type:')} {selectedOption}
      </Text>

      {!loading && (
        <Text style={styles.subtitle}>
          {translate(`Número de ${selectedOption}:`, `Number of ${selectedOption}:`)} {itemCount}
        </Text>
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View style={styles.dataContainer}>
          {data.length > 0 ? (
            data.map((item, index) => (
              <View key={index} style={styles.dataItem}>
                {selectedOption === 'Programas' && (
                  <>
                    <Text style={styles.itemTitle}>
                      {`${translate('Nombre del Programa', 'Program Name')}: ${item.programName || 'N/A'}`}
                    </Text>
                    <Text style={styles.itemDetail}>
                      {`${translate('Proyectos Vinculados', 'Linked Projects')}: ${item.projectNames && item.projectNames.length > 0 ? item.projectNames.join(', ') : 'N/A'}`}
                    </Text>
                    <Text style={styles.itemDetail}>
                      {`${translate('Número de Beneficiarios', 'Number of Beneficiaries')}: ${item.numberOfBeneficiaries}`}
                    </Text>
                    <Text style={styles.itemDetail}>
                      {`${translate('Indicadores Cumplidos', 'Fulfilled Indicators')}: ${item.fulfilledIndicators}`}
                    </Text>
                    <Text style={styles.itemDetail}>
                      {`${translate('Países', 'Countries')}: ${item.countries && item.countries.length > 0 ? item.countries.join(', ') : 'N/A'}`}
                    </Text>
                  </>
                )}

                {selectedOption === 'Proyectos' && (
                  <>
                    <Text style={styles.itemTitle}>
                      {`${translate('Nombre del Proyecto', 'Project Name')}: ${item.projectName || 'N/A'}`}
                    </Text>
                    <Text style={styles.itemDetail}>
                      {`${translate('Actividades Vinculadas', 'Linked Activities')}: ${item.activities ? item.activities.join(', ') : 'N/A'}`}
                    </Text>
                  </>
                )}

                {selectedOption === 'Beneficiarios' && (
                  <>
                    <Text style={styles.itemTitle}>
                      {`${translate('Nombre', 'Name')}: ${item.name || 'N/A'}`}
                    </Text>
                    <Text style={styles.itemDetail}>
                      {`${translate('País', 'Country')}: ${item.countries && item.countries.length > 0 ? item.countries.join(', ') : 'N/A'}`}
                    </Text>
                    <Text style={styles.itemDetail}>
                      {`${translate('Edad', 'Age')}: ${item.age || 'N/A'}`}
                    </Text>
                    <Text style={styles.itemDetail}>
                      {`${translate('Teléfono', 'Phone')}: ${item.phone || 'N/A'}`}
                    </Text>
                    <Text style={styles.itemDetail}>
                      {`${translate('Padecimiento', 'Medical Condition')}: ${item.medicalCondition || 'N/A'}`}
                    </Text>
                    <Text style={styles.itemDetail}>
                      {`${translate('Proyectos Asignados', 'Assigned Projects')}: ${item.projectNames && item.projectNames.length > 0 ? item.projectNames.join(', ') : 'N/A'}`}
                    </Text>
                    <Text style={styles.itemDetail}>
                      {`${translate('Actividades', 'Activities')}: ${item.activities ? item.activities.join(', ') : 'N/A'}`}
                    </Text>
                  </>
                )}
              </View>
            ))
          ) : (
            <Text>{translate('No se encontraron datos para mostrar.', 'No data available to display.')}</Text>
          )}
        </View>
      )}

      {/* Botón para navegar al gráfico */}
      <TouchableOpacity style={styles.graphButton} onPress={handleNavigateToChart}>
        <Text style={styles.graphButtonText}>{translate('Ver Gráfico', 'View Chart')}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.exitButton} onPress={handleGoBack}>
        <Text style={styles.exitButtonText}>{translate('Salir', 'Exit')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Report;
