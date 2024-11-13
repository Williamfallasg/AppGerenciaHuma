import React, { useEffect, useState } from 'react';
import { View, Text, Button, ScrollView, Alert, StyleSheet } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useLanguage } from '../context/LanguageContext';
import { firestore } from '../firebase/firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';

const UserDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { userData } = route.params;
  const { language } = useLanguage();
  const [countryProjectDetails, setCountryProjectDetails] = useState([]);

  useEffect(() => {
    // Configuración del listener para obtener actualizaciones en tiempo real
    const fetchCountryProjectDetails = () => {
      const userProjectsRef = collection(firestore, 'userProjects');
      const q = query(userProjectsRef, where('userID', '==', userData.userID));

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const details = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            country: data.country || 'País no especificado',
            projectName: data.projectName || 'Proyecto no especificado',
            activity: data.activities && data.activities.length > 0
              ? data.activities[0].activity || 'Actividad no especificada'
              : 'Actividad no especificada',
          };
        });
        setCountryProjectDetails(details);
      });

      return unsubscribe;
    };

    const unsubscribe = fetchCountryProjectDetails();
    return () => unsubscribe();
  }, [userData.userID]);

  const handleDownload = async () => {
    try {
      const htmlContent = `
        <html>
          <body>
            <h1>${language === 'es' ? 'Detalles del Usuario' : 'User Details'}</h1>
            <div>
              ${orderedFields.map(key => `
                <p><strong>${translations[key] || formatLabel(key)}:</strong> ${Array.isArray(userData[key]) ? userData[key].join(', ') : userData[key] || 'N/A'}</p>
              `).join('')}
              ${countryProjectDetails.map(detail => `
                <p><strong>${language === 'es' ? 'País' : 'Country'}:</strong> ${detail.country}</p>
                <p><strong>${language === 'es' ? 'Proyecto' : 'Project'}:</strong> ${detail.projectName}</p>
                <p><strong>${language === 'es' ? 'Actividad Seleccionada' : 'Selected Activity'}:</strong> ${detail.activity}</p>
                <hr/>
              `).join('')}
            </div>
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: language === 'es' ? 'Descargar datos del usuario' : 'Download User Data',
        UTI: 'com.adobe.pdf',
      });
    } catch (error) {
      console.error("Error downloading PDF: ", error);
      Alert.alert("Error", language === 'es' ? "No se pudo descargar el archivo" : "Could not download the file");
    }
  };

  const handleExit = () => {
    navigation.navigate('Home');
  };

  const translations = {
    userID: language === 'es' ? 'ID de usuario' : 'User ID',
    idType: language === 'es' ? 'Tipo de identificación' : 'ID Type',
    name: language === 'es' ? 'Nombre completo' : 'Full Name',
    gender: language === 'es' ? 'Sexo' : 'Sex',
    birthDate: language === 'es' ? 'Fecha de nacimiento' : 'Birth Date',
    age: language === 'es' ? 'Edad' : 'Age',
    countries: language === 'es' ? 'Países' : 'Countries',
    province: language === 'es' ? 'Provincia' : 'Province',
    canton: language === 'es' ? 'Cantón' : 'Canton',
    district: language === 'es' ? 'Distrito' : 'District',
    phone: language === 'es' ? 'Teléfono' : 'Phone',
    projects: language === 'es' ? 'Proyectos' : 'Projects',
    medicalCondition: language === 'es' ? 'Condiciones Médicas' : 'Medical Conditions',
    originCountry: language === 'es' ? 'País de origen' : 'Country of Origin',
    activities: language === 'es' ? 'Actividades' : 'Activities',
  };

  const orderedFields = [
    'userID', 'idType', 'name', 'gender', 'birthDate', 'age', 
    'countryOfOrigin', 'countries', 'province', 'canton', 'district', 
    'phone', 'projects', 'medicalCondition', 'activities'
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>
        {language === 'es' ? 'Detalles del Usuario' : 'User Details'}
      </Text>
      
      <View style={styles.card}>
        {orderedFields.map((key) => (
          userData[key] !== undefined && (
            <View key={key} style={styles.itemContainer}>
              <Text style={styles.label}>{translations[key] || formatLabel(key)}</Text>
              <Text style={styles.value}>
                {Array.isArray(userData[key]) ? userData[key].join(', ') : userData[key]} 
              </Text>
            </View>
          )
        ))}

        {countryProjectDetails.map((detail, index) => (
          <View key={index} style={styles.projectContainer}>
            <Text style={styles.label}>País:</Text>
            <Text style={styles.value}>{detail.country}</Text>
            <Text style={styles.label}>Proyecto:</Text>
            <Text style={styles.value}>{detail.projectName}</Text>
            <Text style={styles.label}>Actividad Seleccionada:</Text>
            <Text style={styles.value}>{detail.activity || 'No hay actividad seleccionada'}</Text>
          </View>
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <Button title={language === 'es' ? 'Descargar datos en PDF' : 'Download Data in PDF'} onPress={handleDownload} color="#007BFF" />
      </View>
      <View style={[styles.buttonContainer, { marginTop: 10 }]}>
        <Button title={language === 'es' ? 'Salir' : 'Exit'} onPress={handleExit} color="#F28C32" />
      </View>
    </ScrollView>
  );
};

const formatLabel = (label) => {
  return label
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase());
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  itemContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 5,
    borderBottomWidth: 1,
    borderColor: '#EAEAEA',
    paddingBottom: 8,
  },
  projectContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 15,
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    flex: 1,
  },
  value: {
    fontSize: 16,
    color: '#333',
    flex: 2,
  },
  buttonContainer: {
    marginVertical: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
});

export default UserDetailsScreen;
