import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
// import HomeScreen from './screens/HomeScreen';
import { NavigationContainer } from '@react-navigation/native';
import HomeStackNavigator from './navigations/HomeStackNavigator';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import store, { setTheme } from './redux/theme';
import { getStoredTheme } from './utils/themeStorage';

export default function App() {
  useEffect(() => {
    // Récupérer le thème stocké dans AsyncStorage
    getStoredTheme().then((theme) => {
      if (theme) {
        store.dispatch(setTheme(theme));
      }
    });
  }, []);

  return (
    <Provider store={store}>
      <GestureHandlerRootView style={styles.container}>
        <NavigationContainer>
          <StatusBar style="auto" />
          <HomeStackNavigator />
        </NavigationContainer>
      </GestureHandlerRootView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});
