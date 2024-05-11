import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Modal, TouchableOpacity, Dimensions, ImageBackground, Image, Pressable, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useSelector, useDispatch } from 'react-redux';
import lightTheme from '../themes/lightTheme';
import darkTheme from '../themes/darkTheme';
import { getUserReservations } from '../services/reservation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from "lottie-react-native";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, interpolate, Extrapolate, withDelay, Easing } from 'react-native-reanimated'
import { baseUrlPublic } from '../services/baseUrl';
import moment from 'moment';

const { width, height } = Dimensions.get("window");

const ReservationRow = ({ pastData, upcomingData, index, animateTo, theme, onReservationPress }: any) => {
  const translateX = useSharedValue(animateTo === 'past' ? 0 : -width);

  useEffect(() => {
    const delay = index * 70; // Décalage basé sur l'index
    const destination = animateTo === 'past' ? 0 : -width;

    // Définir un timeout pour retarder l'exécution de l'animation
    const timer = setTimeout(() => {
      translateX.value = withSpring(destination, {
        damping: 20, // Contrôle la résistance au mouvement (plus élevé = moins de "rebond")
        stiffness: 90, // Contrôle la rigidité du ressort (plus élevé = animation plus rapide)
        mass: 2, // Masse de l'objet animé, affecte la "lourdeur" de l'animation
        velocity: 2, // Vitesse initiale de l'animation
      });
    }, delay);

    // Nettoyer le timer si le composant est démonté avant que le timer se termine
    return () => clearTimeout(timer);
  }, [animateTo, index]);


  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));


  return (
    <Animated.View style={[{
      flexDirection: 'row',
      justifyContent: 'flex-start',
      width: width * 2,
      height: 70,
      marginVertical: 5,
    }, animatedStyle]}>
      <TouchableOpacity onPress={() => onReservationPress(pastData.reservation_id)} style={{
        width: width - 30,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: pastData.centre_sportif === undefined || pastData?.centre_sportif?.nom === null ? 'transparent' : theme.lightGreenTranslucent,
        height: 70,
        marginRight: 30,
        borderRadius: 15,
        opacity: pastData.centre_sportif === undefined || pastData?.centre_sportif?.nom === null ? 0 : 1
      }}>
        <Image source={{ uri: baseUrlPublic + pastData?.centre_sportif?.photo_couverture?.replace("public", "storage") }} style={{ width: '20%', height: 70, borderRadius: 8, objectFit: 'contain' }} />
        <View style={{ width: '60%', marginLeft: '2%', paddingVertical: 5 }}>
          <Text style={{ fontSize: 14, color: theme.primaryText, marginBottom: 5, fontWeight: '300', maxWidth: '90%' }} numberOfLines={2}>{pastData?.centre_sportif?.nom}</Text>
          <Text style={{ fontSize: 12, color: theme.primaryTextLight }} numberOfLines={1}>{pastData?.centre_sportif?.adresse}</Text>
        </View>

        <View style={{ width: '20%', }}>
          <Text style={{ fontSize: 10, fontWeight: '500', marginBottom: 8 }}>{pastData?.date_reservation}</Text>
          <Text style={{ fontSize: 10, fontWeight: '300' }}>{pastData?.heure_debut}</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => onReservationPress(upcomingData.reservation_id)} style={{
        width: width - 30,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: upcomingData.centre_sportif === undefined || upcomingData?.centre_sportif?.nom === null ? 'transparent' : theme.lightGreenTranslucent,
        height: 70,
        borderRadius: 15,
        opacity: upcomingData.centre_sportif === undefined || upcomingData?.centre_sportif?.nom === null ? 0 : 1
      }}>
        <Image source={{ uri: baseUrlPublic + upcomingData?.centre_sportif?.photo_couverture?.replace("public", "storage") }} style={{ width: '20%', height: 70, borderRadius: 8, objectFit: 'contain' }} />
        <View style={{ width: '60%', marginLeft: '2%', paddingVertical: 5 }}>
          <Text style={{ fontSize: 14, color: theme.primaryText, marginBottom: 5, fontWeight: '300', maxWidth: '90%' }} numberOfLines={2}>{upcomingData?.centre_sportif?.nom}</Text>
          <Text style={{ fontSize: 12, color: theme.primaryTextLight }} numberOfLines={1}>{upcomingData?.centre_sportif?.adresse}</Text>
        </View>

        <View style={{ width: '20%', }}>
          <Text style={{ fontSize: 10, fontWeight: '500', marginBottom: 8 }}>{upcomingData?.date_reservation}</Text>
          <Text style={{ fontSize: 10, fontWeight: '300' }}>{upcomingData?.heure_debut}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const ReservationsListScreen: React.FC = (props: any) => {
  const [loading, setLoading] = useState(true);
  const [dbUser, setDbUser] = useState<any>(null);
  const [pastReservations, setPastReservations] = useState<any>([])
  const [upcomingReservations, setUpcomingReservations] = useState<any>([])
  const translateX = useSharedValue(0);
  const [reservationsForToday, setReservationsForToday] = useState([]);

  // Calculez la largeur de la vue animée
  const animatedViewWidth = (width - 30) / 2;
  const mode = useSelector((state: any) => state.theme);
  const theme = mode === 'light' ? lightTheme : darkTheme;
  const currentMonth = moment().format('MMMM'); // 'MMMM' pour le nom complet du mois
  const currentDay = moment().format('DD'); // 

  const [animateTo, setAnimateTo] = useState('past');
  const longestListLength = Math.max(pastReservations.length, upcomingReservations.length);
  const combinedReservations = Array.from({ length: longestListLength }).map((_, index) => ({
    pastData: pastReservations[index] ? pastReservations[index] : {},
    upcomingData: upcomingReservations[index] ? upcomingReservations[index] : {},
  }));


  useEffect(() => {
    const today = moment().format('YYYY-MM-DD'); // Assurez-vous que le format correspond à celui de vos dates de réservation
    const filteredReservations = upcomingReservations.filter((reservation: any) => {
      return moment(reservation.date_reservation).format('YYYY-MM-DD') === today
    }
    );
    console.log(filteredReservations);

    setReservationsForToday(filteredReservations);
  }, [upcomingReservations]);

  const ShadowView = ({ children }: any) => (
    <View style={{
      elevation: 20,
      shadowColor: 'rgba(55, 0, 110, 1)',
      shadowOffset: { width: 3, height: 10 },
      shadowOpacity: 0.9,
      shadowRadius: 10,
      width: '95%',
      height: 'auto',
      backgroundColor: theme.primaryBackground,
      borderRadius: 20
    }}>
      {children}
    </View>
  );

  useEffect(() => {
    onLoad()
  }, [])

  async function onLoad() {
    setLoading(true);
    const userStr = await AsyncStorage.getItem("dbUser")
    if (userStr) {
      const { client } = JSON.parse(userStr)
      setDbUser(client);
      loadReservations(client.email).finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
      Alert.alert("Veuillez-vous inscrire")
    }
  }

  async function loadReservations(email: string) {
    const foundedReservations = await getUserReservations(email);
    setPastReservations(foundedReservations?.past_reservations)
    setUpcomingReservations(foundedReservations?.upcoming_reservations)
  }

  const moveToPassed = () => {
    // Déplacez l'Animated.View vers la gauche
    translateX.value = withSpring(5, {
      damping: 10, // Plus élevé pour moins de rebond
      stiffness: 120, // Ajuster selon besoin pour la "dureté" de l'animation
      velocity: 2
    });
    setAnimateTo("past")
  };

  const moveToUpcoming = () => {
    // Déplacez l'Animated.View vers la droite
    translateX.value = withSpring(animatedViewWidth - 5, {
      damping: 10, // Plus élevé pour moins de rebond
      stiffness: 120, // Ajuster selon besoin
      velocity: 2
    });
    setAnimateTo("upcoming")
  };

  const animatedListHeadStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  function navigateToReservationDetails(reservationId: number) {
    props.navigation.navigate("ReservationDetailScreen", { reservationId })
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.primaryBackground }}>

      <View style={{}}>
        <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', marginBottom: 10 }}>
          <ShadowView>
            <LinearGradient
              colors={['#58AF83', '#5AAF93']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                borderRadius: 20,
                width: '100%',
              }}>
              <ImageBackground
                source={require("../assets/images/shapes.png")}
                imageStyle={{ opacity: 0.2 }}
                style={{ padding: 10 }}
              >
                <TouchableOpacity style={{ flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center', padding: 10 }}>
                  <View style={{ marginRight: 25, alignItems: 'flex-start' }}>
                    <Text style={{ fontSize: 18, color: '#eee', textTransform: 'capitalize' }}>{currentMonth}</Text>
                    <Text style={{ fontSize: 30, color: '#fff', fontWeight: '800' }}>{currentDay}</Text>
                  </View>
                  {reservationsForToday.length > 0 ? (
                    <Text style={{ color: '#fff', fontSize: 14, lineHeight: 19, maxWidth: '65%', fontWeight: '300' }}>
                      Vous avez {reservationsForToday.length} réservation(s) pour aujourd'hui
                    </Text>
                  ) : (
                    <Text style={{ color: '#fff', fontSize: 14, lineHeight: 19, maxWidth: '65%', fontWeight: '300' }}>
                      Aucune réservation prévue pour aujourd'hui
                    </Text>
                  )}
                </TouchableOpacity>
              </ImageBackground>
            </LinearGradient>
          </ShadowView>
        </View>

        <View style={{ flex: 1, padding: 15 }}>
          <View style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            width: width - 30,
            height: 50,
            borderRadius: 15,
            padding: 5,
            backgroundColor: theme.lightGreenTranslucent,
            position: 'relative',
            marginBottom: 15
          }}>
            <Animated.View
              style={[{
                width: (width - 30) / 2,
                borderRadius: 15,
                height: '100%',
                backgroundColor: 'rgb(230, 230, 230)',
                position: 'absolute',
              }, animatedListHeadStyle]}
            />
            <Pressable style={{
              width: (width - 30) / 2,
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
              onPress={moveToPassed}>
              <Text>Passées</Text>
            </Pressable>

            <Pressable style={{
              width: (width - 30) / 2,
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center'
            }}
              onPress={moveToUpcoming}>
              <Text>A venir</Text>
            </Pressable>
          </View>

          {/* Réservations list */}
          <View style={{ flex: 1 }}>
            {combinedReservations.map((reservation, index) => {
              return <ReservationRow
                key={index}
                pastData={reservation.pastData}
                upcomingData={reservation.upcomingData}
                index={index}
                animateTo={animateTo}
                theme={theme}
                onReservationPress={navigateToReservationDetails}
              />
            })}
          </View>
        </View>

      </View>


      <Modal visible={loading} transparent>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, .5)' }}>
          <LottieView
            autoPlay
            style={{ height: 100, width: 100 }}
            loop
            source={require('../assets/lotties/loading-2.json')}
          />
        </View>
      </Modal>
    </View>
  );
};

export default ReservationsListScreen;
