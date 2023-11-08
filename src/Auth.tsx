import React, {useCallback, useContext} from 'react';
import {Button, SafeAreaView, ScrollView, Text} from 'react-native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {TPrimaryTabs, UserContext} from '../App';

GoogleSignin.configure({
    webClientId:
        '774384638847-8ovmv177v11r2gep8h77vjpmlirpvkc9.apps.googleusercontent.com',
});

type TAuthScreen = NativeStackScreenProps<TPrimaryTabs, 'Auth'>;
const Auth = (_: TAuthScreen) => {
    const {user, setUser} = useContext(UserContext);

    const signOut = useCallback(async () => {
        try {
            await GoogleSignin.signOut();
            await AsyncStorage.removeItem('User');
            setUser(null);
        } catch (error) {
            console.log(`Error signing out: ${error}`);
        }
    }, [setUser]);

    const onGoogleButtonPress = useCallback(async () => {
        try {
            await GoogleSignin.hasPlayServices({
                showPlayServicesUpdateDialog: true,
            });
            const {idToken} = await GoogleSignin.signIn();
            const googleCredential =
                auth.GoogleAuthProvider.credential(idToken);
            const credential = await auth().signInWithCredential(
                googleCredential,
            );

            if (!credential?.user?.email) {
                throw Error('Google sign in failed - user email not available');
            }

            const document = await firestore()
                .collection('Users')
                .doc(credential.user.email)
                .get();

            if (!document.exists) {
                await firestore()
                    .collection('Users')
                    .doc(credential.user.email)
                    .set({
                        email: credential.user.email,
                        name: credential.user.displayName,
                        photo: credential.user.photoURL,
                        favourites: [],
                    });
            }

            await AsyncStorage.setItem(
                'User',
                JSON.stringify({
                    email: credential.user.email,
                    name: credential.user.displayName,
                    photo: credential.user.photoURL,
                }),
            );

            setUser({
                email: credential.user.email,
                name: credential.user.displayName,
                photo: credential.user.photoURL,
            });
        } catch (error) {
            console.log(`Error signing in: ${error}`);
        }
    }, [setUser]);

    return (
        <SafeAreaView>
            {user === null ? (
                <Button title="Google Sign-In" onPress={onGoogleButtonPress} />
            ) : (
                <ScrollView>
                    <Text>Email - {user.email}</Text>
                    <Text>Name - {user.name}</Text>
                    <Button title="Log out" onPress={signOut} />
                </ScrollView>
            )}
        </SafeAreaView>
    );
};
export default Auth;
