import React from 'react';
import { View, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const QRCodeScreen = () => {
  const qrValue = 'https://example.com'; // La valeur que vous voulez coder dans le QR Code

  return (
    <View style={styles.container}>
      <QRCode
        value={qrValue}
        size={200} // Taille du QR Code
        color="black" // Couleur des carrés du QR Code
        backgroundColor="white" // Couleur de fond du QR Code
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Centre verticalement
    alignItems: 'center', // Centre horizontalement
    backgroundColor: 'white', // Couleur de fond de la page
  },
});

export default QRCodeScreen;
