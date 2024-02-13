import React, { useEffect, useState, useRef, useMemo } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions, ActivityIndicator, Modal, FlatList } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { WebView } from 'react-native-webview';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import CalendarPicker from 'react-native-calendar-picker';
import Carousel from 'react-native-reanimated-carousel';

import Collapsible from 'react-native-collapsible';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector, useDispatch } from 'react-redux';
import LottieView from "lottie-react-native";

import GoogleSignInModal from '../components/GoogleSignInModal';
import lightTheme from '../themes/lightTheme';
import darkTheme from '../themes/darkTheme';
import { finaleStoreSuccessBooking, getAvailableCenters, getAvailableTerrains, storeBooking } from '../services/reservation';
import { getAllClientsExceptCurrent } from '../services/user';
import ParticipantsModal from '../components/ParticipantsModal';
import { baseUrlPublic } from '../services/baseUrl';
import * as Location from 'expo-location';
import RenderSportCenterItem from '../components/RenderSportCenterItem';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, interpolate, Extrapolate } from 'react-native-reanimated'
const WEEK_DAYS = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const MONTHS = ["Jan", "Fev", "Mar", "Avr", "Mai", "Jui", "Jui", "Aoû", "Sep", "Oct", "Nov", "Déc"];
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
  const minDate: Date = new Date();
  const [selectedDateDatas, setSelectedDateDatas] = useState<any>(null);
  const [displayCalendar, setdisplayCalendar] = useState(false)
  const [availableHours, setAvailableHours] = useState<Array<any>>([])
  const [isScreenReady, setIsScreenReady] = useState(false)
  const [displayGooglebtn, setDisplayGooglebtn] = useState(false)
  const [displayBookingRecapModal, setDisplayBookingRecapModal] = useState(false)
  const [displayCheckoutModal, setDisplayCheckoutModal] = useState(false)
  const [selectedCourt, setSelectedCourt] = useState<any>(null)
  const [selectedTime, setSelectedTime] = useState(null);
  const [paymentUrl, setPaymentUrl] = useState('')
  const [totalAmount, setTotalAmount] = useState(0);
  const [spinner, setSpinner] = useState(false)
  const [user, setUser] = useState<any>();
  const [displaySuccessModal, setDisplaySuccessModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(activity)
  const [availableTerrains, setAvailableTerrains] = useState<any>(undefined);
  const [availableUsers, setAvailableUsers] = useState<any>([]);
  const [participants, setParticipants] = useState([]);
  const [displayParticipantsModal, setDisplayParticipantsModal] = useState(false)
  const firstTimeInterval = getCurrentTimeInterval();
  const [timeInterval, setTimeInterval] = useState(firstTimeInterval);
  const timeSlots = generateTimeSlots("08:00", "23:59");
  const [availableCenters, setAvailableCenters] = useState<any>(undefined);
  const scrollX = useSharedValue(0);
  const [animationProps, setAnimationProps] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [sportCenterModal, setSportCenterModal] = useState(false);
  const [selectedSportCenter, setSelectedSportCenter] = useState<any>(undefined)
  const [selectedDuration, setSelectedDuration] = useState(60)

  const durations = [60, 90, 120];

  const webviewRef = useRef<WebView>(null)

  const styles = StyleSheet.create({
    timeSlot: {
      marginHorizontal: 10,
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderRadius: 10,
    },
    selectedTimeSlot: {
      backgroundColor: theme.primaryBackground,
    },
    timeText: {
      color: theme.primaryBackground,
      fontWeight: '800'
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
    },
  });


  const intervals = [
    { startTime: "08:00", endTime: "12:00" },
    { startTime: "12:00", endTime: "16:00" },
    { startTime: "16:00", endTime: "20:00" },
    { startTime: "20:00", endTime: "23:59" },
  ];

  function incrementInterval() {
    const currentIndex = intervals.findIndex(interval => interval.startTime === timeInterval.startTime);
    const result = intervals[(currentIndex + 1) % intervals.length];
    console.log(result);
    setTimeInterval(result)
    handleTimeSelect(result.startTime)
  }
  function decrementInterval() {
    const currentIndex = intervals.findIndex(interval => interval.startTime === timeInterval.startTime);
    const result = intervals[(currentIndex - 1 + intervals.length) % intervals.length];
    console.log(result);
    setTimeInterval(result);
    handleTimeSelect(result.startTime)
  }

  const incrementDuration = () => {
    // Trouvez l'index de la durée actuelle
    const currentIndex = durations.indexOf(selectedDuration);
    // Incrémentez l'index, si c'est le dernier, revenez au premier
    const nextIndex = (currentIndex + 1) % durations.length;
    setSelectedDuration(durations[nextIndex]);
  };

  const decrementDuration = () => {
    // Trouvez l'index de la durée actuelle
    const currentIndex = durations.indexOf(selectedDuration);
    // Décrémentez l'index, si c'est le premier, allez au dernier
    const prevIndex = (currentIndex - 1 + durations.length) % durations.length;
    setSelectedDuration(durations[prevIndex]);
  };

  const updateParticipants = (newParticipants: any) => {
    setParticipants(newParticipants);
  };

  function generateTimeSlots(startTime: any, endTime: any) {
    let result = [];
    let current = new Date(`2021-01-01T${startTime}`);
    const end = new Date(`2021-01-01T${endTime}`);

    while (current < end) {
      result.push(current.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }));
      current = new Date(current.getTime() + 30 * 60000);
    }

    // Pour inclure 00:00 dans l'intervalle de 20:00 à 00:00
    if (endTime === "23:59") {
      result.push("23:59");
    }

    return result;
  }

  const handleTimeSelect = (time: any) => {
    setSelectedTime(time);
    // fetchAvailableTerrains(time);
    console.log("TIME SELECTED");

    fetchAvailableCenters(time)
  };

  const fetchAvailableCenters = async (time?: any) => {
    // Demander la permission d'accès à la localisation
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return;
    }

    // Récupérer la localisation actuelle
    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    const foundedCenters = await getAvailableCenters(time || selectedTime, selectedDateDatas.fullDate, selectedDuration, activity, latitude, longitude)
    setAvailableCenters(foundedCenters);
  }

  const customDayHeaderStylesCallback = ({ dayOfWeek, month, year }: any) => {
    return {
      textStyle: {
        color: theme.primaryTextLight,
        fontSize: 13,
        fontWeight: '300'
      }
    };
  };

  useEffect(() => {
    const data = getWeekData(new Date())

    setSelectedDateDatas(data)
    const hours_list = getAllHoursBetween("08:00", "20:00")
    onLoad()
    setIsScreenReady(true)
    setAvailableHours(hours_list)
    // console.log(props.navigation)
    props?.navigation?.setOptions({
      headerTitle: () => <Text numberOfLines={1} style={{ fontSize: 15, fontWeight: '700', maxWidth: width * .6, color: theme.primaryText }}>Faire une réservation</Text>,
      headerTintColor: theme.primaryText
    })
  }, [])

  async function onLoad() {
    const userStr = await AsyncStorage.getItem("userInfo")
    if (userStr) {
      const { user } = JSON.parse(userStr)
      setUser(user)
      const foundedAvailableUsers = await getAllClientsExceptCurrent(user.email);
      setAvailableUsers(foundedAvailableUsers);
    }
  }

  function handleDateChange(date: any) {
    const data = getWeekData(new Date(date))
    setSelectedDateDatas(data)
    setdisplayCalendar(false)
  }

  function onBookNowPress() {
    if (user !== null && user !== undefined) {
      setDisplayBookingRecapModal(true)
    } else {
      setDisplayGooglebtn(true)
    }
  }

  function onTerrainChooseForBooking(amount: number, terrain_id: number) {
    if (user !== null && user !== undefined) {
      setDisplayParticipantsModal(true)
      setTotalAmount(amount)
      const terr = availableTerrains.filter((item: any, index: number) => item.id === terrain_id)[0];
      setSelectedCourt(terr);
    } else {
      setDisplayGooglebtn(true)
    }
  }

  async function onConfirmPress() {
    setDisplayBookingRecapModal(false)
    setSpinner(true)
    const response = await storeBooking(user.givenName, user.familyName, user.email, totalAmount);
    setPaymentUrl(response.url);
    setSpinner(false)
    setDisplayCheckoutModal(true);
  }

  async function onBookingPaymentSuccess(transactionId: number, transactionStatus: string) {
    const hours = availableHours.filter((item: any, index: number) => item.isSelected)
    const response = await finaleStoreSuccessBooking(user.email, participants, selectedCourt.id, selectedDateDatas.fullDate, selectedTime, transactionId, transactionStatus, totalAmount, activity)
    console.log(response);
    setDisplaySuccessModal(true);
  }

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

    if (!url.toString().includes(baseUrlPublic)) {
      return;
    }

    const params = getURLParameters(url);
    const transactionStatus = params.status;
    const transactionId = params.id;

    console.log('transactionId => ' + transactionId);
    if (transactionStatus !== 'approved') {
      console.log("L'opération a échoué", '', 'error');
    }

    webviewRef?.current?.stopLoading();
    onBookingPaymentSuccess(transactionId, transactionStatus);
    setDisplayCheckoutModal(false)
  }


  function getWeekData(inputDate: Date) {
    const date = new Date(inputDate);
    const dayOfWeek = date.getUTCDay();
    const mondayDate = new Date(date);
    mondayDate.setUTCDate(date.getUTCDate() - dayOfWeek);
    const weekDates = [mondayDate];

    for (let i = 1; i < 7; i++) {
      const nextDate = new Date(mondayDate);
      nextDate.setUTCDate(mondayDate.getUTCDate() + i);

      if (nextDate.getUTCMonth() === date.getUTCMonth()) {
        weekDates.push(nextDate);
      }
    }

    const dateDay = date.getDate();
    const dateMonth = date.getUTCMonth() + 1; // Ajoutez 1 pour obtenir un index de mois correct
    const dateYear = date.getUTCFullYear();
    const monthName = MONTHS[dateMonth - 1]; // Utilisez dateMonth - 1 pour obtenir le nom correct du mois

    return { dateDay, weekDates, monthName, dateYear, dateMonth, fullDate: date.toLocaleDateString() };
  }


  const availableHoursRef = useRef(availableHours);
  availableHoursRef.current = availableHours; // Garder une référence actuelle

  function calculateAmount(hour: any) {
    return hour >= '08:00' && hour < '17:00' ? 5000 : 5000;
  }

  useEffect(() => {
    const newTotalAmount = Array.from(availableHours.values()).reduce((sum: number, hour: any) => {
      return hour.isSelected ? sum + calculateAmount(hour.hour) : sum;
    }, 0);

    setTotalAmount(newTotalAmount);
  }, [availableHours]);


  function getCurrentTimeInterval() {
    const now = new Date();
    const currentHour = now.getHours();

    if (currentHour >= 8 && currentHour < 12) {
      return { startTime: "08:00", endTime: "12:00" };
    } else if (currentHour >= 12 && currentHour < 16) {
      return { startTime: "12:00", endTime: "16:00" };
    } else if (currentHour >= 16 && currentHour < 20) {
      return { startTime: "16:00", endTime: "20:00" };
    } else {
      return { startTime: "20:00", endTime: "23:59" };
    }
  }


  function renderActivityIndicator() {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="small" color={theme.primary} />
    </View>
  }

  function renderDateSelector() {
    return <View style={{ position: 'relative', minHeight: 130 }}>

      <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', marginBottom: 15, position: 'relative', top: 0, left: 0, right: 0 }}>
        {/* <Text style={{ fontSize: 18, fontWeight: '900', marginBottom: 10, textAlign: 'center', color: theme.primaryTextLight }}>{selectedDateDatas?.monthName} {selectedDateDatas?.dateYear} </Text> */}
        <View style={{ flexDirection: 'row', paddingHorizontal: 10, alignItems: 'center', width: '85%' }}>
          {
            Array.from({ length: 5 }, (_, i) => i).map((d, i) => {
              return <TouchableOpacity
                onPress={() => {
                  // handleDateChange(selectedDateDatas?.weekDates[i]?.toLocaleDateString())
                }}
                key={i} style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical: 5,
                  paddingHorizontal: 15,
                  borderRadius: 10,
                  borderColor: '#888',
                  marginHorizontal: 2,
                  backgroundColor: selectedDateDatas?.weekDates[i]?.getUTCDate() === selectedDateDatas?.dateDay ? theme.primary : theme.primaryBackground,
                  opacity: selectedDateDatas?.weekDates[i]?.getUTCDate() ? 1 : 0
                }}>
                <Text style={{ color: selectedDateDatas?.weekDates[i]?.getUTCDate() === selectedDateDatas?.dateDay ? "#fff" : theme.primaryText, fontSize: 10, fontWeight: '300' }}>{WEEK_DAYS[i]} </Text>
                <Text style={{ fontSize: 16, fontWeight: '800', color: selectedDateDatas?.weekDates[i]?.getUTCDate() === selectedDateDatas?.dateDay ? "#fff" : theme.primaryTextLight }}>{selectedDateDatas?.weekDates[i]?.getUTCDate()} </Text>
                <Text style={{ fontSize: 10, color: theme.primaryTextLight }}>{selectedDateDatas?.monthName} </Text>
              </TouchableOpacity>
            })
          }
        </View>

        <TouchableOpacity style={{ flex: 1, marginRight: 10 }} onPress={() => setdisplayCalendar(!displayCalendar)}>
          <AntDesign name="calendar" size={20} color={theme.primaryText} style={{ padding: 10 }} />
        </TouchableOpacity>
      </View>

      <View style={{ position: 'relative', top: 0, right: 0, left: 0, }}>
        <Collapsible collapsed={!displayCalendar}>
          <CalendarPicker
            onDateChange={handleDateChange}
            weekdays={WEEK_DAYS}
            months={MONTHS}
            minDate={minDate}
            restrictMonthNavigation
            dayLabelsWrapper={{ borderTopWidth: 0, borderBottomWidth: 0, paddingBottom: 0 }}
            customDayHeaderStyles={customDayHeaderStylesCallback}
            previousComponent={<AntDesign name="left" size={20} color={theme.primaryText} />}
            nextComponent={<AntDesign name="right" size={20} color={theme.primaryText} />}
            monthTitleStyle={{ fontSize: 15, color: theme.primaryTextLight, fontWeight: "500" }}
            yearTitleStyle={{ fontSize: 15, color: theme.primaryTextLight, fontWeight: "500" }}
            selectedDayStyle={{ backgroundColor: theme.primaryLight }}
            textStyle={{ color: theme.primaryText }}
          />
        </Collapsible>
      </View>
    </View>

  }

  function renderTimeIntervalleAndFilter() {

    return <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'space-between', padding: 10 }}>
      <TouchableOpacity style={{ backgroundColor: 'rgb(230, 230, 235)', height: 50, position: 'relative', width: '45%', borderRadius: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ backgroundColor: 'rgb(215, 215, 218)', height: 50, justifyContent: 'center', alignItems: 'center', position: 'absolute', left: 0, borderRadius: 7 }}>
          <MaterialIcons name="filter-list" size={20} color={theme.primary} style={{ padding: 10 }} />
        </View>
        <Text style={{ color: theme.primaryText }}> {selectedActivity} </Text>
      </TouchableOpacity>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '45%', borderWidth: 1, borderColor: 'rgb(215, 215, 218)', borderRadius: 10 }}>
        <AntDesign name="left" onPress={() => decrementDuration()} size={13} style={{ padding: 10, paddingVertical: 15, height: 50, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgb(215, 215, 218)', borderRadius: 10 }} color={theme.primary} />
        <Text style={{ color: theme.primaryText }}> {selectedDuration} min </Text>
        <AntDesign name="right" onPress={() => incrementDuration()} size={13} style={{ padding: 10, paddingVertical: 15, height: 50, backgroundColor: 'rgb(215, 215, 218)', borderRadius: 10 }} color={theme.primary} />
      </View>
    </View>
  }

  function renderTerrains() {
    return <View style={{ flex: 1 }}>
      <FlatList
        data={availableTerrains}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
          return <View style={{ padding: 10, borderBottomWidth: 2, borderColor: '#ccc', marginBottom: 15 }}>
            <Text style={{ fontSize: 18, fontWeight: '900', color: theme.primaryText }} numberOfLines={1}>{item.nom} </Text>
            <Text style={{ fontSize: 13, color: theme.primaryTextLight }}>{item.adresse} </Text>

            <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginTop: 10 }}>
              <View>
                <Text style={{ fontSize: 13, color: theme.primaryText, marginBottom: 5 }}>Début</Text>
                <Text style={{ fontSize: 18, color: theme.primaryText, fontWeight: '500' }}>{selectedTime}</Text>
              </View>

              <View style={{ flex: 1, padding: 10 }}>
                <TouchableOpacity onPress={() => onTerrainChooseForBooking(4000, item.id)} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginVertical: 10 }}>
                  <Text style={{ fontSize: 15, marginHorizontal: 5, color: theme.primaryText }}>60 min</Text>
                  <Text style={{ fontSize: 14, marginHorizontal: 5, color: theme.primaryTextLight }}>A partir de </Text>
                  <Text style={{ fontSize: 15, marginHorizontal: 5, color: theme.primary, fontWeight: '500' }}>16000 FCFA</Text>
                  <AntDesign name="right" size={16} style={{ marginLeft: 8 }} color={theme.primaryText} />
                </TouchableOpacity>

                {
                  item.available_for_90_minutes && <TouchableOpacity onPress={() => onTerrainChooseForBooking(20000, item.id)}
                    style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginVertical: 10 }}>
                    <Text style={{ fontSize: 15, marginHorizontal: 5, color: theme.primaryText }}>90 min</Text>
                    <Text style={{ fontSize: 14, marginHorizontal: 5, color: theme.primaryTextLight }}>A partir de </Text>
                    <Text style={{ fontSize: 15, marginHorizontal: 5, color: theme.primary, fontWeight: '500' }}>20000 FCFA</Text>
                    <AntDesign name="right" size={16} style={{ marginLeft: 8 }} color={theme.primaryText} />
                  </TouchableOpacity>
                }

                {
                  item.available_for_120_minutes && <TouchableOpacity onPress={() => onTerrainChooseForBooking(40000, item.id)}
                    style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginVertical: 10 }}>
                    <Text style={{ fontSize: 15, marginHorizontal: 5, color: theme.primaryText }}>120 min</Text>
                    <Text style={{ fontSize: 14, marginHorizontal: 5, color: theme.primaryTextLight }}>A partir de </Text>
                    <Text style={{ fontSize: 15, marginHorizontal: 5, color: theme.primary, fontWeight: '500' }}>40000 FCFA</Text>
                    <AntDesign name="right" size={16} style={{ marginLeft: 8 }} color={theme.primaryText} />
                  </TouchableOpacity>
                }
              </View>
            </View>
          </View>
        }}
      />
    </View>
  }

  const onItemPress = (item: any, index: number, itemRef: any) => {
    // setAnimationProps({ x: pageX, y: pageY, width, height });
    setSportCenterModal(true);
    setSelectedSportCenter(item);
    // itemRef.current.measure((x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
    // });
  };

  const centerModalAnimatedStyles = useAnimatedStyle(() => {
    return {
      width: sportCenterModal ? withTiming(width * .95) : width * .8,
      height: sportCenterModal ? withTiming(height * .7) : height * .5,
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
            <RenderSportCenterItem onItemPress={onItemPress} item={item} index={index} scrollX={scrollX} theme={theme} duree={selectedDuration} />
          )}
          onProgressChange={(progress, absoluteProgress) => {
            // Mettez à jour scrollX ici
            // `progress` est la progression relative qui commence de 0 à 1 à chaque slide
            // `absoluteProgress` est la progression absolue sur tous les éléments
            scrollX.value = absoluteProgress * width; // ou une autre logique selon votre besoin
          }}
          autoPlay={false}
        />
      </View>
    );
  }

  function renderTimeSlots() {
    return <>
      <View style={{ flexDirection: 'row', paddingVertical: 10, alignItems: 'center', justifyContent: 'space-between', }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ backgroundColor: theme.primary, padding: 5 }}>
          {timeSlots.map((time: any, index: number) => (
            <TouchableOpacity
              key={index}
              style={[styles.timeSlot, time === selectedTime && styles.selectedTimeSlot]}
              onPress={() => handleTimeSelect(time)}
            >
              <Text style={[styles.timeText, time === selectedTime && { color: theme.primaryText }]}>{time}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {
        availableHours.findIndex((item: any, index: number) => item.isSelected) !== -1
        && <TouchableOpacity
          onPress={() => onBookNowPress()}
          activeOpacity={.9}
          style={{ position: 'absolute', bottom: 8, elevation: 10, alignSelf: 'center', width: '95%', justifyContent: 'center', alignItems: 'center', borderRadius: 10, paddingVertical: 20, paddingHorizontal: 40, backgroundColor: theme.primary }}>
          <Text style={{ color: '#fff', }}> Réserver maintenant </Text>
        </TouchableOpacity>
      }
    </>
  }

  function renderFilterModal() {

    return (
      <Modal>

      </Modal>
    )
  }



  function renderBookingRecapModal() {
    return <Modal transparent visible={displayBookingRecapModal} onRequestClose={() => setDisplayBookingRecapModal(false)}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, .7)' }}>
        <View style={{ padding: 20, width: '95%', backgroundColor: '#fff', borderRadius: 8 }}>
          <TouchableOpacity onPress={() => setDisplayBookingRecapModal(false)} style={{
            position: 'absolute', // Positionnement en absolu pour le placer en haut à droite
            right: 15,
            top: 10,
            padding: 10, // Facilite le toucher
            zIndex: 1,
          }}>
            <AntDesign name="close" size={24} color="#d22" />
          </TouchableOpacity>
          <Text style={{ fontSize: 20, fontWeight: '700', textAlign: 'center', marginBottom: 25 }}>Récapitulatif</Text>

          <View style={{ marginVertical: 5, width: '100%', paddingVertical: 10, borderBottomWidth: .5, borderColor: theme.primaryTextLighter }}>
            <Text style={{ fontSize: 15, fontWeight: '700', color: theme.primaryTextLight }}>Date</Text>
            <Text style={{ marginTop: 8, fontSize: 16, color: theme.primaryText }}>{`${selectedDateDatas.dateDay}-${selectedDateDatas.monthName}-${selectedDateDatas.dateYear}`}</Text>
          </View>

          <View style={{ marginVertical: 5, width: '100%', paddingVertical: 10, borderBottomWidth: .5, borderColor: theme.primaryTextLighter }}>
            <Text style={{ fontSize: 15, fontWeight: '700', color: theme.primaryTextLight }}>Horaire</Text>
            <Text style={{ marginTop: 8, fontSize: 16, color: theme.primaryText }}>{selectedTime}</Text>
          </View>

          <View style={{ marginVertical: 5, width: '100%', paddingVertical: 10, borderBottomWidth: .5, borderColor: theme.primaryTextLighter }}>
            <Text style={{ fontSize: 15, fontWeight: '700', color: theme.primaryTextLight }}>Activité</Text>
            <Text style={{ marginTop: 8, fontSize: 16, color: theme.primaryText }}>{activity}</Text>
          </View>

          <View style={{ marginVertical: 5, width: '100%', paddingVertical: 10, borderBottomWidth: .5, borderColor: theme.primaryTextLighter }}>
            <Text style={{ fontSize: 15, fontWeight: '700', color: theme.primaryTextLight }}>Lieu</Text>
            <Text style={{ marginTop: 8, fontSize: 16, color: theme.primaryText }}>{selectedCourt?.nom}</Text>
          </View>

          <View style={{ marginVertical: 5, width: '100%', paddingVertical: 10 }}>
            <Text style={{ fontSize: 15, fontWeight: '700', color: theme.primaryTextLight }}>Montant de la réservation</Text>
            <View style={{ padding: 8, backgroundColor: theme.primary + '11', borderRadius: 10, marginTop: 5 }}>
              <Text style={{ fontSize: 20, fontWeight: '900', textAlign: 'center' }}> {totalAmount} XOF </Text>
            </View>
          </View>

          <View style={{ width: '100%', marginTop: 30 }}>
            <TouchableOpacity
              onPress={onConfirmPress}
              activeOpacity={.9}
              style={{ alignSelf: 'center', width: '100%', justifyContent: 'center', alignItems: 'center', borderRadius: 10, paddingVertical: 18, paddingHorizontal: 40, backgroundColor: theme.primary }}>
              <Text style={{ color: '#fff', }}> Confirmer la réservation </Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  }

  function renderCheckoutModal() {
    return <Modal style={{}} transparent visible={displayCheckoutModal} >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, .5)' }}>
        <View style={{ backgroundColor: '#fff', borderRadius: 8, width: '90%', height: 500 }}>
          <TouchableOpacity onPress={() => setDisplayCheckoutModal(false)} style={{
            position: 'absolute', // Positionnement en absolu pour le placer en haut à droite
            right: 5,
            top: 5,
            padding: 15, // Facilite le toucher
            zIndex: 1,
          }}>
            <AntDesign name="close" size={20} color="#d22" />
          </TouchableOpacity>
          {/* <WebView originWhitelist={['*']} source={{ html: checkoutHtmlContent }} />; */}
          <WebView
            ref={webviewRef}
            source={{ uri: paymentUrl }}
            style={{ opacity: .99 }}
            onLoadEnd={handleWebViewNavigationStateChange}
          />
        </View>
      </View>
    </Modal>
  }

  function renderActivityIndicatorModal() {
    return <Modal transparent visible={spinner}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, .6)' }}>
        <ActivityIndicator color={theme.primaryText} size="small" />
      </View>
    </Modal>
  }

  function renderSuccessModal() {
    return <Modal visible={displaySuccessModal}>
      <View style={{ flex: 1, padding: 20, position: 'relative', justifyContent: 'center', alignItems: 'center' }}>
        <LottieView
          autoPlay
          loop={false}
          style={{ height: 200, width: 200 }}
          source={require('../assets/lotties/success-2.json')}
        />

        <Text style={{ fontSize: 25, fontWeight: '800', marginBottom: 20, marginTop: 50 }}>Réservation ajoutée</Text>
        <Text style={{ textAlign: 'center', lineHeight: 20, fontSize: 16 }}>Votre réservation a été enregistrée avec succès ! N'hésitez pas à nous contacter pour toute préoccupation.</Text>


        <View style={{ width: '100%', position: 'absolute', bottom: 50 }}>
          <TouchableOpacity
            onPress={() => props.navigation.goBack()}
            activeOpacity={.9}
            style={{ alignSelf: 'center', width: '100%', justifyContent: 'center', alignItems: 'center', borderRadius: 10, paddingVertical: 18, paddingHorizontal: 40, backgroundColor: theme.primary }}>
            <Text style={{ color: '#fff', }}> Ok, j'ai compris </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  }

  const currentCenterImageUrl = baseUrlPublic + selectedSportCenter?.photo_couverture.replace("public", "storage");
  const currentCenterDistanceArrondie = selectedSportCenter?.distance ? selectedSportCenter?.distance.toFixed(2) : "N/A";
  let tarif;
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
  return (
    <View style={{ flex: 1, backgroundColor: theme.primaryBackground }}>
      {isScreenReady ? (
        <>
          {renderDateSelector()}
          {renderTimeIntervalleAndFilter()}
          {renderTimeSlots()}
          {renderSportCenters()}
          <GoogleSignInModal
            isVisible={displayGooglebtn}
            onClose={() => {/* Logic to handle close */ }}
          />
          {renderBookingRecapModal()}
          {renderCheckoutModal()}
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
        />
      }
      {renderSuccessModal()}

      <Modal transparent visible={sportCenterModal} onRequestClose={() => setSportCenterModal(false)} >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, .5)' }}>
          <Animated.View style={[{
            backgroundColor: 'rgb(240, 240, 240)',
            borderRadius: 8,
            overflow: 'hidden',
          }, centerModalAnimatedStyles]}>
            <TouchableOpacity onPress={() => setSportCenterModal(false)} style={{
              position: 'absolute',
              right: 10,
              top: 10,
              zIndex: 10,
            }}>
              <AntDesign name="close" size={24} color={theme.primaryText} />
            </TouchableOpacity>

            <Image source={{ uri: currentCenterImageUrl }} style={{ width: '100%', height: height * .3 }} />
            <View style={{ padding: 8, flex: 1, position: 'relative' }}>
              <Text style={{ fontSize: 15, fontWeight: 'bold', marginVertical: 10 }}>
                {selectedSportCenter?.nom}
              </Text>
              <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 15, color: theme.primary, fontWeight: '600' }}>{tarif} FCFA </Text>
                <Text style={{ fontSize: 15, color: '#777' }}>A environ {currentCenterDistanceArrondie} km</Text>
              </View>

              <Text style={{ marginTop: 20, marginBottom: 10, fontSize: 15, lineHeight: 25, color: theme.primaryText }}>{selectedSportCenter?.description} </Text>

              <TouchableOpacity style={{
                backgroundColor: theme.primary, 
                padding: 18,
                borderRadius: 8,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 20,
                position: 'absolute',
                bottom: 10,
                width: '100%',
                alignSelf: 'center'
              }}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Réserver maintenant</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  )
}

