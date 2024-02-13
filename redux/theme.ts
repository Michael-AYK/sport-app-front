// redux/theme.js

import { legacy_createStore as createStore } from 'redux';

const SET_THEME = 'SET_THEME';

export const setTheme = (theme: any) => ({
  type: SET_THEME,
  payload: theme,
});

const initialState = {
  theme: 'light', // Thème par défaut
};

const themeReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_THEME:
      return { ...state, theme: action.payload };
    default:
      return state;
  }
};

const store = createStore(themeReducer);

export default store;
