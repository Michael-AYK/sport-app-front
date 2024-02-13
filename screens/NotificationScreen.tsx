import { View, Text, ActivityIndicator, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector, useDispatch } from 'react-redux';
import lightTheme from '../themes/lightTheme';
import darkTheme from '../themes/darkTheme';
import { getUserNotifications } from '../services/notification';
import LottieView from "lottie-react-native";
import { FlatList } from 'react-native-gesture-handler';

export default function NotificationScreen(props: any) {
  const mode = useSelector((state: any) => state.theme);
  const theme = mode === 'light' ? lightTheme : darkTheme;
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const { dbUser } = props.route.params

  useEffect(() => {
    loadNotifications();
  }, [])

  async function loadNotifications() {
    setLoading(true);
    console.log(dbUser);
    const data = await getUserNotifications(dbUser.client.id);
    console.log(data)
    setNotifications(data);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }

  return (
    <View style={{ flex: 1, padding: 10, backgroundColor: theme.primaryBackground }}>
      <FlatList
        data={notifications}
        keyExtractor={(item, index) => index.toString()}
        refreshing={loading}
        onRefresh={loadNotifications}
        renderItem={({ item, index }: any) => {
          return <View style={{ backgroundColor: item.status === 0 ? 'rgba(100, 100, 100, .05)' : theme.lightGreenTranslucent, padding: 10, marginVertical: 10, borderRadius: 5 }}>
            <Text style={{ marginBottom: 10, fontWeight: item.status === 0 ? '500': '300' }}>{item.body}</Text>
            <Text style={{ textAlign: 'right', fontStyle: 'italic', color: '#333', fontSize: 12 }}>{new Date(item.created_at).toLocaleString()} </Text>
          </View>
        }}
      />

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