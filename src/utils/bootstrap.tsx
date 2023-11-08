import {useEffect} from 'react';
import messaging from '@react-native-firebase/messaging';
import {Alert, Platform} from 'react-native';

export const useMessaging = () => {
    useEffect(() => {
        let messageInit = messaging();

        if (Platform.OS === 'android') {
            messageInit.registerDeviceForRemoteMessages();
        }

        const unsubscribe = messageInit.onMessage(async remoteMessage => {
            Alert.alert(
                'A new FCM message arrived!',
                JSON.stringify(remoteMessage),
            );
        });

        messageInit.onNotificationOpenedApp(remoteMessage => {
            console.log(
                'Notification caused app to open from background state:',
                remoteMessage.notification,
            );
        });

        // Check whether an initial notification is available
        messageInit.getInitialNotification().then(remoteMessage => {
            if (remoteMessage) {
                console.log(
                    'Notification caused app to open from quit state:',
                    remoteMessage.notification,
                );
            }
        });

        return unsubscribe;
    }, []);
};
