import React, { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, SharedValue } from 'react-native-reanimated';

type AnimationStyleFunction = (progress: number) => object;

interface AnimatedScreenComponentProps {
  children: React.ReactNode;
  animationInStyle: AnimationStyleFunction;
  animationOutStyle: AnimationStyleFunction;
  duration?: number;
  onUnmount?: () => void;
}

const AnimatedScreenComponent: React.FC<AnimatedScreenComponentProps> = ({
  children,
  animationInStyle,
  animationOutStyle,
  duration = 500,
  onUnmount,
}) => {
  const animationProgress = useSharedValue(0);
  const isMounted = useSharedValue(true);

  const animatedStyles = useAnimatedStyle(() => {
    return isMounted.value ? animationInStyle(animationProgress.value) : animationOutStyle(animationProgress.value);
  });

  useFocusEffect(
    useCallback(() => {
      // Animation à l'entrée
      animationProgress.value = withTiming(1, { duration, easing: Easing.out(Easing.exp) });

      return () => {
        // Animation à la sortie
        animationProgress.value = withTiming(0, { duration, easing: Easing.out(Easing.exp) }, () => {
          isMounted.value = false;
          if (onUnmount) onUnmount();
        });
      };
    }, [animationProgress, duration, onUnmount])
  );

  return <Animated.View style={[{ flex: 1 }, animatedStyles]}>{children}</Animated.View>;
};
