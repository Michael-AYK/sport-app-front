import React from 'react';
import { Modal, View, Text, Pressable, Animated } from 'react-native';
import LottieView from 'lottie-react-native';

interface SuccessModalProps {
    displaySuccessModal: boolean;
    handleCloseSuccessModal: () => void;
    theme: any;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ displaySuccessModal, handleCloseSuccessModal, theme }) => {
    const animatedStyle = {}; // Define your animated style here

    return (
        <Modal visible={displaySuccessModal} transparent={true}>
            {/* Global container */}
            <View style={{ flex: 1, position: 'relative', backgroundColor: 'rgba(0, 0, 0, .7)', justifyContent: 'center', alignItems: 'center' }}>
                {/* Content Container */}
                <Animated.View style={[animatedStyle, { backgroundColor: '#fff', padding: 20, position: 'relative', width: '95%', borderRadius: 10, justifyContent: 'center', alignItems: 'center' }]}>
                    <LottieView
                        autoPlay
                        loop={false}
                        style={{ height: 120, width: 120 }}
                        source={require('../assets/lotties/success-2.json')}
                    />

                    <Text style={{ fontSize: 20, fontWeight: '800', marginBottom: 20, marginTop: 10 }}>Réservation ajoutée !</Text>
                    <Text style={{ textAlign: 'center', lineHeight: 22, fontSize: 15 }}>Votre réservation a été enregistrée avec succès ! N'hésitez pas à nous contacter pour toute préoccupation.</Text>


                    <View style={{ width: '100%', marginTop: 40 }}>
                        <Pressable
                            onPress={handleCloseSuccessModal}
                            style={{ alignSelf: 'center', width: '100%', justifyContent: 'center', alignItems: 'center', borderRadius: 8, paddingVertical: 18, paddingHorizontal: 40, backgroundColor: theme.primary }}>
                            <Text style={{ color: '#fff', fontWeight: '800' }}> Ok, j'ai compris </Text>
                        </Pressable>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
}

export default SuccessModal;
