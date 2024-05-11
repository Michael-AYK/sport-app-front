import React, { Component } from 'react';
import { ViewStyle, Animated, View, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface SkeletonViewProps {
  width?: number;
  height: number;
  number?: number;
  duration?: number;
  containerStyle?: ViewStyle;
  grandientColors?: string[];
}

class SkeletonView extends Component<SkeletonViewProps> {
  translateX = new Animated.Value(-(this.props.width ?? width * .9));

  componentDidMount() {
    this.startAnimation();
  }

  startAnimation = () => {
    Animated.loop(
      Animated.timing(this.translateX, {
        toValue: this.props.width ?? width * .9,
        duration: 1000,
        useNativeDriver: true
      })
    ).start();
  };

  render() {
    const {
      width = "100%",
      height,
      number = 1,
      containerStyle,
      grandientColors = ['transparent', 'rgba(0, 0, 0, .05)', 'transparent']
    } = this.props;
    const array = Array.from({ length: number });
    return (
      <View style={{ marginHorizontal: 10 }}>
        {
          array.map((item, index) => <View key={index} style={[{
            width,
            height,
            borderRadius: 10,
            backgroundColor: 'rgba(80, 105, 80, .12)',
            overflow: 'hidden',
            marginVertical: 5
          },
            containerStyle
          ]}>
            <Animated.View style={[{ width: '100%', height: '100%', transform: [{ translateX: this.translateX }] }]}>
              <LinearGradient
                style={{ width: '100%', height: '100%' }}
                colors={grandientColors}
                start={{ x: 1, y: 1 }}
              />
            </Animated.View>
          </View>)
        }
      </View>
    );
  }
}

export default SkeletonView;
