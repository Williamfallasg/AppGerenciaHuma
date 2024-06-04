import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import addData from '../firebase/addData';



const Registrarse = ({}) => {

  const navigation = useNavigation();

  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');

/*const crearRegistro  = async () => {
  try {
    await firebaseServices.Registrarse (nombre, apellidos, correo, contrasena
  } catch (error) {
    
  }
}*/

  const handleSubmit = () => {
    addData("usuarios", correo,{
      nombre: nombre,
      apellidos: apellidos,
      contrasena: contrasena,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
      <Image source={require('../assets/imageLog.png')} style={styles.logo} />
      </View>
      
      <Text style={styles.title}>REGISTRO</Text>

      <Text style={styles.label}>Nombre</Text>
      <TextInput
        
        style={styles.input}
        placeholder="Nombre"
        onChangeText={(text) => setNombre(text)}
        value={nombre}
        placeholderTextColor="#B0B0B0"
      />
      <Text style={styles.label}>Apellidos</Text>

      <TextInput
        style={styles.input}
        placeholder="Apellidos"
        onChangeText={(text) => setApellidos(text)}
        value={apellidos}
        placeholderTextColor="#B0B0B0"
      />
       <Text style={styles.label}>Correo</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo"
        onChangeText={(text) => setCorreo(text)}
        value={correo}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#B0B0B0"
      />
       <Text style={styles.label}>Constraseña</Text>

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry={true}
        onChangeText={(text) => setContrasena(text)}
        value={contrasena}
        placeholderTextColor="#B0B0B0"
       
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Registrar</Text>
      </TouchableOpacity>

      <Text style={styles.link}>¿Ya tiene una cuenta?</Text>
    </View>
  );
};

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
  label: {
    alignSelf: 'flex-start',
    color: 'white',
    fontSize: 18,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    backgroundColor: 'white',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
   
   
  },
  button: {
    width: '100%',
    height: 40,
    backgroundColor: '#87B4B5',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  link: {
    marginTop: 20,
    color: 'white',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

export default Registrarse;