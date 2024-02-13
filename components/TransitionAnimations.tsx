import React, { ReactNode, ReactElement } from 'react';
import { View } from 'react-native';
import Animated, { Easing, useSharedValue, useAnimatedStyle, withSpring, withDelay, useAnimatedReaction } from 'react-native-reanimated';

interface AnimatedTransitionProps {
  children: ReactNode;
  inAnimation: AnimationConfig;
  outAnimation: AnimationConfig;
  show: boolean;
  customStyles?: Record<string, string | number>;
}

interface AnimationConfig {
  duration?: number;
  fromValues?: Record<string, number>;
  toValues?: Record<string, number>;
  properties?: string[];
}

const AnimatedTransition = ({ children, inAnimation, outAnimation, show, customStyles }: AnimatedTransitionProps): ReactElement => {
  const animatedValues = useSharedValue(show ? 0 : 1);

  useAnimatedReaction(() => {
    return show;
  }, (newShow) => {
    const config = newShow ? inAnimation : outAnimation;
    animatedValues.value = withSpring(newShow ? 1 : 0, {
      damping: 2,
      stiffness: 80,
      restSpeedThreshold: 0.01,
      restDisplacementThreshold: 0.01,
      duration: config.duration || 500,
      easing: Easing.inOut(Easing.ease),
    });
  });

  const animatedStyle = useAnimatedStyle(() => {
    const translateY = show ? withDelay(50, animatedValues.value) : 0;
    const opacity = show ? withDelay(50, animatedValues.value) : 0;

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  return (
    <Animated.View style={[customStyles, animatedStyle]}>{children}</Animated.View>
  );
};

export { AnimatedTransition };
