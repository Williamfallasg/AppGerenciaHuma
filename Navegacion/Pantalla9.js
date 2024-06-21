import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Pantalla9 = () => {
    const navigation = useNavigation();
    
    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.navItem}>Home</Text>
                <Text style={styles.navItem}>Cursos</Text>
                <Text style={styles.navItem}>Matrícula</Text>
            </View>

            <View style={styles.subHeader}>
                <TouchableOpacity onPress={() => navigation.navigate('Pantalla10')}>
                    <Text style={styles.subNavItem}>Mis cursos</Text>
                </TouchableOpacity>
                
                <Text style={styles.subNavItem}>Apoyo Docente</Text>
            </View>

            <View style={styles.courseContainer}>
                <View style={styles.course}>
                    <View style={styles.course1}>
                        <Text style={styles.courseTitle}>Horario de consulta en línea</Text>
                    </View>
                    <Image source={require('../assets/image14.png')} style={styles.courseImage} />
                </View>
                <View style={styles.course}>
                    <View style={styles.course1}>
                        <Text style={styles.courseTitle}>Retroalimentación personalizada</Text>
                    </View>
                    <Image source={require('../assets/image15.png')} style={styles.courseImage} />
                </View>
                <View style={styles.course}>
                    <View style={styles.course1}>
                        <Text style={styles.courseTitle}>Asistencia técnica</Text>
                    </View>
                    <Image source={require('../assets/image16.png')} style={styles.courseImage} />
                </View>

            </View>
        </ScrollView>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 0,
        marginTop: 30,
        width: '100%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#2C6C6C',
        marginTop: 30,
        marginBottom: 20,
        width: 393,
        height: 66,
        alignItems: 'center',
    },
    navItem: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 20,
    },
    subHeader: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#3E838C',
        marginBottom: 10,
        width: 393,
        height: 43,
        alignItems: 'center',
    },
    subNavItem: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    courseContainer: {
        padding: 20,
    },
    course: {
        backgroundColor: '#FFFFFF',
        padding: 0,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        borderColor: '#ccc',
        borderWidth: 3,
        width: 350,
        height: 195,
    },
    course1: {
        backgroundColor: '#195E63',
        flexDirection: 'row',
        alignItems: 'center',
        width: 168,
        height: 195,
    },
    courseImage: {
        width: 149,
        height: 150,
        marginLeft: 20,
    },
    courseTitle: {
        fontSize: 18,
        color: 'white',
        flex: 1,
        textAlign: 'center',
    },
});

export default Pantalla9;