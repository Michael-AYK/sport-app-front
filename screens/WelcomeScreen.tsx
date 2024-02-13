import { View, Text, Image, TouchableOpacity, ImageBackground } from 'react-native'
import * as NavigationBar from 'expo-navigation-bar';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react'

export default function WelcomeScreen(props: any) {
  function onStartPress() {
    props.navigation.reset({ index: 1, routes: [{ name: "HomeTab" }] })
  }
  
  return (
    <LinearGradient
      colors={['#320993', '#3A0CA3']} // Couleurs du dégradé (du bas vers le haut)
      style={{ flex: 1, backgroundColor: "white" }}>

      <ImageBackground
        source={require('../assets/images/shapes-2.jpg')}
        imageStyle={{ opacity: 0.07, }}
        style={{ padding: 10, flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <Image
          source={require('../assets/images/logo.png')}
          style={{ height: 150, width: 150, resizeMode: 'contain', marginBottom: 0, marginTop: -150 }}
        />
        <Text style={{ fontSize: 40, fontWeight: '500', marginBottom: 10, color: 'rgb(245, 245, 245)' }}>Bienvenu !</Text>
        <Text style={{ fontSize: 16, color: 'rgb(245, 245, 245)', fontWeight: '300' }}>Trouvez le court idéal pour vos séances</Text>

        <TouchableOpacity onPress={onStartPress} style={{ width: '80%', position: 'absolute', bottom: 30, padding: 16, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgb(245, 245, 245)', borderRadius: 30 }}>
          <Text style={{ color: '#3A0CA3', fontWeight: '500' }}>Commencer</Text>
        </TouchableOpacity>
      </ImageBackground>
    </LinearGradient>
  )
}