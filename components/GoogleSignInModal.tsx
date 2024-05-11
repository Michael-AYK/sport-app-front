import React from 'react';
import { Modal, View, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { GoogleSigninButton, GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin' 
import auth from '@react-native-firebase/auth';
import { registerUser } from '../services/user';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GoogleSignInButton = ({ signIn }: any) => {
  return (
    <TouchableOpacity onPress={signIn} style={styles.button}>
      <Image
        source={{ uri: 'https://developers.google.com/identity/images/g-logo.png' }}
        style={styles.buttonIcon}
      />
      <Text style={styles.buttonText}>Se connecter avec Google</Text>
    </TouchableOpacity>
  );
};

const GoogleSignInModal = ({ isVisible, onClose }: any) => {

  GoogleSignin.configure({
    webClientId: '859259628586-6e55ek3809annlqo27abqqh57ai0cirm.apps.googleusercontent.com'
  })

  const signIn = async () => {
    try {
      console.log("TEST !")
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log("USER FOUND");
      
      console.log(userInfo);

      // Stockage des informations de l'utilisateur dans AsyncStorage
      await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));

      // Exécution de registerUser avec le nom et l'email
      const { name, email } = userInfo.user;
      console.log(name)
      console.log(email)
      console.log("=============")
      if(name && email) {
        const resp = await registerUser(name, email);
        console.log("HEY");
        console.log("rrrrrrrrrrrrrrrrrrr");
        
        console.log(resp);
        onClose()
      }
    } catch (error: any) {
      console.log(error)
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <AntDesign name="close" size={24} color="black" />
          </TouchableOpacity>
            <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 20, textAlign: 'center' }}>Connectez-vous maintenant</Text>
          <GoogleSignInButton signIn={signIn} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, .5)'
  },
  modalView: {
    width: '100%',
    backgroundColor: 'white',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 40,
    marginBottom: 20
  },
  buttonIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  buttonText: {
    color: '#757575',
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute', // Positionnement en absolu pour le placer en haut à droite
    right: 15,
    top: 15,
    padding: 10, // Facilite le toucher
    zIndex: 1, // S'assurer que le bouton est cliquable en le plaçant au-dessus des autres éléments
  },
  modalText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center'
  },
});

export default GoogleSignInModal;
