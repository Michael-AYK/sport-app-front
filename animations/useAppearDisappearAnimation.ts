import { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from 'react-native-reanimated';

type Callback = () => void;
// Hook d'animation pour gérer l'apparition et la disparition avec opacité et échelle
export const useAppearDisappearAnimation = () => {
    const opacity = useSharedValue(0);
    const scale = useSharedValue(0);

    // Animation d'apparition
    const animateIn = () => {
        opacity.value = withTiming(1, { duration: 250 });
        scale.value = withTiming(1, { duration: 250 });
    };

    // Animation de disparition
    const animateOut = (callback?: Callback) => {
        opacity.value = withTiming(0, { duration: 250 });
        scale.value = withTiming(0, { duration: 250 }, () => {
            if (callback) {
                runOnJS(callback)(); // Utilisez runOnJS ici si callback n'est pas un worklet
            }
        });
    };

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
            transform: [{ scale: scale.value }],
        };
    });

    return { animatedStyle, animateIn, animateOut };
};
