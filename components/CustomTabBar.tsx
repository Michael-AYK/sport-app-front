import { View, Text, TouchableOpacity } from 'react-native'
import AntDesign from '@expo/vector-icons/AntDesign';
import React from 'react'

const BottomTab = ({ color, size = 20, index, label }: any) => {
    let icon: any;
    switch (index) {
      case 0:
        icon = "home";
        break;
      case 1:
        icon = "calendar";
        break;
      case 2:
        icon = "user";
        break;
      default:
        break;
    }
    const middle = index == 2;
  
    return (        
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <AntDesign name={icon} size={size} color={color} />
            {/* <Text text100BO color={color}>
              {label}
            </Text> */}
          </View>
    );
  };

  
export default function CustomTabBar({state, descriptors, navigation}: any) {
  return (
    <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: 10 }}>
      <View style={{ backgroundColor: '#333333', width: '95%', elevation: 5, borderRadius: 15, paddingVertical: 5, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }}>
      {state.routes.map((route: any, index: any) => {
          const isFocused = state.index === index;
          const { options } = descriptors[route.key];

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
            });
            if (!isFocused && !event.defaultPrevented) {
              // for middle button, open a modal
              navigation.navigate(route.name);
            }
          };

          const color = isFocused
            ? '#EEEEEE'
            : '#AAAAAA';


          return (
            <TouchableOpacity
              key={index}
              onPress={onPress}
              testID={options.tabBarTestID}
              accessibilityRole="button"
              style={{ opacity: 1, padding: 10 }}
              activeOpacity={0.8}
            >
              <BottomTab
                index={index}
                isFocused={isFocused}
                size={20}
                color={color}
                label={options.tabBarLabel}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  )
}