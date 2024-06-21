import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Sesion from './Navegacion/Sesion';
import Registrarse from './Navegacion/Registrarse';
import Rec_contraseña from './Navegacion/Rec_contraseña';
import Home from './Navegacion/Home';
import Pantalla6 from './Navegacion/Pantalla6';
import Pantalla7 from './Navegacion/Pantalla7';
import Pantalla8 from './Navegacion/Pantalla8';
import Pantalla9 from './Navegacion/Pantalla9';
import Pantalla10 from './Navegacion/Pantalla10';
import Pantalla11 from './Navegacion/Pantalla11';
import EditPerfil from './Navegacion/EditPerfil';

const Stack = createStackNavigator();

const Navegacion = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Sesion">
        <Stack.Screen
          name="Sesion"
          component={Sesion}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Registrarse"
          component={Registrarse}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Rec_contraseña"
          component={Rec_contraseña}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditPerfil"
          component={EditPerfil}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Pantalla6"
          component={Pantalla6}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Pantalla7"
          component={Pantalla7}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Pantalla8"
          component={Pantalla8}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Pantalla9"
          component={Pantalla9}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Pantalla10"
          component={Pantalla10}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Pantalla11"
          component={Pantalla11}
          options={{ headerShown: false }}
        />
        

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navegacion;
