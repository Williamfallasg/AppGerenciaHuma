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
      if (selectedOption === 'Proyectos') {
        const projectsSnapshot = await getDocs(collection(firestore, 'projects'));
        setItemCount(projectsSnapshot.size);

        const projectsData = await Promise.all(
          projectsSnapshot.docs.map(async (docSnapshot) => {
            const project = docSnapshot.data();
            const beneficiariesQuery = query(
              collection(firestore, 'users'),
              where('projects', 'array-contains', docSnapshot.id)
            );
            const beneficiariesSnapshot = await getDocs(beneficiariesQuery);

            const ages = [];
            const genders = [];
            beneficiariesSnapshot.forEach((beneficiaryDoc) => {
              const userData = beneficiaryDoc.data();
              if (userData.age) ages.push(userData.age);
              if (userData.gender) genders.push(getSexInSpanish(userData.gender));
            });

            const activities = project.activities 
              ? project.activities.map((a) => a.activityName || a.activity).join(', ')
              : 'N/A';
            const indicators = project.indicators && project.indicators.length > 0
              ? project.indicators.map((i) => i.description || 'N/A').join(', ')
              : 'N/A';

            return {
              id: docSnapshot.id,
              projectName: project.projectName || 'N/A',
              beneficiaryCount: ages.length,
              ages: ages.join(', '),
              genders: genders.join(', '),
              activities,
              indicators,
            };
          })
        );

        setData(projectsData);
      } else if (selectedOption === 'Programas') {
        const programsSnapshot = await getDocs(collection(firestore, 'programs'));
        setItemCount(programsSnapshot.size);

        const programsData = await Promise.all(
          programsSnapshot.docs.map(async (docSnapshot) => {
            const program = docSnapshot.data();
            const linkedProjects = program.projects || [];
            const projectNames = [];
            const allIndicators = [];

            // Obtener nombres de los proyectos y sus indicadores vinculados
            await Promise.all(
              linkedProjects.map(async (projectId) => {
                const projectDoc = await getDoc(doc(firestore, 'projects', projectId));
                if (projectDoc.exists()) {
                  const projectData = projectDoc.data();
                  projectNames.push(projectData.projectName || 'N/A');

                  // Obtener indicadores del proyecto
                  const indicators = projectData.indicators && projectData.indicators.length > 0
                    ? projectData.indicators.map((i) => i.description || 'N/A').join(', ')
                    : 'N/A';
                  allIndicators.push(indicators);
                }
              })
            );

            const countriesAvailable = program.selectedCountries
              ? Object.values(program.selectedCountries).flat().join(', ')
              : 'N/A';

            return {
              programName: program.programName || 'N/A',
              numberOfBeneficiaries: program.numberOfBeneficiaries || 'N/A',
              linkedProjects: projectNames.join(', '),
              indicators: allIndicators.join(', '), // Concatenar todos los indicadores de los proyectos vinculados
              countriesAvailable,
            };
          })
        );

        setData(programsData);
      } else if (selectedOption === 'Beneficiarios') {
        const usersSnapshot = await getDocs(collection(firestore, 'users'));
        setItemCount(usersSnapshot.size);

        const usersData = usersSnapshot.docs.map((docSnapshot) => ({
          id: docSnapshot.id,
          ...docSnapshot.data(),
        }));
        setData(usersData);
      } else {
        throw new Error(translate('Opción desconocida seleccionada', 'Unknown option selected'));
      }
    } catch (error) {
      Alert.alert(
        'Error',
        `${translate('No se pudo obtener la información.', 'Could not fetch information.')}\n${translate('Detalles del error:', 'Error details:')} ${error.message}`
      );
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
      <Text style={styles.title}>{translate('Informe', 'Report')}</Text>
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
                      {`${translate('Número de Beneficiarios', 'Number of Beneficiaries')}: ${item.numberOfBeneficiaries || 'N/A'}`}
                    </Text>
                    <Text style={styles.itemDetail}>
                      {`${translate('Proyectos Vinculados', 'Linked Projects')}: ${item.linkedProjects || 'N/A'}`}
                    </Text>
                    <Text style={styles.itemDetail}>
                      {`${translate('Indicadores', 'Indicators')}: ${item.indicators || 'N/A'}`}
                    </Text>
                    <Text style={styles.itemDetail}>
                      {`${translate('Países donde está disponible:', 'Countries Available In')}: ${item.countriesAvailable || 'N/A'}`}
                    </Text>
                  </>
                )}

                {selectedOption === 'Proyectos' && (
                  <>
                    <Text style={styles.itemTitle}>
                      {`${translate('Nombre del Proyecto', 'Project Name')}: ${item.projectName || 'N/A'}`}
                    </Text>
                    <Text style={styles.itemDetail}>
                      {`${translate('Cantidad de Beneficiarios', 'Number of Beneficiaries')}: ${item.beneficiaryCount || 'N/A'}`}
                    </Text>
                    <Text style={styles.itemDetail}>
                      {`${translate('Edades', 'Ages')}: ${item.ages || 'N/A'}`}
                    </Text>
                    <Text style={styles.itemDetail}>
                      {`${translate('Sexo', 'Gender')}: ${item.genders || 'N/A'}`}
                    </Text>
                    <Text style={styles.itemDetail}>
                      {`${translate('Actividades', 'Activities')}: ${item.activities || 'N/A'}`}
                    </Text>
                    <Text style={styles.itemDetail}>
                      {`${translate('Indicadores', 'Indicators')}: ${item.indicators || 'N/A'}`}
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
