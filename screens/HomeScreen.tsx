import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, StatusBar, Dimensions, TouchableOpacity, ScrollView, StyleSheet, Animated, ImageBackground, Modal, ActivityIndicator } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Carousel from 'react-native-reanimated-carousel';
import terrains from '../helpers/terrains';
import { useSelector, useDispatch } from 'react-redux';
import lightTheme from '../themes/lightTheme';
import darkTheme from '../themes/darkTheme';
import { LinearGradient } from 'expo-linear-gradient';
import GoogleSignInModal from '../components/GoogleSignInModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from "lottie-react-native";
import { findClientByEmail } from '../services/user';
import { fetchSportsActivities } from '../services/sports';
import { FlatList } from 'react-native-gesture-handler';
import { baseUrlPublic } from '../services/baseUrl';
import NewsSection from '../components/NewsSection';

const { width, height } = Dimensions.get("window");

export default function HomeScreen(props: any) {
    const mode = useSelector((state: any) => state.theme);
    const theme = mode === 'light' ? lightTheme : darkTheme;
    const [displayGooglebtn, setDisplayGooglebtn] = useState(false)
    const [activitiesModal, setActivitiesModal] = useState(false)
    const [sports, setSports] = useState([]);
    const [user, setUser] = useState<any>();
    const [loading, setLoading] = useState(true);
    const [dbUser, setDbUser] = useState(null);
    const animation1 = useRef<any>()
    const animation2 = useRef<any>()
    const animation3 = useRef<any>()
    const animation4 = useRef<any>()
    const loadingAnimation = useRef<any>()


    const styles = StyleSheet.create({
        container: {
            flex: 1,
            alignItems: 'center',
        },
        imageBackground: {
            paddingTop: 100,
            marginBottom: 20,
            width,
            height: 320,
            justifyContent: 'flex-end',
            alignItems: 'center',
            borderBottomLeftRadius: 60,
            borderBottomRightRadius: 60,
        },
        headerView: {
            height: 50,
            position: 'absolute',
            top: 30,
            width,
            flexDirection: 'row',
            alignItems: 'center',
        },
        authButton: {
            height: 35,
            width: 35,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            right: 20,
            top: 5,
            backgroundColor: theme.lightGreenTranslucent,
            borderRadius: 20,
        },
        clubInfoContainer: {
            width: width * .95,
            paddingVertical: 20,
            paddingHorizontal: 10,
            elevation: 15,
            marginBottom: -20,
            borderRadius: 15,
            backgroundColor: theme.primaryBackground,
        },
        clubRow: {
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            position: 'relative',
            marginTop: -10,
        },
        logoContainer: {
            backgroundColor: theme.primaryBackground,
            padding: 8,
            borderRadius: 10,
            elevation: 10,
            top: -30,
        },
        clubTextContainer: {
            flex: 1,
            paddingHorizontal: 20,
            paddingVertical: 15,
            marginHorizontal: 10,
            backgroundColor: 'rgb(230, 230, 230)',
            borderRadius: 5,
        },
        clubText: {
            color: theme.primaryText,
            fontWeight: '800',
        },
        infoIcon: {
            color: theme.primary,
        },
        actionButtonContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-evenly',
            marginTop: 10,
        },
        actionButton: {
            flexDirection: 'column',
            width: '23%',
            backgroundColor: theme.primaryBackground,
            alignItems: 'center',
            paddingVertical: 15,
            justifyContent: 'center',
            borderRadius: 8,
            elevation: 5,
        },
        actionButtonText: {
            fontSize: 12,
            fontWeight: '300',
            color: theme.primaryText,
            marginTop: 5,
        },
        modalContent: {
            padding: 20,
        },
        sportItem: {
            marginBottom: 20,
            borderRadius: 10,
            overflow: 'hidden',
            elevation: 1,
            width: '100%',
            justifyContent: 'space-between',
            padding: 15,
            backgroundColor: theme.primaryBackground,
            flexDirection: 'row'
        },
        sportImage: {
            width: width - 40,
            height: 200,
            justifyContent: 'flex-end',
            padding: 15,
        },
        sportName: {
            fontSize: 24,
            fontWeight: 'bold',
            color: theme.primaryText,
        },
        sportCount: {
            fontSize: 16,
            color: theme.primaryText,
        },
        newsSection: {
            flex: 1,
            flexDirection: 'column',
            padding: 15,
        },
        newsTitle: {
            fontSize: 16,
            fontWeight: '800',
            color: '#222',
            marginVertical: 10,
        },
        loaderModal: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        loaderAnimation: {
            height: 100,
            width: 100,
        },
        modalHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 16, // Ajuste selon tes besoins
            borderBottomWidth: 1,
            borderBottomColor: '#ccc', // Ajuste la couleur selon ton thème
            backgroundColor: 'white', // Ou autre couleur selon le mode clair/sombre
        },
        modalTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: '#000', // Ajuste la couleur selon ton thème
        },
        closeButton: {
            padding: 10, // Ajuste pour faciliter le toucher
        },
    });

    // Dans le render de votre HomeScreen, utilisez ces styles comme ceci :
    <ImageBackground
        source={require("../assets/images/tennis-bg.jpeg")}
        imageStyle={styles.imageBackground}
        style={styles.imageBackground}
    >
        {/* ... */}
    </ImageBackground>
    // Continuez à utiliser les styles de cette façon pour le reste de votre composant

    function onPadelPress(padel: any) {
        props.stackNavigation.navigate("Reservation", { padel });
    }

    useEffect(() => {
        onLoad();
        props?.navigation?.setOptions({
            headerShown: false,
            headerRight: () => <TouchableOpacity style={{ padding: 5, backgroundColor: theme.lightGreenTranslucent, borderRadius: 20, marginRight: 5 }}>
                <FontAwesome name="bell" size={18} color={theme.primaryText} />
            </TouchableOpacity>,
        })
        // onCarouselSlideToItem(0)
    }, [])

    async function onLoad() {
        setLoading(true);
        setDisplayGooglebtn(false)
        const userStr = await AsyncStorage.getItem("userInfo")
        if (userStr) {
            const { user } = JSON.parse(userStr)
            setUser(user)
            const dbUser = await findClientByEmail(user.email)
            await AsyncStorage.setItem('dbUser', JSON.stringify(dbUser));
            setDbUser(dbUser);
        }

        try {
            const sportsData = await fetchSportsActivities();
            setSports(sportsData.sports); // Supposons que l'API retourne un objet avec une clé 'sports'
        } catch (error) {
            console.error("Failed to fetch sports activities:", error);
            // Vous devriez gérer l'erreur correctement
        }

        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }

    function showSportsModal() {
        setActivitiesModal(true);
    }

    function hideSportsModal() {
        setActivitiesModal(false);
    }

    function navigateToNotifications() {
        props.stackNavigation.navigate("NotificationScreen", { dbUser });
    }

    function navigateToReservationScreen(activity: string) {
        hideSportsModal();
        props.stackNavigation.navigate("Reservation", { activity });
    }

    const renderSportItem = ({ item }: any) => { 
        console.log(baseUrlPublic + item.image_png)
        return (
            <TouchableOpacity onPress={() => navigateToReservationScreen(item.nom)} style={styles.sportItem}>
                <View>
                    <Text style={styles.sportName}>{item.nom}</Text>
                    <Text style={styles.sportCount}>{`${item.centres_sportifs_count} ${item.centres_sportifs_count > 1 ? 'centres disponibles' : 'centre disponible'}`}</Text>
                </View>
                <Image
                    source={{ uri: baseUrlPublic + item.image_png }}
                    style={{ height: 80, width: 80 }}
                />
            </TouchableOpacity>
        )
    };


    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000" />
            <ScrollView style={{ flex: 1 }}>
                <ImageBackground
                    source={require("../assets/images/tennis-bg.jpeg")}
                    style={styles.imageBackground}
                    imageStyle={{ borderBottomLeftRadius: 60, borderBottomRightRadius: 60 }}
                >
                    <View style={styles.headerView}>

                        {
                            !user ?
                                <TouchableOpacity onPress={() => setDisplayGooglebtn(true)} style={{ height: 35, width: 35, justifyContent: 'center', alignItems: 'center', position: 'absolute', right: 20, top: 5, backgroundColor: theme.lightGreenTranslucent, borderRadius: 20 }}>
                                    <FontAwesome name="user" size={15} color="#fff" />
                                </TouchableOpacity> :
                                <TouchableOpacity onPress={() => navigateToNotifications()} style={{ height: 35, width: 35, justifyContent: 'center', alignItems: 'center', position: 'absolute', right: 20, top: 5, backgroundColor: theme.lightGreenTranslucent, borderRadius: 20 }}>
                                    <FontAwesome name="bell" size={15} color="#fff" />
                                </TouchableOpacity>
                        }
                    </View>
                    <View style={styles.clubInfoContainer}>
                        <View style={styles.clubRow}>
                            <View style={styles.logoContainer}>
                                <Image
                                    source={require("../assets/images/logo.png")}
                                    style={{ height: 50, width: 50, resizeMode: 'contain' }}

                                />
                            </View>

                            <View style={styles.clubTextContainer}>
                                <Text style={styles.clubText}>Cotonou Padel Club</Text>
                            </View>
                            <FontAwesome5 name="info-circle" size={20} style={styles.infoIcon} />
                        </View>

                        <View style={styles.actionButtonContainer}>
                            <TouchableOpacity onPress={showSportsModal} style={{ flexDirection: 'column', width: '23%', backgroundColor: theme.primaryBackground, alignItems: 'center', paddingVertical: 15, justifyContent: 'center', borderRadius: 8, elevation: 5 }}>
                                <FontAwesome name="calendar-check-o" size={17} color={theme.primary} />
                                <Text style={{ fontSize: 12, fontWeight: '300', color: theme.primaryText, marginTop: 5 }}>Réserver</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={{ flexDirection: 'column', width: '23%', backgroundColor: theme.primaryBackground, alignItems: 'center', paddingVertical: 15, justifyContent: 'center', borderRadius: 8, elevation: 5 }}>
                                <FontAwesome5 name="trophy" size={17} color={theme.primary} />
                                <Text style={{ fontSize: 12, fontWeight: '300', color: theme.primaryText, marginTop: 5 }}>Matchs</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={{ flexDirection: 'column', width: '23%', backgroundColor: theme.primaryBackground, alignItems: 'center', paddingVertical: 15, justifyContent: 'center', borderRadius: 8, elevation: 5 }}>
                                <FontAwesome name="shopping-cart" size={17} color={theme.primary} />
                                <Text style={{ fontSize: 12, fontWeight: '300', color: theme.primaryText, marginTop: 5 }}>Boutique</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={{ flexDirection: 'column', width: '23%', backgroundColor: theme.primaryBackground, alignItems: 'center', paddingVertical: 15, justifyContent: 'center', borderRadius: 8, elevation: 5 }}>
                                <FontAwesome5 name="users" size={17} color={theme.primary} />
                                <Text style={{ fontSize: 12, fontWeight: '300', color: theme.primaryText, marginTop: 5 }}>Amis</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </ImageBackground>


                <View style={{ flex: 1, flexDirection: 'column', width, padding: 15 }}>

                    <View>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        marginBottom: 10,
                        color: theme.primaryText, marginTop: 20
                    }}>ACTIVITES</Text>
                    <FlatList
                            data={sports}
                            horizontal
                            keyExtractor={(item: any) => item?.id?.toString()}
                            contentContainerStyle={styles.modalContent}
                            renderItem={({item, index}) => {
                                console.log(item)
                                return <TouchableOpacity style={{
                                    height: 60, width: 60, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginHorizontal: 5, backgroundColor: theme.lightGreenTranslucent
                                }}>
                                <Image
                    source={{ uri: baseUrlPublic + item.image_png }}
                    style={{ height: 30, width: 30 }}
                />
                                </TouchableOpacity>
                            }}
                        />
                    </View>

                    <NewsSection />

                    <Text style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        marginBottom: 10,
                        color: theme.primaryText, marginTop: 20
                    }}>PHOTOS</Text>

                </View>

                <GoogleSignInModal
                    isVisible={displayGooglebtn}
                    onClose={() => onLoad()}
                />

                <Modal visible={activitiesModal} animationType="slide" onRequestClose={hideSportsModal}>
                    <View style={{ flex: 1 }}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Sélectionnez une activité</Text>
                            <TouchableOpacity onPress={hideSportsModal} style={styles.closeButton}>
                                <FontAwesome name="close" size={24} color="#000" />
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={sports}
                            renderItem={renderSportItem}
                            keyExtractor={(item: any) => item?.id?.toString()}
                            contentContainerStyle={styles.modalContent}
                        />
                    </View>
                </Modal>
                <Modal visible={loading}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size="small" color={theme.primary} />
                    </View>
                </Modal>
            </ScrollView>
        </View>
    );

}

