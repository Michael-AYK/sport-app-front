import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, ImageBackground } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { baseUrlPublic } from '../services/baseUrl';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.65;
const CARD_HEIGHT = 280;
const SWIPE_THRESHOLD = width / 2; // Swipe threshold

interface CardProps {
  reservation: any;
  onSwipe: () => void;
  index: number;
  zIndex: number;
}

const Card: React.FC<CardProps> = ({ reservation, onSwipe, index, zIndex }) => {
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0); // Added for rotation
  const scale = useSharedValue(index > 0 ? (1/index) * .85 : 1); // Scale down each subsequent card

  const gestureHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
    onActive: (event) => {
      translateX.value = event.translationX;
      rotate.value = event.translationX / 20; // Rotate based on translation
    },
    onEnd: (event) => {
      if (Math.abs(event.velocityX) > SWIPE_THRESHOLD) {
        translateX.value = withSpring(width * 2); // Swipe out
        runOnJS(onSwipe)(); 
      } else {
        translateX.value = withSpring(0);
        rotate.value = withSpring(0); // Reset rotation
      }
    },
  });

  console.log("INDEX ==========> " + index);
  console.log("SCALE VALUE ====> " + scale.value);
  

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { rotate: `${rotate.value}deg` }, // Apply rotation
      { scale: scale.value }
    ],
    left: 40 * index,
    zIndex
  }));

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.card, cardStyle]}>
        <TouchableOpacity style={{ height: '100%', width: CARD_WIDTH, overflow: 'hidden', borderRadius: 10 }}>
          <ImageBackground
            style={{ flex: 1 }}
            source={{ uri: baseUrlPublic + reservation?.centre_sportif?.photo_couverture?.replace("public", "storage") }}>
            {/* Additional content can go here */}
          </ImageBackground>
        </TouchableOpacity>
      </Animated.View>
    </PanGestureHandler>
  );
};

interface CarouselProps {
  data: any[];
}

const ReservationCarousel: React.FC<CarouselProps> = ({ data }) => {
  const [cards, setCards] = useState(data); 

  const onSwipe = () => {
    console.log("=================================");
    console.log("SWIPE");
    console.log("=================================");
    console.log(cards)
    console.log("=================================");
    console.log("=================================");
    
    setCards((prevCards) => {
      const nextCards = [...prevCards];
      nextCards.push(nextCards.shift()); // Move the first card to the end
      return nextCards;
    });
  };

  useEffect(() => { 
    setCards(data) 
  }, [])
  
  return (
    <GestureHandlerRootView style={styles.container}>
      {cards.map((card, index) => (
        <Card
          key={index}
          reservation={card}
          onSwipe={onSwipe}
          index={index}
          zIndex={cards.length - index}
        />
      ))}
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: CARD_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
});

export default ReservationCarousel;  
