import { View, Text, TouchableOpacity, Modal, Switch, Linking } from 'react-native'
import React, { useEffect, useState } from 'react'
// import { theme } from '../config'
import Gravatar from '../components/Gravatar'
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useSelector, useDispatch } from 'react-redux';
import { setTheme } from '../redux/theme';
import { storeTheme } from '../utils/themeStorage';
import lightTheme from '../themes/lightTheme';
import darkTheme from '../themes/darkTheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from "lottie-react-native";

export default function ProfileScreen(props: any) {
  const mode = useSelector((state: any) => state.theme);
  const theme = mode === 'light'? lightTheme: darkTheme;
  const dispatch = useDispatch();

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dbUser, setDbUser] = useState<any>(null);

  
  async function onAppThemePress(selectedMode: boolean) {
    const newTheme = mode === 'light' ? 'dark' : 'light';

    // Mettre à jour le thème dans Redux
    dispatch(setTheme(newTheme));

    // Enregistrer le nouveau thème dans AsyncStorage
    storeTheme(newTheme);
    
    setIsDarkMode(selectedMode)
  }

  useEffect(() => {
    onLoad();
  },[])

  async function onLoad() {
    setLoading(true);
    const userStr = await AsyncStorage.getItem("dbUser")
    if (userStr) {
      const { client } = JSON.parse(userStr)
      setDbUser(client);
    }
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }


  const onWhatsappToggle = () => {
    Linking.canOpenURL('whatsapp://send?text=hey').then(supported => {
      if (!supported) {
        alert('Whatsapp non supporté !')
      } else {
        Linking.openURL('whatsapp://send?text=Salut,\n Je suis un utilisateur de votre application&phone=+33667486871');
      }
    })
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.primaryBackground, padding: 10 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, borderBottomWidth: 1, paddingBottom: 25, borderColor: '#ccc' }}>
        <Gravatar
          style={{}}
          s={45}
          email={dbUser?.email}
          rounded={true}
        />

        <View style={{ width: '60%', marginLeft: 15 }}>
          <Text style={{ fontSize: 18, fontWeight: '500', color: theme.primaryText, marginBottom: 3 }}>{dbUser?.nom}</Text>
          <Text style={{ fontSize: 14, color: '#777' }}>{dbUser?.email}</Text>
        </View>

        <View style={{ position: 'absolute', right: 10 }}>
          <AntDesign name="qrcode" onPress={() => props.navigation.navigate("QRCodeScreen")} size={30} color={theme.primaryText} />
        </View>
      </View>

      <View style={{ marginVertical: 5, paddingHorizontal: 8, paddingVertical: 5, borderRadius: 8, width: '100%', backgroundColor: 'rgba(200, 200, 220, .1)', alignSelf: 'center', alignItems: 'center', flexDirection: 'row' }}>
        <Text style={{ fontSize: 15, width: '82%', color: theme.primaryText }}>Mode sombre</Text>
        <View style={{ width: '18%', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
          <Switch
            trackColor={{ false: "#767577", true: "#4B0082" }}
            thumbColor={isDarkMode ? theme.primary : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={onAppThemePress}
            value={isDarkMode}
          />
        </View>
      </View>

      <TouchableOpacity style={{ marginVertical: 10, padding: 8, borderRadius: 8, width: '100%', backgroundColor: 'rgba(200, 200, 220, .1)', alignItems: 'center', flexDirection: 'row' }}>
        <View style={{ height: 30, width: 40, justifyContent: 'center', alignItems: 'center' }}>
          <AntDesign name="infocirlce" size={25} color={theme.primaryText} />
        </View>

        <View style={{ width: '75%', paddingHorizontal: 8 }}>
          <Text style={{ fontSize: 15, fontWeight: '600', color: theme.primaryText }}>A propos</Text>
          <Text style={{ fontSize: 13, color: '#999', marginTop: 5 }}>Découvrez nos conditions d'utilisation</Text>
        </View>

        <View style={{ width: '8%', position: 'absolute', right: 10, justifyContent: 'flex-end', alignItems: 'flex-end' }}>
          <AntDesign name="right" size={20} color={theme.primaryText} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => onWhatsappToggle()} style={{ marginVertical: 10, padding: 8, borderRadius: 8, width: '100%', backgroundColor: 'rgba(200, 200, 220, .1)', alignItems: 'center', flexDirection: 'row' }}>
        <View style={{ height: 30, width: 40, justifyContent: 'center', alignItems: 'center' }}>
          <FontAwesome name="whatsapp" size={25} color={theme.primaryText} />
        </View>

        <View style={{ width: '75%', paddingHorizontal: 8 }}>
          <Text style={{ fontSize: 15, fontWeight: '600', color: theme.primaryText }}>Nous contacter</Text>
          <Text style={{ fontSize: 13, color: '#999', marginTop: 5 }}>Laissez nous vos messages</Text>
        </View>

        <View style={{ width: '8%', position: 'absolute', right: 10, justifyContent: 'flex-end', alignItems: 'flex-end' }}>
          <AntDesign name="right" size={20} color={theme.primaryText} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={{ marginVertical: 10, padding: 8, borderRadius: 8, width: '100%', backgroundColor: 'rgba(200, 200, 220, .1)', alignItems: 'center', flexDirection: 'row' }}>
        <View style={{ height: 30, width: 40, justifyContent: 'center', alignItems: 'center' }}>
          <AntDesign name="sharealt" size={20} color={theme.primaryText} />
        </View>

        <View style={{ width: '75%', paddingHorizontal: 8 }}>
          <Text style={{ fontSize: 15, fontWeight: '600', color: theme.primaryText }}>Partager l'App</Text>
          <Text style={{ fontSize: 13, color: '#999', marginTop: 5 }}>Invitez vos amis pour plus de fun</Text>
        </View>

        <View style={{ width: '8%', position: 'absolute', right: 10, justifyContent: 'flex-end', alignItems: 'flex-end' }}>
          <AntDesign name="right" size={20} color={theme.primaryText} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={{ marginVertical: 10, padding: 8, borderRadius: 8, width: '100%', backgroundColor: 'rgba(200, 200, 220, .1)', alignItems: 'center', flexDirection: 'row' }}>
        <View style={{ height: 30, width: 40, justifyContent: 'center', alignItems: 'center' }}>
          <AntDesign name="logout" size={20} color="#b55" />
        </View>

        <View style={{ width: '75%', paddingHorizontal: 8 }}>
          <Text style={{ fontSize: 15, fontWeight: '600', color: theme.primaryText }}>Déconnexion</Text>
        </View>

      </TouchableOpacity>

      <Modal visible={loading}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <LottieView
            autoPlay
            style={{ height: 100, width: 100 }}
            loop
            source={require('../assets/lotties/loader.json')}
          />
        </View>
      </Modal>
    </View>
  )
}