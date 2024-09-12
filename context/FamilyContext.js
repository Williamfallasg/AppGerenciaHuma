import React, { createContext, useState, useContext } from 'react';

// Crear el contexto para la familia
const FamilyContext = createContext();

// Proveedor del contexto de la familia
export const FamilyProvider = ({ children }) => {
  const [familyMembers, setFamilyMembers] = useState([]);

  return (
    <FamilyContext.Provider value={{ familyMembers, setFamilyMembers }}>
      {children}
    </FamilyContext.Provider>
  );
};

// Hook para usar el contexto
export const useFamily = () => useContext(FamilyContext);
