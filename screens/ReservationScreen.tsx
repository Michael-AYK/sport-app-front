import React, { useEffect, useState, useRef, useMemo } from 'react';
import { View, Text, Image, Pressable, Share, StyleSheet, ImageBackground, Dimensions, ActivityIndicator, Modal, FlatList, Linking, TouchableOpacity, InteractionManager } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { WebView } from 'react-native-webview';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Carousel from 'react-native-reanimated-carousel';
import MapView, { Marker } from 'react-native-maps';

import Collapsible from 'react-native-collapsible';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector, useDispatch } from 'react-redux';
import LottieView from "lottie-react-native";

import GoogleSignInModal from '../components/GoogleSignInModal';
import lightTheme from '../themes/lightTheme';
import darkTheme from '../themes/darkTheme';
import { finaleStoreSuccessBooking, getAvailableCenters, processPaymentForBooking } from '../services/reservation';
import { getAllClientsExceptCurrent } from '../services/user';
import ParticipantsModal from '../components/ParticipantsModal';
import { baseUrlPublic } from '../services/baseUrl';
import * as Location from 'expo-location';
import RenderSportCenterItem from '../components/RenderSportCenterItem';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from 'react-native-reanimated'
import CalendarSelector from '../components/CalendarSelector';
import { useAppearDisappearAnimation } from '../animations/useAppearDisappearAnimation';
import SkeletonView from '../components/SkeletonView';
import BookingRecapModal from '../components/BookingRecapModal';
import CheckoutModal from '../components/CheckoutModal';
import TimeSlotSelector from '../components/TimeSlotSelector';
import SuccessModal from '../components/SuccessModal';
import SportCenterModal from '../components/SportCenterModal';
const { width, height } = Dimensions.get("window");


function getAllHoursBetween(startHour: any, endHour: any) {
  const hours = [];
  let currentDate = new Date(`2023-01-01T${startHour}:00`);
  const endDate = new Date(`2023-01-01T${endHour}:00`);
  const now = new Date(); // Obtenir l'heure actuelle

  while (currentDate <= endDate) {
    const hourString = currentDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', hour12: false });

    // Création d'une date avec l'année, le mois et le jour actuels pour la comparaison
    const currentHourDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), currentDate.getHours(), currentDate.getMinutes());

    const hourData = {
      hour: hourString,
      status: currentHourDate < now ? "Indisponible" : "Actuellement disponible"
    };

    hours.push(hourData);

    const interval = currentDate.getHours() >= 17 ? 30 : 60;
    currentDate = new Date(currentDate.getTime() + interval * 60000);
  }

  return hours.map(hour => ({ ...hour, isSelected: false }));
}

