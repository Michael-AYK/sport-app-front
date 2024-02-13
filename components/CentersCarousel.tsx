import React, { useRef } from 'react';
import { View, FlatList, Dimensions, Image, Text } from 'react-native';
import Animated, { useAnimatedScrollHandler, useAnimatedStyle, useSharedValue, interpolate, Extrapolate } from 'react-native-reanimated';
import { baseUrlPublic } from '../services/baseUrl';

const { width } = Dimensions.get('window');

// Item du carrousel
const CarouselItem = ({ item, scrollX, index, itemWidth, itemStyle }: any) => {
    console.log("uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu");
    console.log(item);
    
    const inputRange = [
        (index - 1) * itemWidth,
        index * itemWidth,
        (index + 1) * itemWidth,
    ];

    const animatedStyle = useAnimatedStyle(() => {
        const scale = interpolate(
            scrollX.value,
            inputRange,
            [0.8, 1, 0.8], // Customisable
            Extrapolate.CLAMP
        );

        return {
            transform: [{ scale }],
        };
    });

    // Appliquer le style custom et le style animé
    return (
        <Animated.View
            style={[
                {
                    width: itemWidth, // Largeur customisable
                    height: 200, // Hauteur customisable ou dynamique
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#ddd', // Customisable
                    marginHorizontal: 10, // Customisable
                    borderRadius: 10, // Customisable
                },
                itemStyle, // Appliquer style custom
                animatedStyle, // Appliquer style animé
            ]}
        >
            <Image
                source={{
                    uri: baseUrlPublic + item.photo_couverture.replace("public", "storage"),
                }}
                style={{
                    width: '100%',
                    height: 200,
                }}
            />
            <Text
                style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    marginTop: 10,
                }}
            >
                {item.nom}
            </Text>
        </Animated.View>
    );
};

// Composant Carrousel
const SportCentersCarousel = ({ data, renderItem, itemWidth = width, itemStyle = {} }: any) => {
    const scrollX = useSharedValue(0);
    console.log("ssssssssssssssssssssssssssssssss")
    return (
        <View style={{ flex: 1, backgroundColor: '#888', width: '100%' }}>
            <Animated.FlatList
                data={data}
                renderItem={({ item, index }) =><CarouselItem item={item} index={index} scrollX={scrollX} itemWidth={itemWidth} itemStyle={itemStyle} />
                }
                keyExtractor={(item, index) => `carouselItem-${index}`}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                snapToInterval={itemWidth} // Assurer que l'item snap correctement
                onScroll={useAnimatedScrollHandler({
                    onScroll: (event) => {
                        scrollX.value = event.contentOffset.x;
                    },
                })}
                scrollEventThrottle={16}
            />
        </View>
    );
};

export default SportCentersCarousel;
