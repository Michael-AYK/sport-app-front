import React from 'react';
import { Modal, Pressable, View, Text } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; // Make sure to import AntDesign if used

export default function BookingRecapModal({
    displayBookingRecapModal,
    setDisplayBookingRecapModal,
    selectedDate,
    selectedTime,
    activity,
    selectedSportCenter,
    totalAmount,
    theme,
    onConfirmPress,
  }: any) {

   return <Modal transparent visible={displayBookingRecapModal} onRequestClose={() => setDisplayBookingRecapModal(false)}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, .7)' }}>
            <View style={{ padding: 20, width: '95%', backgroundColor: '#fff', borderRadius: 5 }}>
              <Pressable onPress={() => setDisplayBookingRecapModal(false)} style={{
                position: 'absolute',
                right: 15,
                top: 10,
                padding: 10,
                zIndex: 1,
              }}>
                <AntDesign name="close" size={24} color="#d22" />
              </Pressable>
              <Text style={{ fontSize: 20, fontWeight: '700', textAlign: 'center', marginBottom: 25 }}>Récapitulatif</Text>
    
              <View style={{ marginVertical: 5, width: '100%', paddingVertical: 10, borderBottomWidth: .5, borderColor: theme.primaryTextLighter }}>
                <Text style={{ fontSize: 15, fontWeight: '700', color: theme.primaryTextLight }}>Date</Text>
                <Text style={{ marginTop: 8, fontSize: 14, color: theme.primaryText }}>{selectedDate?.toLocaleDateString()}</Text>
              </View>
    
              <View style={{ marginVertical: 5, width: '100%', paddingVertical: 10, borderBottomWidth: .5, borderColor: theme.primaryTextLighter }}>
                <Text style={{ fontSize: 15, fontWeight: '700', color: theme.primaryTextLight }}>Horaire</Text>
                <Text style={{ marginTop: 8, fontSize: 14, color: theme.primaryText }}>{selectedTime}</Text>
              </View>
    
              <View style={{ marginVertical: 5, width: '100%', paddingVertical: 10, borderBottomWidth: .5, borderColor: theme.primaryTextLighter }}>
                <Text style={{ fontSize: 15, fontWeight: '700', color: theme.primaryTextLight }}>Activité</Text>
                <Text style={{ marginTop: 8, fontSize: 14, color: theme.primaryText }}>{activity}</Text>
              </View>
    
              <View style={{ marginVertical: 5, width: '100%', paddingVertical: 10, borderBottomWidth: .5, borderColor: theme.primaryTextLighter }}>
                <Text style={{ fontSize: 15, fontWeight: '700', color: theme.primaryTextLight }}>Lieu</Text>
                <Text style={{ marginTop: 8, fontSize: 14, color: theme.primaryText }}>{selectedSportCenter?.nom}</Text>
              </View>
    
              <View style={{ marginVertical: 5, width: '100%', paddingVertical: 10 }}>
                <Text style={{ fontSize: 15, fontWeight: '700', color: theme.primaryTextLight }}>Montant de la réservation</Text>
                <View style={{ padding: 8, backgroundColor: theme.primary + '33', borderRadius: 8, marginTop: 5 }}>
                  <Text style={{ fontSize: 20, fontWeight: '900', textAlign: 'center', color: theme.primary }}> {totalAmount} XOF </Text>
                </View>
              </View>
    
              <View style={{ width: '100%', marginTop: 30 }}>
                <Pressable
                  onPress={onConfirmPress}
                  style={{ alignSelf: 'center', width: '100%', justifyContent: 'center', alignItems: 'center', borderRadius: 10, paddingVertical: 18, paddingHorizontal: 40, backgroundColor: theme.primary }}>
                  <Text style={{ color: '#fff', }}> Confirmer la réservation </Text>
                </Pressable>
              </View>
    
            </View>
          </View>
        </Modal>
}