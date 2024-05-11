import { apiRequest } from "./requestFormatter";

export const processPaymentForBooking = async (firstName: string, lastName: string, email: string, totalAmount: number) => {
    const roundedTotalAmount = Math.round(totalAmount);
    const data = await apiRequest('post', 'process-payment', { firstName, lastName, email, totalAmount: roundedTotalAmount });
    return data;
}


export const finaleStoreSuccessBooking = async (email: string, participants: any, centre_sportif_id: number, date: any, selectedTime: any, duree: number, transaction_id: number, transaction_status: string, totalAmount: number, activity: string) => {
    console.log(email + " == " + centre_sportif_id + " == " + date + " == " + selectedTime + " == " + transaction_id + " == " + transaction_status + " == " + totalAmount)
    console.log(participants);
    const data = await apiRequest('post', 'final-save-booking', { email, participants, centre_sportif_id, date, selectedTime, duree, transaction_id, transaction_status, totalAmount, activity });
    return data;
}

export const getReservationListByUserAndDate = async (client_id: number, date_reservation: any) => {
    const data = await apiRequest('post', 'reservation-list-by-user-and-date', { client_id, date_reservation });
    return data;
}
 
export const getAvailableTerrains = async (time: any, date: any, activity: string) => {
    const data = await apiRequest('post', 'available-terrains', { time, date, activity });
    return data;
}

export const getAvailableCenters = async (heure: any, date: any, duree: number, sport_nom: string, latitude?: number, longitude?: number)  => {    
    const data = await apiRequest('post', 'available-centres', { heure, date, duree, sport_nom, latitude, longitude });
    return data;
}

export const getCentersWithReservations = async ()  => {    
    const data = await apiRequest('get', 'centers-with-reservations');
    return data;
}

export const getRecentReservations = async (email: string)  => {
    const data = await apiRequest('post', 'get-recent-reservations', { email });
    return data;
}

export const getUserReservations = async (email: string)  => {
    const data = await apiRequest('post', 'get-user-reservations', { email });
    return data;
}

export const getReceivedInvitations = async (email: string)  => {
    const data = await apiRequest('post', 'received-invitations', { email });
    return data;
}

export const getReservationDetails = async (reservationId: number, email: string)  => {
    const data = await apiRequest('post', `reservations/${reservationId}`, { email });
    return data;
}

export const updateParticipantStatus = async (reservationId: number, participantEmail: string, status: string)  => {
    console.log("reservationId = " + reservationId);
    console.log("participantEmail  = " + participantEmail);
    
    const data = await apiRequest('post', `reservations/${reservationId}/invitations/status`, { status, participantEmail, reservationId });
    return data;
}
