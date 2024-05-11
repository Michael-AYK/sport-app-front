import { View, Text, Image, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Alert, Modal } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getReservationDetails, updateParticipantStatus } from '../services/reservation';
import { useSelector } from 'react-redux';
import lightTheme from '../themes/lightTheme';
import darkTheme from '../themes/darkTheme';
import { baseUrlPublic } from '../services/baseUrl';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withSpring } from 'react-native-reanimated';
import AntDesign from '@expo/vector-icons/AntDesign';
import Gravatar from '../components/Gravatar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from "lottie-react-native";
import QRCode from 'react-native-qrcode-svg';


const { width } = Dimensions.get('window');
// Component pour les détails avec icône
const DetailItem = ({ icon, title, value, theme }: any) => {
    if (!value) {
        return;
    }
    return (
        <View style={styles.detailItemContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                <Text style={[styles.detailTitle, { color: theme.primaryText, textTransform: 'uppercase' }]}>{title}</Text>
                <Text style={[styles.detailValue, { color: theme.primaryText }]}>{value}</Text>
            </View>
        </View>
    );
};


export default function ReservationDetailScreen(props: any) {
    const mode = useSelector((state: any) => state.theme);
    const theme = mode === 'light' ? lightTheme : darkTheme;
    const { reservationId } = props.route.params;
    const [spinner, setSpinner] = useState(false);
    const [reservationDetails, setReservationDetails] = useState<any>(null);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false); // Nouvel état pour contrôler l'affichage du modal
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [showResponseModal, setShowResponseModal] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');
    const [qrCodeValue, setQrCodeValue] = useState('');


    const handleReject = async () => {
        setSpinner(true)
        const response = await updateParticipantStatus(reservationId, currentUser?.emaii, "rejected");
        console.log(response);
        // Mettre à jour le message de la réponse et afficher le modal de réponse
        setResponseMessage(response.message); // Assurez-vous que la réponse contient un champ 'message'
        setShowResponseModal(true);
        setSpinner(false)
    };

    const handleConfirm = async () => {
        setSpinner(true)
        const response = await updateParticipantStatus(reservationId, currentUser?.email, "confirmed");
        console.log(response);
        // Mettre à jour le message de la réponse et afficher le modal de réponse
        setResponseMessage(response.message); // Assurez-vous que la réponse contient un champ 'message'
        setShowResponseModal(true);
        setSpinner(false)
    };


    const loadReservationDetails = async () => {
        setSpinner(true)
        const userStr: any = await AsyncStorage.getItem("userInfo")
        if (userStr) {
            const { user } = JSON.parse(userStr)
            const details = await getReservationDetails(reservationId, user?.email);
            console.log(details);
            const qrCodeVal = { reservationId, participantEmail: user?.email };
            const v = JSON.stringify(qrCodeVal);
            console.log(v);
            setQrCodeValue(v);
            setReservationDetails(details);
            setCurrentUser(user)
        }
        setSpinner(false);
    };


    useEffect(() => {
        loadReservationDetails();
    }, []);

    // Animation shared values
    const dateOpacity = useSharedValue(0);
    const timeOpacity = useSharedValue(0);
    const amountOpacity = useSharedValue(0);
    const participantsScale = useSharedValue(0);
    const qrCodeScale = useSharedValue(0);

    // Trigger animations on load
    useEffect(() => {
        dateOpacity.value = withDelay(100, withSpring(1));
        timeOpacity.value = withDelay(200, withSpring(1));
        amountOpacity.value = withDelay(300, withSpring(1));
        participantsScale.value = withDelay(400, withSpring(1));
        qrCodeScale.value = withDelay(500, withSpring(1));
    }, [reservationDetails]);

    const dateStyle = useAnimatedStyle(() => {
        return {
            opacity: dateOpacity.value,
            transform: [{ translateY: withSpring(dateOpacity.value * 10 - 10) }],
        };
    });

    const timeStyle = useAnimatedStyle(() => {
        return {
            opacity: timeOpacity.value,
            transform: [{ translateY: withSpring(timeOpacity.value * 10 - 10) }],
        };
    });

    const amountStyle = useAnimatedStyle(() => {
        return {
            opacity: amountOpacity.value,
            transform: [{ translateY: withSpring(amountOpacity.value * 10 - 10) }],
        };
    });

    const participantsStyle = useAnimatedStyle(() => {
        return {
            opacity: participantsScale.value,
            transform: [{ scale: participantsScale.value }],
        };
    });

    const qrCodeStyle = useAnimatedStyle(() => {
        return {
            opacity: qrCodeScale.value,
            transform: [{ scale: qrCodeScale.value }],
        };
    });

    return (
        <View style={{ flex: 1, position: 'relative' }}>
            <TouchableOpacity onPress={() => props.navigation.goBack()} style={{ backgroundColor: theme.lightGreenTranslucent, zIndex: 10, position: 'absolute', top: 40, left: 10, padding: 10, borderRadius: 8 }}>
                <AntDesign name='left' size={15} color={theme.primaryText} />
            </TouchableOpacity>
            <ScrollView style={{ flex: 1, backgroundColor: theme.primaryBackground }}>
                <View style={{ height: 260, width: '100%', position: 'relative' }}>
                    <Image
                        source={{ uri: baseUrlPublic + reservationDetails?.centre_sportif?.photo_couverture?.replace("public", "storage") }}
                        style={{ height: 260, width: '100%' }}
                    />
                    <LinearGradient
                        colors={['transparent', theme.primaryBackground]}
                        style={StyleSheet.absoluteFillObject}
                        start={{ x: 0.5, y: 0.3 }}
                        end={{ x: 0.5, y: 1 }}
                    />
                </View>

                <View style={{ flex: 1, padding: 20 }}>
                    <View style={{ flexDirection: 'row', width: '100%', marginTop: 10, marginBottom: 20, position: 'relative' }}>
                        <View style={{ width: '80%' }}>
                            <Text style={{ fontSize: 17, color: theme.primaryText, fontWeight: '800' }}>{reservationDetails?.centre_sportif?.nom}</Text>
                            <Text style={{ fontSize: 14, color: theme.primaryTextLight, marginTop: 8 }}>{reservationDetails?.centre_sportif?.adresse}</Text>
                        </View>
                        <View style={{ backgroundColor: theme.lightGreenTranslucent, position: 'absolute', right: 0, height: 60, width: 60, borderRadius: 15, justifyContent: 'center', alignItems: 'center' }}>
                            <Image
                                source={{ uri: baseUrlPublic + reservationDetails?.sport?.image_png?.replace("public", "storage") }}
                                style={{ height: 30, width: 30 }}
                            />
                        </View>
                    </View>

                    {
                        reservationDetails !== null && <View style={{ flex: 1 }}>
                            <Animated.View style={[styles.detailsSection, dateStyle]}>
                                <DetailItem theme={theme} icon="calendar" title="Date" value={reservationDetails?.date_reservation} />
                            </Animated.View>

                            <Animated.View style={[styles.detailsSection, timeStyle]}>
                                <DetailItem theme={theme} icon="clock" title="Heure" value={`${reservationDetails?.heure_debut} - ${reservationDetails?.heure_fin}`} />
                            </Animated.View>

                            <Animated.View style={[styles.detailsSection, amountStyle]}>
                                <DetailItem theme={theme} icon="phone" title="Contact du centre" value={`${reservationDetails?.centre_sportif?.telephone}`} />
                            </Animated.View>

                            <Animated.View style={[styles.detailsSection, amountStyle]}>
                                <DetailItem theme={theme} icon="money" title="Montant" value={`${reservationDetails?.montant} FCFA`} />
                            </Animated.View>

                            <Animated.View style={[styles.detailsSection, participantsStyle]}>
                                <Text style={[styles.participantsTitle, { color: theme.primaryText }]}>Participants :</Text>
                                {
                                    reservationDetails?.participants?.length === 0 ?
                                        <Text style={{ marginBottom: 10, fontSize: 14, color: theme.primaryTextLight }}>Vous êtes le seul participant pour cette session</Text> :
                                        reservationDetails?.participants.map((participant: any, index: number) => (
                                            <View key={index} style={{ marginBottom: 5, flexDirection: 'row', width: '100%', alignItems: 'center' }}>
                                                <Gravatar
                                                    style={{}}
                                                    s={25}
                                                    email={participant?.email}
                                                />
                                                <Text style={[styles.participantName, { color: theme.primaryText }]}>{participant.nom} ({participant.email})</Text>
                                            </View>
                                        ))
                                }
                            </Animated.View>

                            <Animated.View style={[styles.detailsSection, qrCodeStyle, { }]}>
                            <Text style={[styles.participantsTitle, { color: theme.primaryText }]}>Code d'accès :</Text>

                                {
                                    qrCodeValue !== '' && <QRCode
                                    value={qrCodeValue}
                                    size={width * .9} // Taille du QR Code
                                    color={theme.primaryText} // Couleur des carrés du QR Code
                                    backgroundColor={theme.primaryBackground} // Couleur de fond du QR Code
                                />
                                }
                            </Animated.View>
                        </View>
                    }
                </View>
            </ScrollView>

            <Modal
                animationType="slide"
                transparent={true}
                visible={showConfirmationModal}
                onRequestClose={() => setShowConfirmationModal(false)}
            >
                <View style={styles.centeredView}>
                    <View style={[styles.modalView, { backgroundColor: theme.primaryBackground }]}>
                        <Text style={[styles.modalText, { color: theme.primaryText, fontWeight: '300', fontSize: 16, }]}>Êtes-vous sûr de vouloir rejeter cette invitation?</Text>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={{ backgroundColor: theme.primaryBackground, width: '45%', elevation: 8, paddingVertical: 15, paddingHorizontal: 30, borderRadius: 8 }}
                                onPress={() => setShowConfirmationModal(false)}
                            >
                                <Text style={{ color: theme.primaryText, textAlign: 'center' }}>Non</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{ backgroundColor: '#a25', width: '45%', elevation: 8, paddingVertical: 15, paddingHorizontal: 30, borderRadius: 8 }}
                                onPress={handleReject}
                            >
                                <Text style={styles.textStyle}>Oui</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={showResponseModal}
                onRequestClose={() => {
                    setShowResponseModal(false);
                    props.navigation.goBack();
                }}
            >
                <View style={styles.centeredView}>
                    <View style={[styles.modalView, { backgroundColor: theme.primaryBackground }]}>
                        <Text style={[styles.modalText, { color: theme.primaryText }]}>{responseMessage}</Text>
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: theme.primary, borderRadius: 15, paddingVertical: 12, marginTop: 10, width: '100%' }]}
                            onPress={() => {
                                setShowResponseModal(false);
                                props.navigation.goBack();
                            }}
                        >
                            <Text style={styles.textStyle}>Ok</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>


            {
                reservationDetails?.participant_status === "pending" && <View style={{ position: 'absolute', bottom: 10, padding: 15, width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <TouchableOpacity style={{
                        width: '48%',
                        padding: 18,
                        borderRadius: 14,
                        backgroundColor: theme.primaryBackground,
                        justifyContent: 'center',
                        alignItems: 'center',
                        elevation: 4
                    }}
                        onPress={() => setShowConfirmationModal(true)}>
                        <Text style={{ color: '#a25' }}>Rejeter</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{
                        width: '48%',
                        padding: 18,
                        borderRadius: 14,
                        backgroundColor: theme.primary,
                        justifyContent: 'center',
                        alignItems: 'center',
                        elevation: 10
                    }}
                        onPress={handleConfirm}>
                        <Text style={{ color: theme.primaryBackground }}>Accepter</Text>
                    </TouchableOpacity>
                </View>
            }

            <Modal visible={spinner} transparent>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, .65)' }}>
                    <LottieView
                        source={require("../assets/lotties/loading-2.json")}
                        autoPlay
                        loop
                        style={{ height: 100 }}
                    />
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    detailsSection: {
        paddingVertical: 5,
    },
    detailItemContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 5,
    },
    detailTextContainer: {
        marginLeft: 10,
    },
    detailTitle: {
        fontSize: 12,
        fontWeight: '600',
    },
    detailValue: {
        fontSize: 12,
        fontWeight: '400'
    },
    participantsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
    participantName: {
        fontSize: 12,
        marginLeft: 10,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0, 0, 0, .3)'
    },
    modalView: {
        margin: 20,
        borderRadius: 15,
        paddingTop: 35,
        paddingHorizontal: 20,
        paddingBottom: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '90%'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
        width: '100%',
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    buttonConfirm: {
        backgroundColor: "#f44336",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    }
});