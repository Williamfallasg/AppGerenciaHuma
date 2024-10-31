import React from 'react';
import { View, Text, Alert } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { useNavigation } from '@react-navigation/native';

const QRCodeScannerScreen = () => {
  const navigation = useNavigation();

  const handleBarCodeRead = (scanData) => {
    try {
      const userData = JSON.parse(scanData.data);
      navigation.navigate('UserDetailsScreen', { userData });
    } catch (error) {
      Alert.alert("Error", "Código QR inválido");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <RNCamera
        style={{ flex: 1 }}
        onBarCodeRead={handleBarCodeRead}
        captureAudio={false}
      >
        <Text style={{ color: 'white', textAlign: 'center', marginTop: 20 }}>
          Escanee el código QR para ver los detalles
        </Text>
      </RNCamera>
    </View>
  );
};

export default QRCodeScannerScreen;
