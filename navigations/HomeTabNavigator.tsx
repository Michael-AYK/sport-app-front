import React from 'react';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ReservationsListScreen from '../screens/ReservationsListScreen';
import CustomTabBar from '../components/CustomTabBar';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { setTheme } from '../redux/theme';
import { storeTheme } from '../utils/themeStorage';
import lightTheme from '../themes/lightTheme';
import darkTheme from '../themes/darkTheme';

const HomeTab = createBottomTabNavigator();

const HomeTabNavigator = ({navigation}: any) => {
    const mode = useSelector((state: any) => state.theme);
  const theme = mode === 'light'? lightTheme: darkTheme;
  
    return <HomeTab.Navigator tabBar={props => <CustomTabBar {...props} />} screenOptions={{
        headerStyle: {
            backgroundColor: theme.primaryBackground,
        },
        headerTitleAlign: 'center',
        headerShadowVisible: false,
        headerTintColor: theme.primaryText,
    }}>
        <HomeTab.Screen name='Home' options={{
            headerTitle: () => <Text style={{ fontSize: 15, fontWeight: '700', color: theme.primaryText }}>Padels</Text>,
        }}>
            {(props: any) => <HomeScreen {...props} stackNavigation={navigation} />}
        </HomeTab.Screen>
        <HomeTab.Screen name='ReservationsList' component={ReservationsListScreen} options={{
            headerTitle: () => <Text style={{ fontSize: 15, fontWeight: '700', color: theme.primaryText }}>Réservations</Text>,
        }} />
        <HomeTab.Screen name='Profile' component={ProfileScreen} options={{
            headerTitle: () => <Text style={{ fontSize: 15, fontWeight: '700', color: theme.primaryText }}>Profil</Text>,
        }} />
    </HomeTab.Navigator>
}

export default HomeTabNavigator