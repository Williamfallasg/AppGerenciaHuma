import React from 'react';
import Navegacion from './Navegacion';
import { LanguageProvider } from './context/LanguageContext'; // Importa el proveedor de idioma

const App = () => {
  return (
    <LanguageProvider>
      <Navegacion />
    </LanguageProvider>
  );
};

export default App;
