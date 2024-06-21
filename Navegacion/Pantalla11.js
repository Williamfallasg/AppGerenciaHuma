import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Navbar = () => {
    const navigation = useNavigation();
    return (
        <View style={styles.navbar}>

            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                <Text style={styles.navItem}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Pantalla10')}>
                <Text style={styles.navItem1}>Cursos</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Pantalla7')}>
                <Text style={styles.navItem2}>Matrícula</Text>
            </TouchableOpacity>


            <View style={styles.navItemContainer}>
                <Text style={styles.navItem3}>Notificaciones</Text>
                <Image source={require('../assets/image24.png')} style={styles.courseImage} />
            </View>
            <View style={styles.navItemContainer}>
                <Text style={styles.navItem4}>Mensaje</Text>
                <Image source={require('../assets/image25.png')} style={styles.courseImage1} />
            </View>
        </View>
    );
};

// Componente para el panel de notificaciones
const NotificationPanel = () => (
    <View style={styles.panel}>
        <Text style={styles.panelTitle}>Nuevas Tareas</Text>
        <Text style={styles.panelText}>Tarea de</Text>
        <Text style={styles.panelText}>Matemáticas:</Text>
        <Text style={styles.panelText}>• Fecha de entrega:</Text>
        <Text style={styles.panelText}> 20 de mayo</Text>
        <Text style={styles.panelText}>• Curso: Álgebra</Text>
        <Image source={require('../assets/image20.png')} style={styles.panelImage1} />
    </View>
);

// Componente para el panel de eventos
const EventsPanel = () => (
    <View style={styles.panel}>
        <Text style={styles.panelTitle}>Próximos Eventos</Text>
        <Text style={styles.panelText}>📚 Clase en Vivo -</Text>
        <Text style={styles.panelText}>Historia</Text>
        <Text style={styles.panelText}>🤝 Reunión Grupal -</Text>
        <Text style={styles.panelText}>Proyecto de Ciencias</Text>
        <Image source={require('../assets/image21.png')} style={styles.panelImage2} />
    </View>
);

// Componente para el panel de mensajes
const MessagesPanel = () => (
    <View style={styles.panel}>
        <Text style={styles.panelTitle}>Mensajes Privados</Text>
        <Text style={styles.panelText}>📬 Tienes 1</Text>
        <Text style={styles.panelText}>nuevos mensajes</Text>
        <Text style={styles.panelText}>privados.</Text>
        <Image source={require('../assets/image22.png')} style={styles.panelImage3} />
    </View>
);

// Componente principal de la aplicación
const Pantalla11 = () => {
    const navigation = useNavigation();
    return (
        <ScrollView style={styles.container}>
            <Navbar />
            <NotificationPanel />
            <EventsPanel />
            <MessagesPanel />
        </ScrollView>
    );
};

// Estilos de la aplicación
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 30,
        paddingVertical: 30,
        backgroundColor: '#FFFFFF',
    },
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#195E63',
        paddingVertical: 50,
        paddingHorizontal: 40,
    },
    navItemContainer: {
        flexDirection: 'row',
    },
    navItem: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
        width: 93,
        height: 26,
        paddingHorizontal: 10,
        right: 10,
    },
    navItem1: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
        width: 93,
        height: 26,
        paddingHorizontal: 80,
        top: 1,
        right: 1,
    },
    navItem2: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
        width: 93,
        height: 26,
        left: 120,
    },
    navItem3: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
        width: 140,
        height: 24,
        top: 35,
        right: 150,
    },
    navItem4: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
        width: 82,
        height: 24,
        top: 35,
        right: 20,
    },
    courseImage: {
        width: 30,
        height: 30,
        top: 35,
        right: 160,
    },
    courseImage1: {
        width: 30,
        height: 30,
        top: 35,
        right: 20,
    },
    icon: {
        width: 20,
        height: 20,
        marginLeft: 20,
    },
    panel: {
        backgroundColor: '#3E838C',
        padding: 20,
        marginHorizontal: 20,
        marginVertical: 10,
        borderRadius: 25,
        width: 354,
        height: 176,
    },
    panelTitle: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 10,
    },
    panelText: {
        color: 'white',
        fontSize: 16,
        marginBottom: 5,
    },
    panelImage1: {
        width: 90,
        height: 96,
        position: 'absolute',
        top: 35,
        right: 10,
    },
    panelImage2: {
        width: 80,
        height: 71.67,
        position: 'absolute',
        top: 40,
        right: 10,
    },
    panelImage3: {
        width: 80,
        height: 63.45,
        position: 'absolute',
        top: 50,
        right: 10,
    },
});

export default Pantalla11;
