import React from 'react';
import { Modal, View, Text, Pressable, ScrollView, Image, TouchableOpacity, Animated, ImageBackground } from 'react-native';
import { AntDesign, FontAwesome5 } from '@expo/vector-icons'; // Adjust import as needed

interface SportCenterModalProps {
    sportCenterModal: boolean;
    setSportCenterModal: (value: boolean) => void;
    currentCenterImageUrl: string;
    selectedSportCenter: any; // Update the type as per your data structure
    tarif: number;
    currentCenterDistanceArrondie: number;
    theme: any; // Update the type as per your theme structure
    handlePhoneCall: () => void;
    shareLocation: () => void;
    onBookCenterPress: (amount: number, center_id: number) => void;
    height: number;
}

const SportCenterModal: React.FC<SportCenterModalProps> = ({ sportCenterModal, setSportCenterModal, currentCenterImageUrl, selectedSportCenter, tarif, currentCenterDistanceArrondie, theme, handlePhoneCall, shareLocation, onBookCenterPress, height }) => {
    const centerModalAnimatedStyles = {}; // Define your animated style here

    return (
        <Modal transparent visible={sportCenterModal} onRequestClose={() => setSportCenterModal(false)} >
            <ImageBackground
                source={require('../assets/images/shapes.png')}
                style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(80, 80, 80, .8)' }}
                imageStyle={{ opacity: .9 }} // Adjust opacity here if necessary
                blurRadius={100}
            >
                <Animated.View style={[{
                    backgroundColor: 'rgb(240, 240, 240)',
                    borderRadius: 8,
                    overflow: 'hidden',
                }, centerModalAnimatedStyles]}>
                    <ScrollView>
                        <Pressable onPress={() => setSportCenterModal(false)} style={{
                            position: 'absolute',
                            right: 10,
                            top: 10,
                            zIndex: 10,
                        }}>
                            <AntDesign name="close" size={24} color={theme.primaryText} />
                        </Pressable>

                        <Image source={{ uri: currentCenterImageUrl }} style={{ width: '100%', height: height * .3 }} />
                        <View style={{ padding: 12, flex: 1, position: 'relative' }}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', marginVertical: 10 }}>
                                {selectedSportCenter?.nom}
                            </Text>
                            <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Text style={{ fontSize: 15, color: theme.primary, fontWeight: '600' }}>{tarif} FCFA </Text>
                                <Text style={{ fontSize: 15, color: '#777' }}>A environ {currentCenterDistanceArrondie} km</Text>
                            </View>

                            <Text style={{
                                marginTop: 15,
                                fontSize: 16,
                                fontWeight: 'bold',
                                color: theme.primaryText,
                            }}>Description</Text>
                            <Text style={{
                                color: theme.primaryText,
                                marginTop: 5,
                            }}>{selectedSportCenter?.description}</Text>
                            <Text style={{
                                marginTop: 15,
                                fontSize: 16,
                                fontWeight: 'bold',
                                color: theme.primaryText,
                            }}>Adresse</Text>
                            <Text style={{
                                color: theme.primaryText,
                                marginTop: 5,
                            }}>{selectedSportCenter?.adresse}</Text>
                            <Text style={{
                                marginTop: 15,
                                fontSize: 16,
                                fontWeight: 'bold',
                                color: theme.primaryText,
                            }}>Contact</Text>
                            <Pressable onPress={handlePhoneCall} style={{
                                marginTop: 5,
                                backgroundColor: 'transparent',
                                padding: 6,
                                alignItems: 'flex-start',
                                justifyContent: 'flex-start',
                                borderBottomWidth: 1,
                                borderColor: theme.primary,
                                alignSelf: 'flex-start'
                            }}>
                                <Text style={{ color: theme.primary }}>{selectedSportCenter?.telephone}</Text>
                            </Pressable>

                            <Pressable onPress={shareLocation} style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                backgroundColor: theme.primary + '33', // Subtle background
                                padding: 10,
                                paddingHorizontal: 12,
                                borderRadius: 4, // Rounded corners for modern look
                                marginTop: 10,
                                marginBottom: 100
                            }}>
                                <Text style={{ color: theme.primary, marginRight: 10 }}>Partager l'emplacement</Text>
                                <FontAwesome5 name="location-arrow" size={20} color={theme.primary} />
                            </Pressable>
                        </View>
                    </ScrollView>
                    <TouchableOpacity onPress={() => onBookCenterPress(tarif, selectedSportCenter?.id)} style={{
                        backgroundColor: theme.primary,
                        padding: 18,
                        borderRadius: 8,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 20,
                        position: 'absolute',
                        bottom: 10,
                        left: 10,
                        right: 10,
                        alignSelf: 'center',
                    }}>
                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Réserver maintenant</Text>
                    </TouchableOpacity>
                </Animated.View>
            </ImageBackground>
        </Modal>
    );
}

export default SportCenterModal;
