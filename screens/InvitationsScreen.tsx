import { View, Text, FlatList, TouchableOpacity, Image, Dimensions } from 'react-native'
import React from 'react'
import { baseUrlPublic } from '../services/baseUrl';
import { useSelector } from 'react-redux';
import lightTheme from '../themes/lightTheme';
import darkTheme from '../themes/darkTheme';
const { width } = Dimensions.get('window');

export default function InvitationsScreen(props: any) {
  const { receivedInvitations } = props.route.params;
  const mode = useSelector((state: any) => state.theme);
  const theme = mode === 'light' ? lightTheme : darkTheme;

  function navigateToReservationDetails(reservationId: number) {
    props.navigation.navigate("ReservationDetailScreen", { reservationId })
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.primaryBackground, padding: 15 }}>

      <FlatList
        data={receivedInvitations}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
          // Vérifier si la date de réservation est passée
          const isPast = new Date(item.date_reservation) < new Date();
          return (
            <TouchableOpacity
              onPress={() => {
                if (!isPast) {
                  navigateToReservationDetails(item.reservation_id);
                }
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: isPast ? '#d3d3d3' : theme.lightGreenTranslucent, // Gris pour une réservation passée
                height: 70,
                borderRadius: 15,
                marginVertical: 10,
                width: '100%',
                opacity: isPast ? 0.5 : 1, // Opacité réduite pour une réservation passée
              }}
              disabled={isPast} // Désactiver le TouchableOpacity si la réservation est passée
            >
              <Image
                source={{ uri: baseUrlPublic + item?.centre_sportif?.photo_couverture?.replace("public", "storage") }}
                style={{ width: '20%', height: 70, borderRadius: 8, objectFit: 'contain' }}
              />
              <View style={{ width: '60%', marginLeft: '2%', paddingVertical: 5 }}>
                <Text
                  style={{
                    fontSize: 14,
                    color: theme.primaryText,
                    marginBottom: 5,
                    fontWeight: '300',
                    maxWidth: '90%',
                    textDecorationLine: isPast ? 'line-through' : 'none', // Barrer le texte pour une réservation passée
                  }}
                  numberOfLines={2}
                >
                  {item?.centre_sportif?.nom}
                </Text>
                <Text style={{ fontSize: 12, color: theme.primaryTextLight }} numberOfLines={1}>
                  {item?.centre_sportif?.adresse}
                </Text>
              </View>

              <View style={{ width: '20%' }}>
                <Text style={{ fontSize: 10, fontWeight: '500', marginBottom: 8 }}>
                  {item?.date_reservation}
                </Text>
                <Text style={{ fontSize: 10, fontWeight: '300' }}>
                  {item?.heure_debut}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />

    </View>
  )
}