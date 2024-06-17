import React, { useState } from "react";
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from 'expo-status-bar';
import { signInWithEmailAndPassword } from "firebase/auth";
import { getDocs, collection, query, where } from "firebase/firestore";
import { auth, db } from "../../../practica_and/my-project/AccesoFirebase";

const Bienvenido = () => {
    const navigation = useNavigation();

    const [email, setEmail] = useState('');
    const [clave, setClave] = useState('');

    const CorreValido = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const IniciarSesion = async () => {
        if (!CorreValido(email)) {
            Alert.alert('Error', 'Por favor, ingrese un correo electrónico válido');
            return;
        }

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, clave);
            const user = userCredential.user;

            const q = query(collection(db, 'usuarios'), where('email', '==', email));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                navigation.navigate("Home");
            } else {
                Alert.alert('Error', 'El correo electrónico no está registrado en la base de datos');
            }
        } catch (error) {
            let errorMessage = 'Hubo un problema al iniciar sesión';
            if (error.code === 'auth/invalid-email') {
                errorMessage = 'El formato del correo electrónico es inválido';
            } else if (error.code === 'auth/user-not-found') {
                errorMessage = 'No se encontró ningún usuario con ese correo electrónico';
            } else if (error.code === 'auth/wrong-password') {
                errorMessage = 'La contraseña es incorrecta';
            }
            console.error("Error al iniciar sesión: ", error);
            Alert.alert('Error', errorMessage);
        }
    };

    return (
        <View style={styles.container}>
            <Image source={require('./imageLog.png')} style={styles.img_Apli} />

            <Text style={styles.txtBienvenido}>Bienvenido!</Text>
            <Text style={styles.titulo}>Ingresar con tu cuenta</Text>

            <TextInput 
                placeholder='Correo electrónico' 
                style={styles.txtInput} 
                value={email} 
                onChangeText={setEmail} 
            />
            <TextInput 
                placeholder='Contraseña' 
                style={styles.txtInput} 
                secureTextEntry={true} 
                value={clave} 
                onChangeText={setClave} 
            />

            <TouchableOpacity onPress={() => navigation.navigate("Rec_Cuenta")}>
                <Text style={styles.txtOlvi_contra}>¿Has olvidado tu contraseña?</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={IniciarSesion}>
                <LinearGradient
                    colors={['#00C1BB', '#005B58']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.btnGradient}
                >
                    <Text style={styles.btnText}>Iniciar Sesión</Text>
                </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Crear_Cuenta")}>
                <Text style={styles.txtCrear_Cuenta}>
                    No tiene cuenta. <Text style={styles.txtRigi}>Registrarse</Text>
                </Text>
            </TouchableOpacity>

            <StatusBar style="auto" />
        </View>
    );
}

export default Bienvenido;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 50,
    },
    txtBienvenido: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#34434D',
        textAlign: 'left',
        marginTop: 20,
    },
    titulo: {
        fontSize: 18,
        fontWeight: '300',
        color: 'gray',
        textAlign: 'left',
        marginTop: 10,
    },
    txtInput: {
        width: '80%',
        height: 50,
        borderRadius: 25,
        borderWidth: 1,
        paddingLeft: 20,
        marginTop: 20,
        borderColor: 'grey',
        backgroundColor: '#F5F5F5',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    txtOlvi_contra: {
        fontSize: 16,
        color: "#00c1bb",
        marginTop: 10,
        alignSelf: 'flex-start',
        textAlign: "right"
    },
    txtCrear_Cuenta: {
        fontSize: 16,
        color: "#00c1bb",
        marginTop: 10,
        textAlign: 'center',
    },
    txtRigi: {
        color: "#00c1bb",
        fontWeight: "bold",
    },
    img_Apli: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
    btnGradient: {
        borderRadius: 30,
        width: 219,
        height: 53,
        marginTop: 35,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'right',
    },
});
