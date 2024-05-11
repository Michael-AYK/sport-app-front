import React from 'react';
import { View, ScrollView, Pressable, Text } from 'react-native';

interface TimeSlotSelectorProps {
    timeSlots: string[];
    selectedTime: string | null;
    handleTimeSelect: (time: string) => void;
    theme: any;
}

const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({ timeSlots, selectedTime, handleTimeSelect, theme }) => {
    return (
        <View style={{ flexDirection: 'row', paddingVertical: 10, alignItems: 'center', justifyContent: 'space-between' }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ backgroundColor: theme.primary, padding: 5 }}>
                {timeSlots.map((time, index) => (
                    <Pressable
                        key={index}
                        style={[{
                            marginHorizontal: 10,
                            paddingVertical: 10,
                            borderRadius: 10,
                            width: 75,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }, time === selectedTime && { backgroundColor: theme.primaryBackground }]}
                        onPress={() => handleTimeSelect(time)}
                    >
                        <Text style={[{
                            color: theme.primaryBackground,
                            fontWeight: '400'
                        }, time === selectedTime && { color: theme.primaryText, fontWeight: '800' }]}>{time}</Text>
                    </Pressable>
                ))}
            </ScrollView>
        </View>
    );
};

export default TimeSlotSelector;
