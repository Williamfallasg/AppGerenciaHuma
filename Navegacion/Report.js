import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../context/LanguageContext';
import { useUserRole } from '../context/UserRoleContext';
import { firestore } from '../firebase/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
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

  const handleNavigateToChart = () => {
    if (selectedOption === 'Proyectos') {
      navigation.navigate('ProjectChartScreen', { projectData: data });
    } else if (selectedOption === 'Programas') {
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

  const fetchData = async () => {
    setLoading(true);
    try {
      let querySnapshot;

      if (selectedOption === 'Programas') {
        querySnapshot = await getDocs(collection(firestore, 'programs'));
        setItemCount(querySnapshot.size);

        const programsData = await Promise.all(
          querySnapshot.docs.map(async (docSnapshot) => {
            const program = { id: docSnapshot.id, ...docSnapshot.data() };

            // Verificación de la existencia de proyectos vinculados
            if (program.projects && program.projects.length > 0) {
              const projectNames = await Promise.all(
                program.projects.map(async (projectId) => {
                  if (projectId) { // Verificamos si projectId es válido
                    const projectDocRef = doc(firestore, 'projects', projectId);
                    const projectDocSnapshot = await getDoc(projectDocRef);
                    return projectDocSnapshot.exists() ? projectDocSnapshot.data().projectName : translate('N/A', 'N/A');
                  } else {
                    return translate('N/A', 'N/A');
                  }
                })
              );
              program.projectNames = projectNames;
            } else {
              program.projectNames = [];
            }

            return program;
          })
        );

        setData(programsData);
      } else if (selectedOption === 'Proyectos') {
        querySnapshot = await getDocs(collection(firestore, 'projects'));
        setItemCount(querySnapshot.size);

        const projectsData = querySnapshot.docs.map((docSnapshot) => ({ id: docSnapshot.id, ...docSnapshot.data() }));

        const updatedProjectsData = projectsData.map((project) => {
          const { activities = [] } = project;
          const formattedActivities = activities.map((activity) => ({
            id: activity.id,
            activityName: activity.activity,
            startDate: activity.startDate,
            endDate: activity.endDate,
            beneficiaries: activity.beneficiaries,
            indicators: activity.indicators || [],
          }));
          return { ...project, activities: formattedActivities, numberOfBeneficiaries: project.beneficiaries || 'N/A' };
        });

        setData(updatedProjectsData);
      } else if (selectedOption === 'Beneficiarios') {
        querySnapshot = await getDocs(collection(firestore, 'users'));
        setItemCount(querySnapshot.size);

        const usersData = querySnapshot.docs.map((docSnapshot) => ({ id: docSnapshot.id, ...docSnapshot.data() }));
        setData(usersData);
      } else {
        throw new Error(translate('Opción desconocida seleccionada', 'Unknown option selected'));
      }
    } catch (error) {
      Alert.alert('Error', `${translate('No se pudo obtener la información.', 'Could not fetch information.')}\n${translate('Detalles del error:', 'Error details:')} ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getSexInSpanish = (gender) => {
    if (!gender) return 'N/A';
    switch (gender.toLowerCase()) {
      case 'male':
        return 'Masculino';
      case 'female':
        return 'Femenino';
      default:
        return 'Otro';
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
      <Text style={styles.title}>{translate('Informe ', 'Inform')}</Text>
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
                      {`${translate('Proyectos Vinculados', 'Linked Projects')}: ${
                        Array.isArray(item.projectNames) && item.projectNames.length > 0
                          ? item.projectNames.join(', ')
                          : translate('N/A', 'N/A')
                      }`}
                    </Text>
                    <Text style={styles.itemDetail}>
                      {`${translate('Número de Beneficiarios', 'Number of Beneficiaries')}: ${item.numberOfBeneficiaries}`}
                    </Text>
                    <Text style={styles.itemDetail}>
                      {`${translate('Indicadores Cumplidos', 'Fulfilled Indicators')}: ${item.fulfilledIndicators}`}
                    </Text>
                    <Text style={styles.itemDetail}>
                      {`${translate('Países donde está disponible:', 'Countries Available In:')} ${
                        item.selectedCountries && Object.values(item.selectedCountries).flat().length > 0
                          ? Object.values(item.selectedCountries).flat().join(', ')
                          : 'N/A'
                      }`}
                    </Text>
                  </>
                )}

                {selectedOption === 'Proyectos' && (
                  <>
                    <Text style={styles.itemTitle}>
                      {`${translate('Nombre del Proyecto', 'Project Name')}: ${item.projectName || 'N/A'}`}
                    </Text>
                    <Text style={styles.itemDetail}>
                      {`${translate('Actividades Vinculadas', 'Linked Activities')}: ${
                        item.activities && item.activities.length > 0
                          ? item.activities.map((a) => a.activityName).join(', ')
                          : 'N/A'
                      }`}
                    </Text>
                    <Text style={styles.itemDetail}>
                      {`${translate('Número de Beneficiarios', 'Number of Beneficiaries')}: ${item.numberOfBeneficiaries}`}
                    </Text>
                  </>
                )}

                {selectedOption === 'Beneficiarios' && (
                  <>
                    <Text style={styles.itemTitle}>
                      {`${translate('Nombre', 'Name')}: ${item.name || 'N/A'}`}
                    </Text>
                    <Text style={styles.itemDetail}>
                      {`${translate('Sexo', 'Sex')}: ${getSexInSpanish(item.gender)}`}
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
                  </>
                )}
              </View>
            ))
          ) : (
            <Text>{translate('No se encontraron datos para mostrar.', 'No data available to display.')}</Text>
          )}
        </View>
      )}

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
