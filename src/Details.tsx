import {useEffect, useState} from 'react';
import {Button, Image, SafeAreaView, StyleSheet, Text} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {THomeStackScreen} from '../App';

type TDetails = NativeStackScreenProps<THomeStackScreen, 'Details'>;

const Details = ({route, navigation}: TDetails) => {
    const [signedIn, setSignedIn] = useState(false);
    const [fav, setFav] = useState(false);
    const [email, setEmail] = useState('');
    const [movies, seMovies] = useState([]);

    useEffect(() => {
        AsyncStorage.getItem('User')
            .then(res => {
                console.log('user', res);
                if (res == null) {
                    console.log('user not logged in');
                    setFav(false);
                } else {
                    setSignedIn(true);
                    const userData = JSON.parse(res);
                    //console.log(userData.email);
                    setEmail(userData.email);
                    //check if title is marked as favourite
                    AsyncStorage.getItem(email)
                        .then(movies => {
                            if (movies === null) {
                                throw Error(
                                    'Found null movies id upon authentication',
                                );
                            }
                            const movieArr = JSON.parse(movies);
                            console.log('check movies------', movieArr);

                            const check = movieArr.includes(route.params.title);
                            console.log('check------', check);
                            setFav(check);
                            //syncing with firebase
                            firestore().collection('Users').doc(email).update({
                                favourites: movieArr,
                            });
                        })
                        .catch(err => console.log('error'));
                }
            })
            .catch(err => console.log('error'));
    });

    const addToFavs = async () => {
        //checking if user is signed in
        AsyncStorage.getItem('User').then(res => {
            console.log('user', res);
            if (res == null) {
                console.log('user not logged in');
                setFav(false);
            } else {
                setSignedIn(true);
            }
        });

        if (signedIn) {
            const movies = await AsyncStorage.getItem(email);
            if (movies) {
                const movieArr = JSON.parse(movies);
                movieArr.push(route.params.title);
                await AsyncStorage.setItem(email, JSON.stringify(movieArr));
                setFav(true);
            } else {
                try {
                    const movieArr = [route.params.title];
                    await AsyncStorage.setItem(email, JSON.stringify(movieArr));
                    setFav(true);
                } catch (error) {
                    console.log(error);
                }
            }
        } else {
            console.log('user not sign ed in');
            setFav(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Image
                style={styles.cardImage}
                source={{
                    uri:
                        'https://image.tmdb.org/t/p/original' +
                        route.params.backdrop,
                }}
            />
            <Text style={styles.text}>Description</Text>
            <Text style={styles.text}>{route.params.overview}</Text>
            <Text style={styles.text}>
                Rating - {route.params.vote_average}
            </Text>
            {fav ? (
                <Button title="Marked as favourite" />
            ) : (
                <Button
                    title="Add to favourite"
                    onPress={() => {
                        addToFavs();
                    }}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,

        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000',
        color: '#fff',
    },
    text: {
        color: '#fff',
    },
    cardImage: {
        width: '80%',
        height: undefined,
        aspectRatio: 1,
        overflow: 'hidden',
    },
});

export default Details;
