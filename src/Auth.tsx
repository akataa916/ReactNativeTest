import React, {useContext, useEffect, useState} from 'react';
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
    const {setUser} = useContext(UserContext);

    //const [user, setUser] = useState({});
    const [signedIn, setSignedIn] = useState(false);
    const [email, setEmail] = useState<any | null>('');
    const [name, setName] = useState<any | null>('');
    const [photo, setPhoto] = useState<any | null>('');

    useEffect(() => {
        AsyncStorage.getItem('User').then(res => {
            console.log('user', res);
            if (res == null) {
                console.log('user not logged in');
            } else {
                const userData = JSON.parse(res);
                console.log(JSON.parse(res).email);
                setEmail(userData.email);
                setName(userData.name);
                setSignedIn(true);
            }
        });
    });

    const signOut = () => {
        AsyncStorage.removeItem('User');
        setSignedIn(false);
        GoogleSignin.signOut()
            .then(res => {
                setEmail(null);
                setName(null);
                setPhoto(null);
            })
            .catch(error => console.log(error));
        setSignedIn(false);
        setUser(null);
    };

    async function onGoogleButtonPress() {
        await GoogleSignin.hasPlayServices({
            showPlayServicesUpdateDialog: true,
        });
        const {idToken} = await GoogleSignin.signIn();
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);
        return auth().signInWithCredential(googleCredential);
    }

    return (
        <SafeAreaView>
            {!signedIn ? (
                <Button
                    title="Google Sign-In"
                    onPress={() =>
                        onGoogleButtonPress().then(res => {
                            // console.log('Signed in with Google!', res.user.email);
                            const emailid = res.user.email;
                            const nameid = res.user.displayName;
                            const photoid = res.user.photoURL;

                            if (emailid === null) {
                                throw Error(
                                    'Found null email id upon authentication',
                                );
                            }

                            setEmail(emailid);
                            setName(nameid);
                            setPhoto(photoid);
                            //const movies = JSON.parse(AsyncStorage.getItem(emailid));
                            // console.log('movies', movies);
                            AsyncStorage.setItem(
                                'User',
                                JSON.stringify({
                                    email: emailid,
                                    name: nameid,
                                    photo: photoid,
                                }),
                            );

                            firestore()
                                .collection('Users')
                                .doc(emailid)
                                .get()
                                .then(res => {
                                    if (res.exists) {
                                        console.log('user already exists');
                                    } else {
                                        console.log('adding new user', emailid);

                                        firestore()
                                            .collection('Users')
                                            .doc(emailid)
                                            .set({
                                                email: emailid,
                                                name: nameid,
                                                photo: photoid,
                                                favourites: [],
                                            });
                                    }
                                });
                            //getCurrentUser();
                            setSignedIn(true);

                            setUser({
                                email: emailid,
                                name: nameid,
                                photo: photoid,
                            });
                        })
                    }
                />
            ) : (
                <ScrollView>
                    <Text>Email - {email}</Text>
                    <Text>Name - {name}</Text>
                    <Button
                        title="Log out"
                        onPress={() => {
                            signOut();
                        }}
                    />
                </ScrollView>
            )}
        </SafeAreaView>
    );
};
export default Auth;
