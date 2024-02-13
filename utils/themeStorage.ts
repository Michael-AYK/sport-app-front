// utils/themeStorage.js

import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_KEY = 'app_theme';

export const getStoredTheme = async () => {
  try {
    const theme = await AsyncStorage.getItem(THEME_KEY);
    if (theme !== null) {
      return theme;
    }
  } catch (error) {
    console.error('Erreur lors de la récupération du thème depuis AsyncStorage', error);
  }
  return null;
};

export const storeTheme = async (theme: string) => {
  try {
    await AsyncStorage.setItem(THEME_KEY, theme);
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement du thème dans AsyncStorage', error);
  }
};
