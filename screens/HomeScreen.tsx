import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, StatusBar, Dimensions, TouchableOpacity, ScrollView, StyleSheet, ImageBackground, Modal, ActivityIndicator, TextInput, RefreshControl } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
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
import { getCentersWithReservations, getRecentReservations } from '../services/reservation';
import AnimatedSportItem from '../components/AnimatedSportItem';
import SkeletonView from '../components/SkeletonView';
import { searchTerrains } from '../services/centres';
import { useFocusEffect } from '@react-navigation/native';
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
    const [reservations, setReservations] = useState([]);
    const [reservationLoading, setReservationLoading] = useState(true);
    const [sportLoading, setSportLoading] = useState(true);
    const [centerResearchModal, setCenterResearchModal] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [searchedCenters, setSearchedCenters] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [centersWithReservationsList, setCentersWithReservationsList] = useState([]);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
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
            paddingVertical: 10,
            marginBottom: 15
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

    useFocusEffect(
        React.useCallback(() => {
            // Vérifie si le retour s'est fait depuis ReservationScreen
            if (props.route.params?.fromReservationScreen) {
                onLoad();

                // Réinitialisation des paramètres pour éviter une exécution répétée
                props.navigation.setParams({ fromReservationScreen: undefined });
            }
        }, [props.route.params?.fromReservationScreen])
    );

    async function onLoad() {
        setLoading(true);
        setDisplayGooglebtn(false)
        const centersWithReservations = await getCentersWithReservations();
            await AsyncStorage.setItem(
                'centersWithReservations',
                JSON.stringify(centersWithReservations)
            )

        const userStr = await AsyncStorage.getItem("userInfo")
        if (userStr) {
            const { user } = JSON.parse(userStr)
            setUser(user)
            
            setLoading(false);
            setRefreshing(false);
            loadLastReservations(user);
            const dbUser = await findClientByEmail(user.email)
            await AsyncStorage.setItem('dbUser', JSON.stringify(dbUser));
            setDbUser(dbUser);
        }else {
            setLoading(false);
            setRefreshing(false);
            setReservationLoading(false);
        }

        try {
            setSportLoading(true);
            const sportsData = await fetchSportsActivities();
            setSports(sportsData.sports); // Supposons que l'API retourne un objet avec une clé 'sports'
            setSportLoading(false);
        } catch (error) {
            console.error("Failed to fetch sports activities:", error);
            // Vous devriez gérer l'erreur correctement
        }
    }

    async function loadLastReservations(user: any) {
        console.log(user)
        console.log("uuuuuuuuuuuuuuuuuuuuuuuuuuu")
        setReservationLoading(true);
        if(!user) {
            setReservations([])
            setReservationLoading(false);
            return;
        }
        const foundedReservations = await getRecentReservations(user?.email);
        setReservations(foundedReservations);
        setReservationLoading(false);
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

    function navigateToReservationDetails(reservationId: number) {
        props.navigation.navigate("ReservationDetailScreen", { reservationId })
    }

    async function onSearchCenter() {
        if (searchText !== '') {
            setSearchLoading(true);
            const centers = await searchTerrains(searchText);
            console.log(centers);
            setSearchedCenters(centers);
            setSearchLoading(false);
        }
    }

    const renderSportItem = ({ item }: any) => {
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
            <View style={{ width: '100%', position: 'absolute', top: 40, zIndex: 15, backgroundColor: 'transparent' }}>
                {
                    !user ?
                        <TouchableOpacity onPress={() => setDisplayGooglebtn(true)} style={{ height: 35, width: 35, justifyContent: 'center', alignItems: 'center', position: 'absolute', right: 15, top: 5, backgroundColor: theme.lightGreenTranslucent, borderRadius: 10 }}>
                            <FontAwesome name="user" size={15} color="#fff" />
                        </TouchableOpacity> :
                        <TouchableOpacity onPress={() => navigateToNotifications()} style={{ height: 35, width: 35, justifyContent: 'center', alignItems: 'center', position: 'absolute', right: 15, top: 5, backgroundColor: theme.lightGreenTranslucent, borderRadius: 10 }}>
                            <FontAwesome name="bell" size={15} color="#fff" />
                        </TouchableOpacity>
                }
            </View>
            <ScrollView
                style={{ flex: 1 }}
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={() => {
                            setRefreshing(true);
                            onLoad()
                        }}
                    />
                }
            >
                <View style={{ width: '100%' }}>
                    <LinearGradient
                        colors={['#4e9d68', '#69d29d']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{
                            borderBottomEndRadius: 20,
                            borderBottomStartRadius: 20,
                            width: '100%',
                            overflow: 'hidden',
                            paddingTop: 30
                        }}>
                        <ImageBackground source={require('../assets/images/basket-bg.jpg')} imageStyle={{ opacity: .9 }} style={{ flex: 1 }}>

                            <View style={{ paddingHorizontal: 20, paddingTop: 15, maxWidth: width * .6, opacity: .9, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flex: 1, position: 'relative', width, height: 240, }}>
                                <View style={{ maxWidth: width * .6 }}>
                                    <Text style={{ color: 'rgb(248, 252, 248)', marginTop: 15, fontSize: 22, lineHeight: 31, maxWidth: width * .6, fontWeight: '400' }}>
                                        <Text style={{}}>Votre prochain défi commence </Text>
                                        <Text style={{ fontWeight: '900', color: 'rgb(250, 252, 250)' }}>ici !</Text>
                                    </Text>
                                </View>
                                {/* <Image source={require('../assets/images/basket-bg.jpg')} style={{ width: width * .7, height: 240, objectFit: 'contain', position: 'absolute', right: 0 }} /> */}
                            </View>
                        </ImageBackground>
                    </LinearGradient>
                </View>

                <View style={{ width: '100%', marginTop: -35, justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => setCenterResearchModal(true)} style={{
                        width: width * .9,
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row',
                        backgroundColor: '#fff',
                        borderRadius: 20,
                        elevation: 10
                    }}>
                        <Ionicons name="md-search" size={20} color="grey" style={{ padding: 10, marginLeft: 10 }} />
                        <TextInput
                            style={{
                                fontSize: 14,
                                flex: 1,
                                paddingVertical: 16,
                                paddingHorizontal: 10,
                                color: theme.primary,
                                fontWeight: '300'
                            }}
                            placeholder='Recherchez un centre sportif...'
                            placeholderTextColor="grey"
                            editable={false}
                        />
                    </TouchableOpacity>
                </View>

                <View style={{ flex: 1, flexDirection: 'column', width, padding: 15 }}>

                    <View>
                        <Text style={{
                            fontSize: 18,
                            fontWeight: '900',
                            marginBottom: 10,
                            color: theme.primaryText, marginTop: 5
                        }}>Sports</Text>
                        {
                            sportLoading ?
                                <SkeletonView height={50} /> :
                                <FlatList
                                    data={sports}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    keyExtractor={(item: any) => item?.id?.toString()}
                                    contentContainerStyle={[styles.modalContent, {}]}
                                    renderItem={({ item, index }) => {
                                        return <AnimatedSportItem item={item} index={index} theme={theme} navigateToReservationScreen={navigateToReservationScreen} />
                                    }}
                                />
                        }
                    </View>


                    {
                        !reservationLoading && reservations.length > 0 && <View>
                            <Text style={{
                                fontSize: 18,
                                fontWeight: '900',
                                marginBottom: 10,
                                color: theme.primaryText, marginTop: 5
                            }}>Dernières réservations</Text>

                            <View style={{}}>
                                <FlatList
                                    data={reservations}
                                    keyExtractor={(item, index) => index.toString()}
                                    horizontal
                                    pagingEnabled
                                    showsHorizontalScrollIndicator={false}
                                    renderItem={({ item, index }: any) => {
                                        return <TouchableOpacity onPress={() => navigateToReservationDetails(item.reservation_id)} style={{ width: (width - 45) / 2, marginRight: !(reservations.length - 1 === index) ? 15 : 0, paddingVertical: 20, paddingHorizontal: 10, position: 'relative', backgroundColor: 'rgb(230, 232, 229)', borderTopLeftRadius: !(index % 2) ? 20 : 0, borderBottomRightRadius: !(index % 2) ? 20 : 0, borderBottomLeftRadius: index % 2 ? 20 : 0, borderTopRightRadius: index % 2 ? 20 : 0 }}>
                                            <Image
                                                source={{ uri: baseUrlPublic + item.image_sport.replace("public", "storage") }}
                                                style={{ height: 20, width: 20, objectFit: 'contain', position: 'absolute', right: 10, top: 10 }}
                                            />
                                            <Text style={{ marginTop: 20, fontWeight: '300', color: theme.primaryText, fontSize: 15 }} numberOfLines={2}>{item?.centre_sportif?.nom}</Text>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20, width: '100%' }}>
                                                <Ionicons name="location" size={16} color={theme.primaryText} />
                                                <Text style={{ fontSize: 11, marginLeft: 5, color: theme.primaryText, fontWeight: '300' }} numberOfLines={1}>{item?.centre_sportif?.adresse}</Text>
                                            </View>

                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, width: '100%' }}>
                                                <AntDesign name="calendar" size={15} color={theme.primaryText} />
                                                <Text style={{ fontSize: 11, marginLeft: 5, color: theme.primaryText, fontWeight: '300' }}>{item.date_reservation} à {item.heure_debut}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    }}
                                />

                            </View>
                        </View>
                    }
                    {
                        reservationLoading && <View>
                            <Text style={{
                                fontSize: 18,
                                fontWeight: '900',
                                marginBottom: 10,
                                color: theme.primaryText, marginTop: 5
                            }}>Dernières réservations</Text>

                            <View style={{}}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                                    <SkeletonView height={150} width={(width - 70) / 2} containerStyle={{ marginLeft: 0, marginHorizontal: 0, marginRight: 10 }} />
                                    <SkeletonView height={150} width={(width - 70) / 2} containerStyle={{ marginRight: 0 }} />
                                </View>
                            </View>
                        </View>
                    }
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
                <Modal visible={loading} transparent>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, .65)' }}>
                        <LottieView
                            source={require("../assets/lotties/loading-2.json")}
                            autoPlay
                            loop
                            style={{ height: 100 }}
                        />
                    </View>
                </Modal>
 
                <Modal
                    animationType="slide"
                    visible={centerResearchModal}
                    onRequestClose={() => setCenterResearchModal(false)}
                >
                    <View style={{
                        flex: 1,
                        marginTop: 22,
                    }}>
                        <View style={{
                            width: width * .9,
                            flexDirection: 'row',
                            backgroundColor: '#fff',
                            borderRadius: 20,
                            elevation: 10,
                            alignSelf: 'center',
                            alignItems: 'center'
                        }}>
                            <Ionicons name="md-search" size={20} color="grey" style={{ padding: 10, marginLeft: 10 }} />
                            <TextInput
                                autoFocus
                                style={{
                                    fontSize: 14,
                                    flex: 1,
                                    paddingVertical: 16,
                                    paddingHorizontal: 10,
                                    color: 'grey',
                                    fontWeight: '300'
                                }}
                                placeholder='Recherchez un centre sportif...'
                                placeholderTextColor="grey"
                                keyboardType="default"
                                returnKeyType='search'
                                value={searchText}
                                onChangeText={setSearchText}
                                onSubmitEditing={onSearchCenter}
                            />
                        </View>

                        {
                            searchLoading ? <View style={{ flex: 1, position: 'absolute', top: 0, bottom: 0, right: 0, left: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, .65)' }}>
                                <LottieView
                                    source={require("../assets/lotties/loading-2.json")}
                                    autoPlay
                                    loop
                                    style={{ height: 100 }}
                                />
                            </View> : <View style={{ flex: 1, paddingVertical: 10 }}>

                            </View>
                        }

                    </View>
                </Modal>
            </ScrollView>
        </View>
    );

}

