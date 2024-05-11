import React, { useEffect } from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import { baseUrlPublic } from '../services/baseUrl';

// Typage pour les props du composant
interface AnimatedSportItemProps {
  item: {
    nom: string;
    image_png: string;
    id: string; // Assurez-vous que ce type correspond à celui de vos données
  };
  navigateToReservationScreen: (nom: string) => void;
  index: number;
  theme: any;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const AnimatedSportItem: React.FC<AnimatedSportItemProps> = ({
  item,
  navigateToReservationScreen,
  index,
  theme
}) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    const delay = index * 300; // Définir le délai basé sur l'index pour séquencer l'animation

    const scaleId = setTimeout(() => {
      scale.value = withSpring(1, { damping: 10, stiffness: 100 });
    }, delay);

    const opacityId = setTimeout(() => {
      opacity.value = withTiming(1, { duration: 500 });
    }, delay);

    return () => {
      clearTimeout(scaleId);
      clearTimeout(opacityId);
    };
  }, [index]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.itemContainer, animatedStyle]}>
      <AnimatedTouchableOpacity
        style={[styles.button, { backgroundColor: theme.lightGreenTranslucent }]}
        onPress={() => navigateToReservationScreen(item.nom)}
      >
        <Image
          source={{ uri: baseUrlPublic + item.image_png }}
          style={styles.image}
        />
      </AnimatedTouchableOpacity>
      <Text style={[styles.text, { color: theme.primaryText }]}>{item.nom}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    marginHorizontal: 8,
    alignItems: 'center',
  },
  button: {
    height: 75,
    width: 70,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: 35,
    width: 35,
  },
  text: {
    fontSize: 12,
    fontWeight: '300',
    marginTop: 5,
  },
});

export default AnimatedSportItem;
