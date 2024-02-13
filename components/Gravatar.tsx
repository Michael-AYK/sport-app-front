import { ActivityIndicator, Image, View } from 'react-native'
import React from 'react'
import md5 from 'md5';
import { useSelector } from 'react-redux';
import lightTheme from '../themes/lightTheme';
import darkTheme from '../themes/darkTheme';

export default function Gravatar(props: any) {
  const mode = useSelector((state: any) => state.theme);
  const theme = mode === 'light'? lightTheme: darkTheme;
  
  let {email, s, type, loading, rounded, style} = props;
  loading = !!loading;
  style = style || {  };
  rounded = !!rounded;
  email = email || '';
  type = type || 'identicon';
  s = s || 20;
  const uri = 'https://www.gravatar.com/avatar/' +
  `${md5(email)}?s=${s*2}&default=${type}`;

  const defaultStyle: any = {
    overflow: 'hidden',
    height: s,
    width: s,
    borderRadius: rounded ? s/2 : 0
  }

  return <View style={[style, defaultStyle]}>
    {
      loading ?
        <View style={{ height: s, width: s }}>
          <ActivityIndicator color={theme.primary}/>
        </View>
        :
        <Image source={{ uri }} width={s} height={s} style={{ width: s, height: s }}></Image>
    }
  </View>
}
