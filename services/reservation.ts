import { apiRequest } from "./requestFormatter";

export const storeBooking = async (firstName: string, lastName: string, email: string, totalAmount: number) => {
    const data = await apiRequest('post', 'save-booking', { firstName, lastName, email, totalAmount });
    return data;
}

export const finaleStoreSuccessBooking = async (email: string, participants: any, terrain_id: number, date: any, selectedTime: any, transaction_id: number, transaction_status: string, totalAmount: number, activity: string) => {
    console.log(email + " == " + terrain_id + " == " + date + " == " + selectedTime + " == " + transaction_id + " == " + transaction_status + " == " + totalAmount)
    console.log(participants);
    const data = await apiRequest('post', 'final-save-booking', { email, participants, terrain_id, date, selectedTime, transaction_id, transaction_status, totalAmount, activity });
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

export const getAvailableCenters = async (heure: any, date: any, duree: number, sport_nom: string, latitude: number, longitude: number)  => {
    const data = await apiRequest('post', 'available-centres', { heure, date, duree, sport_nom, latitude, longitude });
    return data;
}