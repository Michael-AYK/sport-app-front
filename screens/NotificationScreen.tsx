import { View, Text, ActivityIndicator, Modal, TouchableOpacity } from 'react-native'
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
    const data = await getUserNotifications(dbUser.client.id);
    setNotifications(data);
    setLoading(false);
  }

  function onNotificationPress(notification: any) {
    console.log(notification)
    if(notification.notification_data) {
      const notificationData = JSON.parse(notification.notification_data)
      if(notificationData.route) {
        props.navigation.navigate(notificationData.route, { reservationId: notificationData.reservationId })
      }
    }
  }

  return (
    <View style={{ flex: 1, padding: 10, backgroundColor: theme.primaryBackground }}>
      <FlatList
        data={notifications}
        keyExtractor={(item, index) => index.toString()}
        refreshing={loading}
        onRefresh={loadNotifications} 
        renderItem={({ item, index }: any) => {
          return <TouchableOpacity onPress={() => onNotificationPress(item)} style={{ backgroundColor: item.status === 0 ? 'rgba(100, 100, 100, .05)' : theme.lightGreenTranslucent, padding: 10, marginVertical: 10, borderRadius: 5 }}>
            <Text style={{ marginBottom: 10, fontWeight: item.status === 0 ? '500': '300' }}>{item.body}</Text>
            <Text style={{ textAlign: 'right', fontStyle: 'italic', color: '#333', fontSize: 12 }}>{new Date(item.created_at).toLocaleString()} </Text>
          </TouchableOpacity>
        }}
      />

      <Modal visible={loading} transparent>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, .5)' }}>
          <LottieView
            autoPlay
            style={{ height: 100, width: 100 }}
            loop
            source={require('../assets/lotties/loading-2.json')}
          />
        </View>
      </Modal>
    </View>
  )
}