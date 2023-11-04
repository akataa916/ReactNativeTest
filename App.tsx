import React from 'react';
//android permission FCM
import {PermissionsAndroid} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from './src/Home';
import Details from './src/Details';
import Auth from './src/Auth';
import {useMessaging} from './src/utils/bootstrap';

PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

export type THomeStackScreen = {
    Home: undefined;
    Details: {
        title: string;
        backdrop: string;
        overview: string;
        vote_average: number;
    };
};

const PrimaryScreenStack = createNativeStackNavigator<THomeStackScreen>();
const PrimaryTabs = createBottomTabNavigator();

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

    return (
        <NavigationContainer>
            <PrimaryTabs.Navigator screenOptions={{headerShown: false}}>
                <PrimaryTabs.Screen name="Movies" component={HomeStackScreen} />
                <PrimaryTabs.Screen
                    name="Auth"
                    component={Auth}
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
    );
};

export default App;
