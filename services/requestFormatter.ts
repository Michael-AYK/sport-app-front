import baseUrl from "./baseUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
// Helper function to perform an API request
export async function apiRequest(method: any, url: string, body: any = null, headers = {}) {
  const token = await AsyncStorage.getItem('token');
    const options: any = {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        "Authorization": token? `Bearer ${token}`: null,
        ...headers,
      },
      body: body ? JSON.stringify(body) : null,
    };

    const response = await fetch(baseUrl + url, options);
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }
    const data = await response.json();
    return data;
  }