import React, {createContext, Dispatch, useEffect, useState} from 'react';
//android permission FCM
import {PermissionsAndroid} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from './src/Home';
import Details from './src/Details';
import Auth from './src/Auth';
import {useMessaging} from './src/utils/bootstrap';
import {getUserFromLocal} from './src/utils/async-storage';

PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

export type TPrimaryStackScreen = {
    Home: undefined;
    Details: {
        title: string;
        backdrop: string;
        overview: string;
        vote_average: number;
    };
};

export type TPrimaryTabs = {
    Movies: undefined;
    Auth: {
        setUser: Dispatch<React.SetStateAction<TUser>>;
    };
};

const PrimaryScreenStack = createNativeStackNavigator<TPrimaryStackScreen>();
const PrimaryTabs = createBottomTabNavigator<TPrimaryTabs>();

export type TUser = {
    email: string;
    name: string | null;
    photo: string | null;
} | null;
export const UserContext = createContext<TUser>(null);

const HomeStackScreen = () => {
    return (
        <PrimaryScreenStack.Navigator initialRouteName="Home">
            <PrimaryScreenStack.Screen
                name="Home"
                component={Home}
                options={{
                    title: 'Movies',
                    headerStyle: {
                        backgroundColor: '#000',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                        fontSize: 20,
                    },
                }}
            />
            <PrimaryScreenStack.Screen name="Details" component={Details} />
        </PrimaryScreenStack.Navigator>
    );
};
const App = () => {
    useMessaging();

    const [user, setUser] = useState<TUser>(null);

    useEffect(() => {
        const setUserFromLocal = async () => {
            const userFromLocal = await getUserFromLocal();
            if (userFromLocal !== null) {
                setUser(userFromLocal);
            }
        };

        setUserFromLocal().catch(err => console.log(err));
    }, []);

    return (
        <UserContext.Provider value={user}>
            <NavigationContainer>
                <PrimaryTabs.Navigator screenOptions={{headerShown: false}}>
                    <PrimaryTabs.Screen
                        name="Movies"
                        component={HomeStackScreen}
                    />
                    <PrimaryTabs.Screen
                        name="Auth"
                        component={Auth}
                        initialParams={{
                            setUser,
                        }}
                        options={{
                            title: 'Auth',
                            headerStyle: {
                                backgroundColor: '#000',
                            },
                            headerTintColor: '#fff',
                            headerTitleStyle: {
                                fontWeight: 'bold',
                                fontSize: 20,
                            },
                        }}
                    />
                </PrimaryTabs.Navigator>
            </NavigationContainer>
        </UserContext.Provider>
    );
};

export default App;
