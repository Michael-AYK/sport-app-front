import { apiRequest } from "./requestFormatter";

export const getUserNotifications = async (client_id: number) => {
    const data = await apiRequest('get', `user-notifications/${client_id}`);
    return data;
}
