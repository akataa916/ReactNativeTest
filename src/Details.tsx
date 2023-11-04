import React, {useCallback, useContext, useEffect, useState} from 'react';
import {Button, Image, SafeAreaView, StyleSheet, Text} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {TPrimaryStackScreen, UserContext} from '../App';
import {getFavoritesForUser} from './utils/async-storage';

type TDetails = NativeStackScreenProps<TPrimaryStackScreen, 'Details'>;

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
const Details = ({route}: TDetails) => {
    const user = useContext(UserContext);
    const [isFavorite, setIsFavorite] = useState<boolean>(false);

    useEffect(() => {
        const setFavorite = async () => {
            if (!user?.email) {
                return;
            }
            const movies = await getFavoritesForUser(user.email);
            if (!movies || movies.length === 0) {
                return;
            }
            setIsFavorite(movies.includes(route.params.title));
        };

        setFavorite().catch(err => console.log(err));
    }, [user?.email, route.params.title]);

    const addToFavorites = useCallback(async () => {
        if (!user?.email) {
            console.log(
                'Error: user not logged in while trying to add to favorites',
            );
            return;
        }
        setIsFavorite(true);
        const movies = new Set(await getFavoritesForUser(user.email));
        movies.add(route.params.title);
        await AsyncStorage.setItem(
            user.email,
            JSON.stringify(Array.from(movies)),
        );
        await firestore().collection('Users').doc(user.email).update({
            favourites: movies,
        });
    }, [route.params.title, user?.email]);

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
            {isFavorite ? (
                <Button title="Marked as favourite" />
            ) : (
                <Button title="Add to favourite" onPress={addToFavorites} />
            )}
        </SafeAreaView>
    );
};

export default Details;
