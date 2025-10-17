import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { API_URL, IMAGE_BASE_URL } from '../../Config';
import MainImage from './Sections/MainImage';

function LandingPage() {

    const [movies, setMovies] = useState([]);
    const [MainMovieImage, setMainMovieImage] = useState(null);
    const getImageUrl = (path, size = 'w1280') =>
        path ? `${IMAGE_BASE_URL}${size}${path}` : null;

    useEffect(() => {
        const API_KEY = process.env.REACT_APP_MOVIE_API_KEY;
        async function fetchPopular() {
            const { data } = await axios.get(`${API_URL}movie/popular`, {
                params: { api_key: API_KEY, language: 'en-US', page: 1 },
            });
            const list = data.results ?? [];
            setMovies(list);

            const hero =
                list.find(m => m.backdrop_path) ??
                list.find(m => m.poster_path) ??
                null;

            setMainMovieImage(hero);
        }
        fetchPopular();
    }, []);


    return (
        <div style={{
            width: '100%', margin: '0'
        }}>
            {/* Main Image */}
            {MainMovieImage && (
                <MainImage
                    image={getImageUrl(
                        MainMovieImage.backdrop_path ?? MainMovieImage.poster_path,
                        'w1280'
                    )}
                    title={MainMovieImage.original_title}
                    text={MainMovieImage.overview}
                    />
            )}
            <div style={{ width: '85%', margin: '1rem auto' }}>

                <h2> Movies by latest</h2>
                <hr />
                <ul>
                    {movies.map(m => (
                        <li key={m.id}>{m.title}</li>
                    ))}
                </ul>

                {/* Movie Cards */}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button> Load More </button>
            </div>
        </div>
    )
}

export default LandingPage
