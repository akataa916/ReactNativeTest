import React, {
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
} from 'react-native';
import {THomeStackScreen} from '../App';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {TMovie, usePopularMovies} from './apis/moviedb';
import {useCallback} from 'react';

type THome = NativeStackScreenProps<THomeStackScreen, 'Home'>;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: '#000',
    },
    card: {
        flex: 0.3,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        backgroundImage: 'linear-gradient(to bottom, #ff0000, #0000ff',
    },
    cardImage: {
        width: '80%',
        height: undefined,
        aspectRatio: 1,
        overflow: 'hidden',
    },
    cardText: {
        fontFamily: '',
        color: '#fff',
        margin: 10,
        fontSize: 15,
        alignSelf: 'center',
        marginBottom: 40,
    },
});
const Home = ({navigation}: THome) => {
    const [movies, {isLoading}] = usePopularMovies();

    const onMoviePress = useCallback(
        (movie: TMovie) => {
            navigation.navigate('Details', {
                title: movie.original_title,
                backdrop: movie.backdrop_path,
                overview: movie.overview,
                vote_average: movie.vote_average,
            });
        },
        [navigation],
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                {isLoading ? (
                    <Text>loading</Text>
                ) : (
                    movies.map(movie => {
                        return (
                            <TouchableOpacity
                                key={movie.id}
                                style={styles.card}
                                onPress={() => onMoviePress(movie)}>
                                <Image
                                    style={styles.cardImage}
                                    source={{
                                        uri: `https://image.tmdb.org/t/p/original${movie.backdrop_path}`,
                                    }}
                                />
                                <Text style={styles.cardText}>
                                    {movie.original_title}
                                </Text>
                            </TouchableOpacity>
                        );
                    })
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default Home;
