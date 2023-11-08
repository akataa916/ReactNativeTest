import {useEffect, useMemo, useState} from 'react';
import Config from 'react-native-config';

export type TMovie = {
    adult: boolean;
    backdrop_path: string;
    genre_ids: number[];
    id: number;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    release_date: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
};

type TPopularMovies = {
    page: number;
    results: TMovie[];
    total_pages: number;
    total_results: number;
};

const movieDBBaseURL = 'https://api.themoviedb.org/3/movie';

export const usePopularMovies = () => {
    const [data, setData] = useState<{
        movies: TPopularMovies['results'];
        isLoading: boolean;
        isSuccess: boolean;
        isError: boolean;
    }>({
        movies: [],
        isLoading: false,
        isSuccess: false,
        isError: false,
    });

    const url = `${movieDBBaseURL}/popular?language=en-US&page=1`;
    const options = useMemo(
        () => ({
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${Config.MOVIE_DB_TOKEN}`,
            },
        }),
        [],
    );

    useEffect(() => {
        const controller = new AbortController();

        fetch(url, {
            ...options,
            signal: controller.signal,
        })
            .then(res => res.json())
            .then((json: TPopularMovies) => {
                setData({
                    movies: json.results,
                    isLoading: false,
                    isSuccess: true,
                    isError: false,
                });
            })
            .catch(err => {
                console.log(`Error: ${err}`);
                setData({
                    movies: [],
                    isLoading: false,
                    isSuccess: false,
                    isError: true,
                });
            });

        return () => {
            controller.abort();
        };
    }, [options, url]);

    return [
        data.movies,
        {
            isLoading: data.isLoading,
            isSuccess: data.isSuccess,
            isError: data.isError,
        },
    ] as const;
};
