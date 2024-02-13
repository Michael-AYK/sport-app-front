import { apiRequest } from "./requestFormatter";

export const registerUser = async (nom: string, email: string) => {
    const data = await apiRequest('POST', `register-user`, { nom, email });
    return data;
};

//
export const findClientByEmail = async (email: string) => {
    const data = await apiRequest('post', `find-client-by-email`, { email });
    return data;
}

export const getAllClientsExceptCurrent = async (email: string) => {
    const data = await apiRequest('post', `get-all-clients-except-current`, { email });
    return data;
}

