import React from 'react';
import { Dimensions, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeTabNavigator from './HomeTabNavigator';
import WelcomeScreen from '../screens/WelcomeScreen';
import ReservationScreen from '../screens/ReservationScreen';
import QRCodeScreen from '../screens/QRCodeScreen';
import NotificationScreen from '../screens/NotificationScreen';
import InvitationsScreen from '../screens/InvitationsScreen';
import ReservationDetailScreen from '../screens/ReservationDetailScreen';
import { useSelector, useDispatch } from 'react-redux';
import { setTheme } from '../redux/theme';
import { storeTheme } from '../utils/themeStorage';
import lightTheme from '../themes/lightTheme';
import darkTheme from '../themes/darkTheme';

const Stack = createNativeStackNavigator();
const { width } = Dimensions.get('window');
function HomeStackNavigator(props: any) {
    const mode = useSelector((state: any) => state.theme);
    const theme = mode === 'light' ? lightTheme : darkTheme;

    return (
        <Stack.Navigator>
            <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="HomeTab" options={{ headerShown: false }}>
                {(props: any) => <HomeTabNavigator {...props} />}
            </Stack.Screen>
            <Stack.Screen name="QRCodeScreen" options={{ headerTitle: "" }}>
                {(props: any) => <QRCodeScreen {...props} />}
            </Stack.Screen>
            <Stack.Screen name="NotificationScreen" options={{
                headerTitle: () => <Text style={{ fontSize: 15, fontWeight: '700' }}>Notifications</Text>,
                headerTitleAlign: 'center',
                headerStyle: {
                    backgroundColor: theme.primaryBackground,
                },
                headerShadowVisible: false,
            }}>
                {(props: any) => <NotificationScreen {...props} />}
            </Stack.Screen>


            <Stack.Screen name="Reservation" component={ReservationScreen} options={{
                headerTitle: () => <Text style={{ fontSize: 15, fontWeight: '700', maxWidth: width * .6, color: theme.primaryText }}>Faire une réservation</Text>,
                headerTitleAlign: 'center',
                headerStyle: {
                    backgroundColor: theme.primaryBackground,
                },
                headerShadowVisible: false,
                headerTintColor: theme.primaryText

            }} />

            <Stack.Screen name="Invitations" component={InvitationsScreen} options={{
                headerTitle: () => <Text style={{ fontSize: 15, fontWeight: '700' }}>Invitations</Text>,
                headerTitleAlign: 'center',
                headerStyle: {
                    backgroundColor: theme.primaryBackground,
                },
                headerShadowVisible: false,

            }} />

            <Stack.Screen name="ReservationDetailScreen" component={ReservationDetailScreen} options={{
                headerTitle: () => <Text style={{ fontSize: 15, fontWeight: '700' }}>Détails de la réservation</Text>,
                headerTitleAlign: 'center',
                headerShown: false,
                headerStyle: {
                    backgroundColor: theme.primaryBackground,
                },
                headerShadowVisible: false,

            }} />
        </Stack.Navigator>
    )
}

export default HomeStackNavigator;