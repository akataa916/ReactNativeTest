import AsyncStorage from '@react-native-async-storage/async-storage';
import {TUser} from '../../App';

export const getFavoritesForUser: (email: string) => Promise<string[]> = async (
    email: string,
) => {
    try {
        return JSON.parse((await AsyncStorage.getItem(email)) ?? '[]');
    } catch (error) {
        return [];
    }
};

export const getUserFromLocal: () => Promise<TUser> = async () => {
    try {
        const value = await AsyncStorage.getItem('User');
        if (value !== null) {
            return JSON.parse(value);
        }
        return null;
    } catch (error) {
        console.log(`Error in getting the user from local storage: ${error}`);
        return null;
    }
};
