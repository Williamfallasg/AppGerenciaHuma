import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LanguageProvider } from './context/LanguageContext';
import { UserRoleProvider } from './context/UserRoleContext';
import { FamilyProvider } from './context/FamilyContext';

import Sesion from './Navegacion/Sesion';
import Registrarse from './Navegacion/Registrarse';
import Rec_contraseña from './Navegacion/Rec_contraseña';
import Home from './Navegacion/Home';
import EditPerfil from './Navegacion/EditPerfil';
import ProgramForm from './Navegacion/ProgramForm';
import ProjectForm from './Navegacion/ProjectForm';
import RegisterUser from './Navegacion/RegisterUser';
import GenerateReport from './Navegacion/GenerateReport';
import Report from './Navegacion/Report';
import FamilyScreen from './Navegacion/FamilyScreen';
import ProgramProjectList from './Navegacion/ProgramProjectList';
import ResultsForm from './Navegacion/ResultsForm';
import ChartScreen from './Navegacion/ChartScreen';


const Stack = createStackNavigator();

const AppStack = () => {
  return (
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
        name="ProgramForm"
        component={ProgramForm}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProjectForm"
        component={ProjectForm}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RegisterUser"
        component={RegisterUser}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="GenerateReport"
        component={GenerateReport}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Report"
        component={Report}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FamilyScreen"
        component={FamilyScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="ProgramProjectList"
        component={ProgramProjectList}
        options={{ headerShown: false }}
      />

     <Stack.Screen
        name="ResultsForm"
        component={ResultsForm}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="ChartScreen"
        component={ChartScreen}
        options={{ headerShown: false }}
      />

     

    </Stack.Navigator>
  );
};

const Navegacion = () => {
  return (
  <FamilyProvider>
    <LanguageProvider>
      <UserRoleProvider>
        <NavigationContainer>
          <AppStack />
        </NavigationContainer>
      </UserRoleProvider>
    </LanguageProvider>
  </FamilyProvider>
  );
};

export default Navegacion;
