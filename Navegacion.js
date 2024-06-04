import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Sesion from './Navegacion/Sesion';
import Registrarse from './Navegacion/Registrarse';
import Rec_contraseña from './Navegacion/Rec_contraseña';



const Stack = createStackNavigator();

const Navegacion = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Sesion">
        <Stack.Screen 
          name="Sesion" 
          component={Sesion} 
          options={{ title: 'Inicio de sesion' }}
        />
        <Stack.Screen 
          name="Registrarse" 
          component={Registrarse} 
          options={{ title: 'Registrarse' }}
        />
        <Stack.Screen 
          name="Rec_contraseña" 
          component={Rec_contraseña} 
          options={{ title: 'Recuperar contraseña' }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navegacion;
