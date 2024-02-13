import { apiRequest } from "./requestFormatter";

export const fetchSportsActivities = async () => {
    const data = await apiRequest('get', 'sports');
    return data;
}