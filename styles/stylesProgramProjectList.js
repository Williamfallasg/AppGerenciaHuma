const styles = {
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#FFFFFF',
    },
    heading: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 20,
      textAlign: 'center',
    },
    sectionHeading: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 10,
      textAlign: 'left',
    },
    itemContainer: {
      backgroundColor: '#FFF',
      padding: 15,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3,
      marginBottom: 15,
    },
    itemTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 8,
    },
    itemDescription: {
      fontSize: 16,
      color: '#666',
      marginBottom: 8,
    },
    itemDetail: {
      fontSize: 14,
      color: '#999',
      marginBottom: 5,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 15,
    },
    editButton: {
      backgroundColor: '#4CAF50', // Color verde para el botón "Guardar" y "Editar"
      padding: 12,
      borderRadius: 5,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      marginRight: 10, // Espacio entre botones
    },
    editButtonText: {
      color: '#FFF',
      fontSize: 16,
      marginLeft: 8,
    },
    deleteButton: {
      backgroundColor: '#FFA500', // Rojo como el botón "Salir"
      padding: 12,
      borderRadius: 5,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
    },
    deleteButtonText: {
      color: '#FFF',
      fontSize: 16,
      marginLeft: 8,
    },
    exitButton: {
      backgroundColor: '#FFA500', // Color del botón "Salir"
      padding: 15,
      borderRadius: 5,
      marginTop: 20,
      alignItems: 'center',
    },
    exitButtonText: {
      color: '#FFF',
      fontSize: 18,
      fontWeight: 'bold',
    },
  };
  
  export default styles;
  