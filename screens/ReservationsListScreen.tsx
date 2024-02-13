import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Modal, TouchableOpacity, ImageBackground, Animated, Easing, FlatList, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import CalendarPicker from 'react-native-calendar-picker';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useSelector, useDispatch } from 'react-redux';
import { setTheme } from '../redux/theme';
import { storeTheme } from '../utils/themeStorage';
import lightTheme from '../themes/lightTheme';
import darkTheme from '../themes/darkTheme';
import { getReservationListByUserAndDate } from '../services/reservation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from "lottie-react-native";
import terrains from '../helpers/terrains';

const WEEK_DAYS = [
  "Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"
];
const MONTHS = [
  "Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];



const ReservationsListScreen: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDateDatas, setSelectedDateDatas] = useState<any>(null);
  const [displayReservationsForDay, setDisplayReservationsForDay] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dbUser, setDbUser] = useState<any>(null);
  const [reservationList, setReservationList] = useState([]);
  const calendarOpacity = useRef(new Animated.Value(1)).current;
  const reservationsOpacity = useRef(new Animated.Value(0)).current;
  const calendarTranslateY = useRef(new Animated.Value(0)).current;
  const reservationsTranslateY = useRef(new Animated.Value(-100)).current;
  const mode = useSelector((state: any) => state.theme);
  const theme = mode === 'light' ? lightTheme : darkTheme;

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

  const customDayHeaderStylesCallback = ({ dayOfWeek, month, year }: any) => {
    return {
      textStyle: {
        color: theme.primaryText,
        fontSize: 13,
        fontWeight: '300'
      }
    };
  };

  const handleDateChange = async (date: Date) => {
    setLoading(true)
    console.log(date);
    console.log(new Date(date)?.toLocaleDateString());
    const reservations = await getReservationListByUserAndDate(dbUser?.id || 12, (new Date(date))?.toLocaleDateString());
    console.log(reservations);
    setReservationList(reservations);
    const result = getWeekData(date);
    setSelectedDateDatas(result);

    setSelectedDate(date);

    // Reset the animations before starting
    calendarOpacity.setValue(1);
    reservationsOpacity.setValue(0);
    calendarTranslateY.setValue(0);
    reservationsTranslateY.setValue(100);

    setLoading(false)
    Animated.parallel([
      Animated.timing(calendarOpacity, {
        toValue: 0,
        duration: 400,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(calendarTranslateY, {
        toValue: -100,
        duration: 400,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(reservationsOpacity, {
        toValue: 1,
        duration: 400,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(reservationsTranslateY, {
        toValue: 0,
        duration: 400,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]).start(() => setDisplayReservationsForDay(true));
  };

  const handleReturnClick = () => {
    // Reset the animations before starting
    calendarOpacity.setValue(0);
    reservationsOpacity.setValue(1);
    calendarTranslateY.setValue(-100);
    reservationsTranslateY.setValue(0);

    Animated.parallel([
      Animated.timing(calendarOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(calendarTranslateY, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(reservationsOpacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(reservationsTranslateY, {
        toValue: 100,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => setDisplayReservationsForDay(false));
  };

  function getWeekData(inputDate: Date) {
    const date = new Date(inputDate);
    const dayOfWeek = date.getUTCDay();
    const mondayDate = new Date(date);
    mondayDate.setUTCDate(date.getUTCDate() - dayOfWeek);
    const weekDates = [mondayDate];

    for (let i = 1; i < 7; i++) {
      const nextDate = new Date(mondayDate);
      nextDate.setUTCDate(mondayDate.getUTCDate() + i);

      // Vérifiez si le mois de la date correspond au mois de la date sélectionnée
      if (nextDate.getUTCMonth() === date.getUTCMonth()) {
        weekDates.push(nextDate);
      }
    }

    const dateDay = date.getDate();
    const dateMonth = date.getUTCMonth();
    const dateYear = date.getUTCFullYear();
    const monthName = MONTHS[dateMonth];

    return { dateDay, weekDates, monthName, dateYear };
  }

  useEffect(() => {
    onLoad()
  }, [])

  async function onLoad() {
    setLoading(true);
    const userStr = await AsyncStorage.getItem("dbUser")
    if (userStr) {
      const { client } = JSON.parse(userStr)
      setDbUser(client);
    }
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.primaryBackground }}>

      <Animated.View style={{ opacity: calendarOpacity, zIndex: !displayReservationsForDay ? 2 : 1, transform: [{ translateY: calendarTranslateY }] }}>
        <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', marginBottom: 40 }}>
          <ShadowView>
            <LinearGradient
              colors={['#4B0082', '#4A1082']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                borderRadius: 20,
                width: '100%',
              }}>
              <ImageBackground
                source={require("../assets/images/shapes.png")}
                imageStyle={{ opacity: 0.2 }}
                style={{ padding: 10 }}>
                <TouchableOpacity style={{ flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center', padding: 10 }}>
                  <View style={{ marginRight: 25, alignItems: 'flex-start' }}>
                    <Text style={{ fontSize: 18, color: '#ddd' }}>Octobre</Text>
                    <Text style={{ fontSize: 30, color: '#fff', fontWeight: '800' }}>18</Text>
                  </View>
                  <Text style={{ color: '#ddd', fontSize: 14, lineHeight: 19, maxWidth: '65%', fontWeight: '300' }}>Aucune réservation prévue pour aujourd'hui</Text>
                </TouchableOpacity>
              </ImageBackground>
            </LinearGradient>
          </ShadowView>
        </View>
        <CalendarPicker
          onDateChange={handleDateChange}
          weekdays={WEEK_DAYS}
          months={MONTHS}
          dayLabelsWrapper={{ borderTopWidth: 0, borderBottomWidth: 0, paddingBottom: 0 }}
          customDayHeaderStyles={customDayHeaderStylesCallback}
          previousComponent={<AntDesign name="left" size={20} color={theme.primaryText} />}
          nextComponent={<AntDesign name="right" size={20} color={theme.primaryText} />}
          monthTitleStyle={{ fontSize: 18, fontWeight: "800" }}
          yearTitleStyle={{ fontSize: 18, fontWeight: "800" }}
          selectedDayStyle={{ backgroundColor: theme.primaryLight }}
          textStyle={{ color: theme.primaryText }}
        />
      </Animated.View>


      <Animated.View style={{ flex: 1, position: 'absolute', zIndex: 1, padding: 10, left: 0, right: 0, top: 0, opacity: reservationsOpacity, transform: [{ translateY: reservationsTranslateY }] }}>
        <View style={{ width: '100%', marginBottom: 15 }}>
          <Text style={{ fontSize: 18, fontWeight: '900', marginBottom: 10, color: theme.primaryTextLight }}>{selectedDateDatas?.monthName} {selectedDateDatas?.dateYear} </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            {
              Array.from({ length: 7 }, (_, i) => i).map((d, i) => {
                return <TouchableOpacity key={i} style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: selectedDateDatas?.weekDates[i]?.getUTCDate() === selectedDateDatas?.dateDay ? 2 : 0,
                  paddingVertical: 10,
                  paddingHorizontal: 5,
                  borderRadius: 30,
                  borderColor: theme.primaryLight,
                  opacity: selectedDateDatas?.weekDates[i]?.getUTCDate() ? 1 : 0
                }}>
                  <Text style={{ color: theme.primaryTextLighter, fontSize: 13, fontWeight: '300', marginBottom: 10 }}>{WEEK_DAYS[i]} </Text>
                  <Text style={{ color: theme.primaryTextLight }}>{selectedDateDatas?.weekDates[i]?.getUTCDate()} </Text>
                </TouchableOpacity>
              })
            }
          </View>
        </View>

        <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', marginBottom: 15 }}>
          <AntDesign name="down" size={20} color={theme.primaryText} onPress={() => handleReturnClick()} style={{ padding: 10 }} />
        </View>

        <FlatList
          data={reservationList}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ marginBottom: 50 }}
          renderItem={({ item, index }: any) => {
            return <View style={{ width: '100%', flexDirection: 'row', marginVertical: 10, paddingVertical: 8, backgroundColor: theme.lightGreenTranslucent }}>
              <Image
                source={{ uri: terrains.find((terrain, index) => terrain.id === item?.court_id)?.image_url }}
                style={{ width: 50, height: 50, borderRadius: 5 }} />
              <View style={{ marginLeft: 15 }}>
                <Text style={{ fontSize: 14, fontWeight: '800', color: theme.primaryText }}>{terrains.find((terrain, index) => terrain.id === item?.court_id)?.nom}</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 5 }}>
                  {
                    item.reservation_hours.map((hr: any, index: number) => {
                      return <View key={`hr-${index}`} style={{ paddingHorizontal: 8, paddingVertical: 4, marginHorizontal: 3, borderRadius: 8, backgroundColor: theme.primary }}>
                        <Text style={{ color: theme.primaryBackground }}>{hr.heure}</Text>
                      </View>
                    })
                  }
                </View>
              </View>
            </View>
          }}
        />

        <View style={{ height: 50 }} />
      </Animated.View>

      <Modal visible={loading}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <LottieView
            autoPlay
            style={{ height: 100, width: 100 }}
            loop
            source={require('../assets/lotties/loader.json')}
          />
        </View>
      </Modal>
    </View>
  );
};

export default ReservationsListScreen;
