import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5', // Cambié el fondo a un gris suave para reducir el brillo
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold', // Para resaltar más el título
    color: '#333', // Color más oscuro para mayor contraste
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#666', // Un gris suave para dar menor jerarquía
    marginBottom: 15,
    textAlign: 'center',
  },
  variablesContainer: {
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 10, // Añadido padding para evitar que el contenido toque los bordes
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    color: '#444', // Un color intermedio para títulos de secciones
    textAlign: 'center',
  },
  variableButton: {
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 10,
    alignItems: 'center',
    width: '100%', // Para ocupar todo el ancho disponible
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3, // Sombra para Android
  },
  variableButtonText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  chart: {
    marginVertical: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4, // Añadir elevación para dar más enfoque al gráfico
  },
  dataItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  itemDetail: {
    fontSize: 14,
    color: '#444',
    marginBottom: 3,
  },
  exitButton: {
    backgroundColor: '#F28C32',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 25,
    marginTop: 25,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  exitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
