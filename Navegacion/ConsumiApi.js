import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, FlatList, Text, View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from "@react-navigation/native";

export default function ConsumiApi() {
    const navigation = useNavigation();
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [search, setSearch] = useState('');
    const [filteredData, setFilteredData] = useState([]);

    const getCourses = async () => {
        try {
            const response = await fetch('https://consultas.ina.ac.cr/api/CatalogoCompleto');
            const json = await response.json();
            setData(json);
            setFilteredData(json);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCourses();
    }, []);

    const handleSearch = (text) => {
        setSearch(text);
        const filtered = data.filter(course =>
            course.Nombre.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredData(filtered);
    };

    const handleEnroll = (course) => {
        console.log(`Matriculado en el curso: ${course.Nombre}`);
    };

    const handleAddToFavorites = (course) => {
        console.log(`Agregado a favoritos: ${course.Nombre}`);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                    <Text style={styles.navItem}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Pantalla7')}>
                    <Text style={styles.navItem}>Cursos</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Pantalla7')}>
                    <Text style={styles.navItem}>Matrícula</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar curso..."
                    value={search}
                    onChangeText={handleSearch}
                />
                <TouchableOpacity style={styles.searchButton}>
                    <Text style={styles.searchButtonText}>🔍</Text>
                </TouchableOpacity>
            </View>

            {isLoading ? (
                <ActivityIndicator />
            ) : (
                <FlatList
                    data={filteredData}
                    keyExtractor={({ Codigo_Modulo }) => Codigo_Modulo}
                    renderItem={({ item }) => (
                        <View style={styles.courseContainer}>
                            <Text style={styles.courseTitle}>{item.Nombre}</Text>
                            <Text style={styles.courseDetail}>Certificado: {item.Certificado}</Text>
                            <Text style={styles.courseDetail}>Objetivos: {item.Objetivos}</Text>
                            <Text style={styles.courseDetail}>Descripción breve: {item.Descripcion_breve}</Text>
                            <Text style={styles.courseDetail}>Duración: {item.Duracion} horas</Text>
                            <Text style={styles.courseDetail}>Requisitos de Ingreso: {item.Requisitos_Ingreso}</Text>
                            <Text style={styles.courseDetail}>Descripción de la Especialidad: {item.Descripcion_Especialidad}</Text>
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity
                                    style={styles.enrollButton}
                                    onPress={() => handleEnroll(item)}
                                >
                                    <Text style={styles.buttonText}>Matricular</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.favoriteButton}
                                    onPress={() => handleAddToFavorites(item)}
                                >
                                    <Text style={styles.buttonText}>Agregar a Favoritos</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                />
            )}
            <StatusBar style="auto" />
        </View>
    );
}

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
        width: '100%',
        height: 66,
        alignItems: 'center',
    },
    navItem: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 20,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    searchInput: {
        flex: 1,
        height: 30,
        borderColor: '#007BFF',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    searchButton: {
        marginLeft: 10,
        padding: 5,
        backgroundColor: '#007BFF',
        borderRadius: 5,
    },
    searchButtonText: {
        color: '#fff',
        fontSize: 18,
    },
    courseContainer: {
        padding: 10,
        marginVertical: 8,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginHorizontal: 10,
    },
    courseTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    courseDetail: {
        fontSize: 14,
        color: 'gray',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginTop: 10,
    },
    enrollButton: {
        backgroundColor: '#195E63',
        padding: 10,
        borderRadius: 5,
        marginRight: 15,
    },
    favoriteButton: {
        backgroundColor: '#195E63',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
        textAlign: 'center',
    },
});
