import React, { useRef } from 'react';
import Animated, {
    useAnimatedStyle,
    interpolate,
    Extrapolate,
    useSharedValue,
} from 'react-native-reanimated';
import { View, Text, TouchableOpacity, Pressable, Image, StyleSheet, Dimensions, ActivityIndicator, Modal, FlatList } from 'react-native';
import { baseUrlPublic } from '../services/baseUrl';


const { width } = Dimensions.get("window");

function RenderSportCenterItem({ item, index, scrollX, theme, duree, onItemPress, onBookCenterPress }: any) {
    const itemRef = useRef<any>();
    const animatedButtonStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            scrollX.value,
            [(index - 1) * width, index * width, (index + 1) * width],
            [0, 1, 0],
            Extrapolate.CLAMP
        );
        const scale = interpolate(
            scrollX.value,
            [(index - 1) * width, index * width, (index + 1) * width],
            [0.5, 1, 0.5],
            Extrapolate.CLAMP
        );
        return {
            opacity,
            transform: [{ scale }],
        };
    });

    // Récupérez l'URL de l'image corrigée
    const imageUrl = baseUrlPublic + item.photo_couverture.replace("public", "storage");
    const distanceArrondie = item.distance ? item.distance.toFixed(2) : "N/A";

    let tarif;
    switch (duree) {
        case 60:
            tarif = item.tarif_60_min;
            break;
        case 90:
            tarif = item.tarif_90_min;
            break;
        case 120:
            tarif = item.tarif_120_min;
            break;
        default:
            tarif = "N/A";
    }

    return (
        <Animated.View style={{
            width: width * 0.9,
            borderRadius: 10,
            overflow: 'hidden',
            backgroundColor: 'rgb(238, 238, 242)',
            elevation: 1
        }}>
            <Pressable ref={itemRef} onPress={() => onItemPress(item, index, itemRef)}>
                <View style={{ width: '100%', height: 230, overflow: 'hidden', borderRadius: 12 }}>
                    <Image source={{ uri: imageUrl }} style={{ width: '100%', height: '100%' }} />
                    <View style={{
                        ...StyleSheet.absoluteFillObject,
                        backgroundColor: theme.primary,
                        opacity: 0.25, // Ajustez l'opacité selon le besoin
                    }} />
                </View>
                <View style={{ padding: 8 }}>
                    <Text style={{ fontSize: 15, fontWeight: 'bold', color: theme.primaryText, marginVertical: 10 }}>
                        {item.nom}
                    </Text>
                    <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 15, color: theme.primary, fontWeight: '600' }}>{tarif} FCFA </Text>
                        <Text style={{ fontSize: 15, color: '#777' }}>A environ {distanceArrondie} km</Text>
                    </View>
                    <Animated.View style={[{
                    }, animatedButtonStyle]}>
                        <TouchableOpacity onPress={() => onBookCenterPress(item, tarif, item?.id)} style={{
                            backgroundColor: theme.primary, // Exemple de couleur
                            padding: 18,
                            borderRadius: 8,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: 30
                        }}>
                            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Réserver maintenant</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </Pressable>
        </Animated.View>
    );
}

export default RenderSportCenterItem;