import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Alert, Image } from 'react-native';

export default function App() {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = () => {
        if (email) {
            if (email.includes('@gmail.com') || email.includes('@hotmail.com') || email.includes('@ucr.ac.cr')) {
                setSubmitted(true);
                Alert.alert('Éxito', 'Su solicitud ha sido enviada');
                setEmail('');
            } else {
                Alert.alert('Error', 'El correo electrónico debe incluir un dominio válido');
            } setEmail('');

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
        width: 341,
        height: 41,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    successContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    successMessage: {
        color: 'white',
        fontSize: 16,
        marginBottom: 10,
    },
    acceptButton: {
        width: '100%',
        height: 40,
        backgroundColor: '#87B4B5',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    acceptButtonText: {
        color: 'white',
        fontSize: 16,
    },
    iconContainer: {
        position: 'absolute',
        top: 10,
        right: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 50,
    },
});
