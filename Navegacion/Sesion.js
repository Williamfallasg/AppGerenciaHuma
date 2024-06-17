import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import  getDocument  from "../firebase/getData"
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'; 

const Sesion = () => {
  const navigation = useNavigation();

  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [usuarios, setUsuarios] = useState({});


  const handleSubmit = async () => {
    await getDocument("usuarios", correo).then(usuario =>{
      if((usuario.correo == correo) && (usuario.contrasena == contrasena)){
        navigation.navigate("Home")
      }
    }) 

   
  };

  return (
    <View style={styles.container}>
      
      <TouchableOpacity onPress={() => navigation.navigate('Registrarse')}>
        <Text style={styles.register}>Registrar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('EditPerfil')}>
        <Text style={styles.register}>EditPerfil</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Pantalla6')}>
        <Text style={styles.register}>Home</Text>
      </TouchableOpacity>

      <Image source={require('../assets/imageLog.png')} style={styles.logo} />

      <Text style={styles.label}>Correo</Text>
      <View style={styles.inputContainer}>
      <Image source={require('../assets/imageEmail.png')} style={styles.icon} />
        <TextInput 
          style={styles.input} 
          placeholder="example@gmail.com"
          defaultValue=""
        />
      </View>
      <Text style={styles.label}>Contraseña</Text>
      <View style={styles.inputContainer}>
      <Image source={require('../assets/imageLock.png')} style={styles.icon} />
        <TextInput 
          style={styles.input} 
          placeholder=""
          secureTextEntry
          defaultValue=""
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Iniciar sesión</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => navigation.navigate('Rec_contraseña')}>
      <Text style={styles.forgotPassword}>Recuperar contraseña</Text>
      </TouchableOpacity>
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#195E63',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 5,
    marginBottom: 15,
    paddingLeft: 10,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  input: {
    height: 40,
    flex: 1,
  },
  button: {
    backgroundColor: '#6ABFA0',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
    width: 314,
    height: 44,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  forgotPassword: {
    color: 'lightgray',
    marginBottom: 20,
  },
  register: {
    color: 'white',
    alignSelf: 'flex-end',
    marginTop: 10,
    width: 300,
    height: 50,
    textAlign:'right',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  icon: {
    width: 21,
    height: 21,
    marginRight: 10,
  },
});

export default Sesion;