export default function ReservationScreen(props: any) {
  const mode = useSelector((state: any) => state.theme);
  const theme = mode === 'light' ? lightTheme : darkTheme;

  const { activity } = props.route.params
  const { animatedStyle, animateIn, animateOut } = useAppearDisappearAnimation();

  const [isScreenReady, setIsScreenReady] = useState(false)
  const [displayGooglebtn, setDisplayGooglebtn] = useState(false)
  const [displayBookingRecapModal, setDisplayBookingRecapModal] = useState(false)
  const [displayCheckoutModal, setDisplayCheckoutModal] = useState(false)
  const [selectedTime, setSelectedTime] = useState(null);
  const [paymentUrl, setPaymentUrl] = useState('')
  const [totalAmount, setTotalAmount] = useState(0);
  const [spinner, setSpinner] = useState(false)
  const [user, setUser] = useState<any>();
  const [displaySuccessModal, setDisplaySuccessModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(activity)
  const [availableUsers, setAvailableUsers] = useState<any>([]);
  const [participants, setParticipants] = useState([]);
  const [displayParticipantsModal, setDisplayParticipantsModal] = useState(false)
  const timeSlots = generateTimeSlots("08:00", "23:59");
  const [availableCenters, setAvailableCenters] = useState<any>(undefined);
  const scrollX = useSharedValue(0);
  const [sportCenterModal, setSportCenterModal] = useState(false);
  const [selectedSportCenter, setSelectedSportCenter] = useState<any>(undefined)
  const [selectedDuration, setSelectedDuration] = useState(60)
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [centersLoading, setCentersLoading] = useState(false);
  const timeSlotScrollViewRef = useRef<ScrollView>(null);
  const centersForCurrentActivityRef = useRef<[]>([]);

  const durations = [60, 90, 120];

  const webviewRef = useRef<WebView>(null)
  const currentCenterImageUrl = baseUrlPublic + selectedSportCenter?.photo_couverture.replace("public", "storage");
  const currentCenterDistanceArrondie = selectedSportCenter?.distance ? selectedSportCenter?.distance.toFixed(2) : "N/A";
  let tarif: any;
  switch (selectedDuration) {
    case 60:
      tarif = selectedSportCenter?.tarif_60_min;
      break;
    case 90:
      tarif = selectedSportCenter?.tarif_90_min;
      break;
    case 120:
      tarif = selectedSportCenter?.tarif_120_min;
      break;
    default:
      tarif = "N/A";
  }


  const incrementDuration = () => {
    const currentIndex = durations.indexOf(selectedDuration);
    const nextIndex = (currentIndex + 1) % durations.length;
    setSelectedDuration(durations[nextIndex]);
  };

  const decrementDuration = () => {
    const currentIndex = durations.indexOf(selectedDuration);
    const prevIndex = (currentIndex - 1 + durations.length) % durations.length;
    setSelectedDuration(durations[prevIndex]);
  };

  const updateParticipants = (newParticipants: any) => {
    setParticipants(newParticipants);
  };

  function generateTimeSlots(startTime: string, endTime: string): string[] {
    const result: string[] = [];
    const current = new Date(`2021-01-01T${startTime}`);
    const end = new Date(`2021-01-01T${endTime}`);

    const numberOfSlots = Math.ceil((end.getTime() - current.getTime()) / (30 * 60 * 1000));
    result.length = numberOfSlots;

    for (let i = 0; i < numberOfSlots; i++) {
      result[i] = current.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
      current.setMinutes(current.getMinutes() + 30);
    }

    if (endTime === "23:59") {
      result.push("23:59");
    }

    return result;
  }


  const handleTimeSelect = (time: any) => {
    try {
      const index = timeSlots.indexOf(time);
      const desiredPosition = index * 95;
      timeSlotScrollViewRef?.current?.scrollTo({ x: desiredPosition, y: 0, animated: true });

      setSelectedTime(time);

      fetchAvailableCenters(time);

    } catch (error) {
      console.error("Error while selecting time:", error);
    }
  };


  const fetchAvailableCenters = async (time?: any) => {
    setSpinner(true);
    setCentersLoading(true);
    const filteredCenters = centersForCurrentActivityRef?.current?.filter((centre: any) => {
      const reservationsForSelectedDate = centre.reservations[selectedDate?.toLocaleDateString()] || [];
      if (reservationsForSelectedDate.length === 0) {
        return true;
      }
      return reservationsForSelectedDate.every((reservation: any) => {
        const reservationStartTime = new Date(`2024-01-01T${reservation.heure_debut}`).getTime();
        const reservationEndTime = new Date(`2024-01-01T${reservation.heure_fin}`).getTime();
        const selectedTime = new Date(`2024-01-01T${time}`).getTime();
        const selectedReservationEndTime = selectedTime + selectedDuration * 60 * 1000;
        return !(selectedReservationEndTime > reservationStartTime && selectedTime < reservationEndTime);
      });
    });
    setAvailableCenters(filteredCenters);
    setSpinner(false);
    setCentersLoading(false);
  };


  useEffect(() => {
    onLoad()
  }, [])

  async function onLoad() {
    try {
      console.log("ONLOAD START !");

      // Load centers for activity and get current time concurrently
      const [centers, currentTime] = await Promise.all([
        loadCentersForActivity(),
        getRoundedCurrentTime(),
      ]);

      // Handle time selection
      handleTimeSelect(currentTime);

      // Retrieve user info from AsyncStorage
      const userStr = await AsyncStorage.getItem("userInfo");
      if (userStr) {
        const { user } = JSON.parse(userStr);
        setUser(user);

        // Fetch available users concurrently
        const foundedAvailableUsers = await getAllClientsExceptCurrent(user.email);
        setAvailableUsers(foundedAvailableUsers);
      }
    } catch (error) {
      console.error("Error while loading data:", error);
    }
  }

  async function loadCentersForActivity() {
    setCentersLoading(true);
    try {
      const centersWithReservationsStr = await AsyncStorage.getItem('centersWithReservations');
      const centersWithReservations = JSON.parse(centersWithReservationsStr || '');
      const centers = centersWithReservations.filter((centre: any) => {
        return centre.activites.some((act: any) => act.nom === activity)
      });
      centersForCurrentActivityRef.current = centers;
    } catch (error) {
      console.error("Error while loading centers:", error);
    } finally {
      setIsScreenReady(true);
      setCentersLoading(false);
    }
  }

  function getRoundedCurrentTime(): string {
    const now = new Date();
    const minutes = now.getMinutes();
    const roundedMinutes = Math.floor(minutes / 30) * 30;
    now.setMinutes(roundedMinutes, 0, 0);
    const hours = now.getHours().toString().padStart(2, '0');
    const mins = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${mins}`;
  }

  async function handleDateChange(date: Date) {
    setSpinner(true);
    console.log(spinner)
    setCentersLoading(true);
    setSelectedDate(date)
    if (selectedTime) {
      fetchAvailableCenters(selectedTime);
    }
  }

  function onBookNowPress() {
    if (user !== null && user !== undefined) {
      setDisplayBookingRecapModal(true)
    } else {
      setDisplayGooglebtn(true)
    }
  }

  function onBookCenterPress(amount: number, center_id: number) {
    setSportCenterModal(false);
    if (user !== null && user !== undefined) {
      setDisplayParticipantsModal(true)
      setTotalAmount(amount)
      const terr = availableCenters.filter((item: any, index: number) => item.id === center_id)[0];
      setSelectedSportCenter(terr);
    } else {
      setDisplayGooglebtn(true)
    }
  }

  async function onConfirmPress() {
    setDisplayBookingRecapModal(false)
    setSpinner(true)
    const response = await processPaymentForBooking(user.givenName, user.familyName, user.email, totalAmount);
    setPaymentUrl(response.url);
    setSpinner(false)
    setDisplayCheckoutModal(true);
  }

  async function onBookingPaymentSuccess(transactionId: number, transactionStatus: string) {
    const response = await finaleStoreSuccessBooking(user.email, participants, selectedSportCenter?.id, selectedDate?.toLocaleDateString(), selectedTime, selectedDuration, transactionId, transactionStatus, totalAmount, activity)
    console.log(response);
    setDisplaySuccessModal(true);
    animateIn();
  }

  const handleCloseSuccessModal = () => {
    animateOut(() => {
      // Après l'animation, utilisez navigate pour retourner à HomeScreen avec des paramètres
      runOnJS(props.navigation.navigate)('HomeTab', { fromReservationScreen: true });
    });
  };


  function getURLParameters(url: string) {
    const params: any = {};
    const queryString = url.split('?')[1];
    if (queryString) {
      queryString.split('&').forEach((paramString) => {
        const [key, value] = paramString.split('=');
        params[key] = value;
      });
    }
    return params;
  }

  const handleWebViewNavigationStateChange = ({ nativeEvent }: any) => {
    const { url } = nativeEvent;

    console.log("Callback => " + url);

    if (!url.toString().includes("shouldReturnToSuccess")) {
      return;
    }

    const params = getURLParameters(url);
    const transactionStatus = params?.status;
    const transactionId = params?.id;

    console.log('transactionId => ' + transactionId);
    if (transactionStatus !== 'approved') {
      console.log("L'opération a échoué", '', 'error');
    }

    webviewRef?.current?.stopLoading();
    onBookingPaymentSuccess(transactionId, transactionStatus);
    setDisplayCheckoutModal(false)
  }

  function renderActivityIndicator() {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <LottieView
        autoPlay
        style={{ height: 100, width: 100 }}
        loop
        source={require('../assets/lotties/loading-a.json')}
      />
    </View>
  }



  function renderTimeIntervalleAndFilter() {

    return <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'space-between', padding: 10, marginTop: 15 }}>
      <Pressable style={{ backgroundColor: 'rgb(230, 230, 235)', height: 50, position: 'relative', width: '45%', borderRadius: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ backgroundColor: 'rgb(215, 215, 218)', height: 50, justifyContent: 'center', alignItems: 'center', position: 'absolute', left: 0, borderRadius: 7 }}>
          <MaterialIcons name="filter-list" size={20} color={theme.primaryTextLight} style={{ padding: 10 }} />
        </View>
        <Text style={{ color: theme.primaryText }}> {selectedActivity} </Text>
      </Pressable>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '45%', borderWidth: 1, borderColor: 'rgb(215, 215, 218)', borderRadius: 10 }}>
        <AntDesign name="left" onPress={() => decrementDuration()} size={13} style={{ padding: 10, paddingVertical: 15, height: 50, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgb(215, 215, 218)', borderRadius: 10 }} color={theme.primaryTextLight} />
        <Text style={{ color: theme.primaryText }}> {selectedDuration} min </Text>
        <AntDesign name="right" onPress={() => incrementDuration()} size={13} style={{ padding: 10, paddingVertical: 15, height: 50, backgroundColor: 'rgb(215, 215, 218)', borderRadius: 10 }} color={theme.primaryTextLight} />
      </View>
    </View>
  }


  const onItemPress = (item: any, index: number, itemRef: any) => {
    // setAnimationProps({ x: pageX, y: pageY, width, height });
    setSportCenterModal(true);
    setSelectedSportCenter(item);
    // itemRef.current.measure((x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
    // });
  };

  const handlePhoneCall = () => {
    const phoneNumber = `tel:${selectedSportCenter?.telephone}`;
    Linking.canOpenURL(phoneNumber)
      .then(supported => {
        if (supported) {
          Linking.openURL(phoneNumber);
        } else {
          console.log("Impossible de passer un appel");
        }
      });
  };

  const updateSpinnerValue = async (value: boolean) => {
    setSpinner(value)
  }


  // Fonction pour partager l'emplacement
  const shareLocation = async () => {
    const shareLocationUrl = `https://www.google.com/maps/search/?api=1&query=${selectedSportCenter?.latitude},${selectedSportCenter?.longitude}`;
    const message = `Découvrez ${selectedSportCenter?.nom} situé à ${selectedSportCenter?.adresse}. Voici le lien pour voir l'emplacement sur Google Maps: ${shareLocationUrl}`;
    try {
      await Share.share({
        message,
        // Vous pouvez optionnellement ajouter un titre pour l'email
        title: 'Découvrez ce lieu sur Google Maps',
        // Pour un partage spécifique vers WhatsApp, vous auriez à utiliser une URL deep link spécifique à WhatsApp.
        // Cela est plus complexe et nécessite de savoir si l'utilisateur a WhatsApp installé.
      });
    } catch (error) {
      console.error('Erreur lors du partage', error);
    }
  };
  const centerModalAnimatedStyles = useAnimatedStyle(() => {
    return {
      width: sportCenterModal ? withTiming(width * .95) : width * .8,
      height: sportCenterModal ? withTiming(height * .85) : height * .5,
    };
  });

  function renderSportCenters() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Carousel
          width={width}
          height={400}
          data={availableCenters}
          mode="parallax"
          modeConfig={{
            parallaxScrollingScale: 0.9,
            parallaxScrollingOffset: 50,
          }}
          // style={{ padding: 10 }}
          renderItem={({ item, index }) => (
            <RenderSportCenterItem onItemPress={onItemPress} item={item} index={index} onBookCenterPress={(item: any, tarif: any, id: number) => {
              setSelectedSportCenter(item);
              onBookCenterPress(tarif, id)
            }} scrollX={scrollX} theme={theme} duree={selectedDuration} />
          )}
          onProgressChange={(progress, absoluteProgress) => {
            scrollX.value = absoluteProgress * width;
          }}
          autoPlay={false}
        />
      </View>
    );
  }


  function renderActivityIndicatorModal() {
    return <Modal transparent visible={spinner}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, .6)' }}>
        <LottieView
          autoPlay
          style={{ height: 100, width: 100 }}
          loop
          source={require('../assets/lotties/loading-2.json')}
        />
      </View>
    </Modal>
  }

  
  return (
    <View style={{ flex: 1, backgroundColor: theme.primaryBackground }}>
      {isScreenReady ? (
        <>
          <CalendarSelector
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
            updateParentLoading={updateSpinnerValue}
            theme={theme}
          />
          {renderTimeIntervalleAndFilter()}
          <TimeSlotSelector
            timeSlots={timeSlots}
            selectedTime={selectedTime}
            handleTimeSelect={handleTimeSelect}
            theme={theme}
          />
          {
            centersLoading ?
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <SkeletonView height={220} width={width * .9} />
                <SkeletonView height={60} width={width * .9} />
              </View> :
              renderSportCenters()
          }
          <GoogleSignInModal
            isVisible={displayGooglebtn}
            onClose={() => {
              setDisplayGooglebtn(false)
              onBookCenterPress(tarif, selectedSportCenter?.id)
            }}
          />
          <BookingRecapModal
            displayBookingRecapModal={displayBookingRecapModal}
            setDisplayBookingRecapModal={setDisplayBookingRecapModal}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            activity={activity}
            selectedSportCenter={selectedSportCenter}
            totalAmount={totalAmount}
            theme={theme}
            onConfirmPress={onConfirmPress}
          />

          <CheckoutModal
            displayCheckoutModal={displayCheckoutModal}
            setDisplayCheckoutModal={setDisplayCheckoutModal}
            paymentUrl={paymentUrl}
            webviewRef={webviewRef}
            handleWebViewNavigationStateChange={handleWebViewNavigationStateChange}
          />
        </>
      ) : renderActivityIndicator()}
      {renderActivityIndicatorModal()}
      {
        displayParticipantsModal && <ParticipantsModal
          visible={displayParticipantsModal}
          user={user}
          availableUsers={availableUsers}
          onClose={() => setDisplayParticipantsModal(false)}
          onUpdateParticipants={updateParticipants}
          onNextPress={() => setDisplayBookingRecapModal(true)}
          theme={theme}
        />
      }
      <SuccessModal
        displaySuccessModal={displaySuccessModal}
        handleCloseSuccessModal={handleCloseSuccessModal}
        theme={theme}
      />

      <SportCenterModal
        sportCenterModal={sportCenterModal}
        setSportCenterModal={setSportCenterModal}
        currentCenterImageUrl={currentCenterImageUrl}
        selectedSportCenter={selectedSportCenter}
        tarif={tarif}
        currentCenterDistanceArrondie={currentCenterDistanceArrondie}
        theme={theme}
        handlePhoneCall={handlePhoneCall}
        shareLocation={shareLocation}
        onBookCenterPress={onBookCenterPress}
        height={height}
      />

    </View>
  )
}

