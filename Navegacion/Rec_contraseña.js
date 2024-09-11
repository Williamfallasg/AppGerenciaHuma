import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Alert, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'; // Importar el método adecuado para restablecer contraseña
import { useLanguage } from '../context/LanguageContext';

const { width } = Dimensions.get('window');

export default function Rec_contraseña() {
    const { language } = useLanguage();
    const [email, setEmail] = useState('');
    const navigation = useNavigation();

    const handleSubmit = async () => {
        if (email) {
            try {
                const auth = getAuth(); // Obtener instancia de Firebase Auth
                await sendPasswordResetEmail(auth, email); // Enviar el correo de restablecimiento

                Alert.alert(
                    language === 'es' ? 'Éxito' : 'Success',
                    language === 'es' ? 'Se ha enviado un enlace de recuperación a su correo electrónico' : 'A password reset link has been sent to your email',
                    [{ text: 'OK', onPress: () => navigation.navigate('Sesion') }]
                );
                setEmail(''); // Limpiar el campo de email
            } catch (error) {
                console.error("Error al restablecer la contraseña: ", error);
                Alert.alert(
                    language === 'es' ? 'Error' : 'Error',
                    language === 'es' ? 'Hubo un problema al intentar restablecer la contraseña' : 'There was an issue resetting your password'
                );
            }
        } else {
            Alert.alert(
                language === 'es' ? 'Error' : 'Error',
                language === 'es' ? 'Por favor, introduzca su correo electrónico' : 'Please enter your email'
            );
        }
    };

    const handleSalir = () => {
        navigation.navigate('Sesion');
    };

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image source={require('../assets/image.png')} style={styles.logo} />
            </View>
            <Text style={styles.title}>
                {language === 'es' ? 'Recuperación de contraseña' : 'Password Recovery'}
            </Text>
            <Text style={styles.subtitle}>
                {language === 'es' ? 'Digite su correo electrónico' : 'Enter your email'}
            </Text>
            <TextInput
                style={styles.input}
                placeholder={language === 'es' ? 'example@gmail.com' : 'example@gmail.com'}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>
                    {language === 'es' ? 'Enviar' : 'Send'}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.exitButton} onPress={handleSalir}>
                <Text style={styles.buttonText}>
                    {language === 'es' ? 'Salir' : 'Exit'}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#D3D3D3',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    logoContainer: {
        marginBottom: 20,
    },
    logo: {
        width: width * 0.5,
        height: width * 0.5,
        marginBottom: 20,
    },
    title: {
        fontSize: width * 0.06,
        color: 'black',
        marginBottom: 10,
        alignSelf: 'flex-start',
    },
    subtitle: {
        fontSize: width * 0.04,
        color: 'black',
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
        backgroundColor: '#67A6F2',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: 50,
        marginBottom: 10,
    },
    buttonText: {
        color: 'black',
        fontSize: width * 0.04,
    },
    exitButton: {
        backgroundColor: '#F28C32',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: 50,
    },
});
