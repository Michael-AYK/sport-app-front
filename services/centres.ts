import { apiRequest } from "./requestFormatter";

export const searchTerrains = async (query: string) => {
    const data = await apiRequest('post', 'centers/search', { query });
    return data;
}