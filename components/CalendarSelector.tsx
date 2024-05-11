// CalendarSelector.tsx
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, InteractionManager } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import CalendarPicker from 'react-native-calendar-picker';
import Collapsible from 'react-native-collapsible';
import { WeekData, CalendarSelectorProps } from './Types'; // Ajustez selon vos chemins d'importation
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring, interpolate, Extrapolate, useDerivedValue, useAnimatedProps } from 'react-native-reanimated'
import AnimateableText from 'react-native-animateable-text';

const WEEK_DAYS = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const MONTHS = ["Jan", "Fev", "Mar", "Avr", "Mai", "Jui", "Jui", "Aoû", "Sep", "Oct", "Nov", "Déc"];


const CalendarSelector: React.FC<CalendarSelectorProps> = ({ selectedDate, onDateChange, theme }) => {
  const [selectedDateDatas, setSelectedDateDatas] = useState<WeekData | null>(null);
  const [selectedDateIndex, setSelectedDateIndex] = useState(2)
  const [displayCalendar, setDisplayCalendar] = useState(false);
  const minDate: Date = new Date();
  const positionX = useSharedValue(0);
  const selectedDateIndexRef = useRef<number>(2);

  const customDayHeaderStylesCallback = ({ dayOfWeek, month, year }: any) => {
    return {
      textStyle: {
        color: theme.primaryTextLight,
        fontSize: 13,
        fontWeight: '300'
      }
    };
  };

  const findSelectedDateIndex = (selectedDate: any) => {
    const selectedIndex = selectedDateDatas?.weekDates.findIndex((date: any) => {
      // Convertissez les deux dates en chaînes pour une comparaison facile
      return date.toDateString() === selectedDate.toDateString();
    });
    return selectedIndex;
  };


  useEffect(() => {
    updateWeekData(selectedDate);
  }, []);


  const updateWeekData = (date: Date) => {
    const newDateDatas = getWeekData(date);
    setSelectedDateDatas(newDateDatas);
    const dayIndex = newDateDatas.weekDates.findIndex(d => d.toDateString() === date.toDateString());
    if (dayIndex !== -1) {
      positionX.value = withSpring(dayIndex * 59);
    }
  };


  const getWeekData = (inputDate: Date): WeekData => {
    let weekDates = [];

    // Calculer le début de la plage de 5 jours
    // On s'assure que inputDate est à minuit pour éviter les problèmes de comparaison d'heure
    inputDate.setHours(0, 0, 0, 0);
    let startDay = new Date(inputDate);
    startDay.setDate(inputDate.getDate() - 2); // Ajustez ce chiffre si nécessaire pour changer la logique de centrage

    // Générer les 5 jours
    for (let i = 0; i < 5; i++) {
      let day = new Date(startDay);
      day.setDate(startDay.getDate() + i);
      weekDates.push(day);
    }

    // Extraire les informations nécessaires pour le retour
    const monthName = MONTHS[inputDate.getMonth()];
    const dateDay = inputDate.getDate();
    const dateMonth = inputDate.getMonth() + 1;
    const dateYear = inputDate.getFullYear();

    return {
      dateDay,
      weekDates,
      monthName,
      dateYear,
      dateMonth,
      fullDate: inputDate.toISOString().split('T')[0]
    };
  };

  const handleDayPress = async (date: Date, index: number) => {
    positionX.value = withSpring(index * (55 + 4));
    InteractionManager.runAfterInteractions(() => {
      setSelectedDateIndex(index);
      onDateChange(date);
      setDisplayCalendar(false);
    });
  };

  const renderDayItems = () => {
    return selectedDateDatas?.weekDates.map((date, index) => {
      const isSelectedDate = index === selectedDateIndex;
      const weekDayIndex = date.getDay();
      const currentWeekDay = WEEK_DAYS[weekDayIndex];
      const currentDateDay = date?.getDate();
      const currentMonth = MONTHS[date.getMonth()];
      return (
        <Pressable
          onPress={() => {
            handleDayPress(date, index)
          }}
          key={index}
          style={{
            zIndex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 5,
            paddingHorizontal: 15,
            borderRadius: 10,
            borderColor: '#888',
            marginHorizontal: 2,
            height: 65,
            width: 55,
            backgroundColor: 'transparent',
            flex: 1
          }}>
          <Text style={{ color: theme.primaryText, fontSize: 10, fontWeight: '300' }}>{currentWeekDay} </Text>
          <Text style={{ fontSize: 16, fontWeight: '800', color: theme.primaryTextLight }}>{currentDateDay} </Text>
          <Text style={{ fontSize: 10, color: theme.primaryTextLight }}>{currentMonth} </Text>
        </Pressable>
      );
    });
  };


  const selectedDateAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: positionX.value }],
    };
  });


  const handleDateChangeFromPicker = (date: Date) => {
    InteractionManager.runAfterInteractions(() => {
      const pickedDate = new Date(date);
      updateWeekData(pickedDate)
      onDateChange(pickedDate);
      setDisplayCalendar(false);
    })
  };

  return (
    <View>
      <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', marginBottom: 15, position: 'relative', top: 0, left: 0, right: 0 }}>
        <View style={{ flexDirection: 'row', position: 'relative', marginLeft: 10, height: 65, alignItems: 'center', width: 295 }}>
          <Animated.View
            style={[{
              zIndex: 2,
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 5,
              paddingHorizontal: 15,
              position: 'absolute',
              width: 55,
              height: 65,
              borderRadius: 10,
              backgroundColor: theme.primary,
            }, selectedDateAnimatedStyle]}
          />
          {renderDayItems()}
        </View>
        <Pressable onPress={() => setDisplayCalendar(!displayCalendar)}>
          <AntDesign name="calendar" size={20} color={theme.primaryText} />
        </Pressable>
      </View>
      <Collapsible collapsed={!displayCalendar}>
        <CalendarPicker
          onDateChange={handleDateChangeFromPicker}
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
  );
};

export default CalendarSelector;
