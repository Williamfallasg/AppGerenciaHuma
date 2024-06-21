import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Rec_contraseña() {
    const [email, setEmail] = useState('');
    const navigation = useNavigation();

    const handleSubmit = () => {
        if (email) {
            if (email.includes('@gmail.com') || email.includes('@hotmail.com') || email.includes('@ucr.ac.cr')) {
                Alert.alert('Éxito', 'Su nueva clave ha sido enviada a su correo electrónico', [
                    { text: 'OK', onPress: () => navigation.navigate('Sesion') }
                ]);
                setEmail('');
            } else {
                Alert.alert('Error', 'El correo electrónico debe incluir un dominio válido');
                setEmail('');
            }
        } else {
            Alert.alert('Error', 'Por favor, introduzca su correo electrónico');
            setEmail('');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image source={require('../assets/imageLog.png')} style={styles.logo} />
            </View>
            <Text style={styles.title}>Recuperación de contraseña</Text>
            <Text style={styles.subtitle}>Digite su correo electrónico</Text>
            <TextInput
                style={styles.input}
                placeholder="example@gmail.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Enviar</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E6D70',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    logoContainer: {
        marginBottom: 20,
    },
    logo: {
        width: 312,
        height: 198,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        color: 'white',
        marginBottom: 10,
        alignSelf: 'flex-start',
    },
    subtitle: {
        fontSize: 16,
        color: 'white',
        marginBottom: 20,
        alignSelf: 'flex-start',
    },
    input: {
        width: '100%',
        height: 40,
        backgroundColor: 'white',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#87B4B5',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: 350,
        height: 41,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
});
