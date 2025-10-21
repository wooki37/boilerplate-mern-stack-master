import React, { useCallback, useEffect, useState, useRef } from 'react'
import axios from 'axios';
import { API_URL, IMAGE_BASE_URL } from '../../Config';
import MainImage from './Sections/MainImage';
import GridCards from '../commons/GridCards';
import { Row } from 'antd';

const BACKDROP_SIZE = 'w1280';
const POSTER_SIZE = 'w500';
const getImageUrl = (path, size) =>
    path ? `${IMAGE_BASE_URL}${size}${path}` : null;

function LandingPage() {

    const [movies, setMovies] = useState([]);
    const [mainMovieImage, setMainMovieImage] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const abortRef = useRef(null);

    const API_KEY = process.env.REACT_APP_MOVIE_API_KEY;

    const fetchPopular = useCallback(
        async (reqPage) => {
            if (!API_KEY) {
                setError('API Key is missing');
                return;
            }

            if (abortRef.currentPage) abortRef.currentPage.abort();
            abortRef.currentPage = new AbortController();

            try {
                setLoading(true);
                setError('');

                const { data } = await axios.get(`${API_URL}movie/popular`, {
                    params: { api_key: API_KEY, language: 'en-US', page: reqPage },
                    signal: abortRef.currentPage.signal,
                });

                const list = data.results ?? [];

                if (reqPage === 1) {
                    const hero =
                        list.find(m => m.backdrop_path) ??
                        list.find(m => m.poster_path) ??
                        null;
                    setMainMovieImage(hero);
                    setMovies(list);
                } else {
                    setMovies(prev => {
                        const merged = [...prev, ...list];
                        const unique = merged.filter(
                            (movie, index, self) => index === self.findIndex(m => m.id === movie.id));
                        return unique;
                    });
                }

                setCurrentPage(data.page);
            } catch (err) {
                if (axios.isCancel(err)) return;
                setError(err.message || 'An error occurred while fetching data');
            } finally {
                setLoading(false);
            }
        },
        [API_KEY]
    );

    useEffect(() => {

        fetchPopular(1);
        return () => {
            if (abortRef.currentPage) abortRef.currentPage.abort();
        };
    }, [fetchPopular]);

    const handleLoadMore = () => {
        fetchPopular(currentPage + 1);
    };

    return (
        <div style={{
            width: '100%', margin: '0'
        }}>
            {/* Main Image */}
            {mainMovieImage && (
                <MainImage
                    image={getImageUrl(
                        mainMovieImage.backdrop_path ?? mainMovieImage.poster_path,
                        BACKDROP_SIZE
                    )}
                    title={mainMovieImage.original_title || mainMovieImage.title}
                    text={mainMovieImage.overview}
                />
            )}

            <div style={{ width: '85%', margin: '1rem auto' }}>
                <h2> Movies by latest</h2>
                <hr />

                {error && <div style={{ color: 'crimson', marginBottom: 12 }}>{error}</div>}
                {loading && <div style={{ marginBottom: 12 }}>Loading...</div>}

                {/* 디버그용 */}
                {/* <ul>
                    {movies.map(m => (
                        <li key={m.id}>{m.title}</li>
                    ))}
                </ul> */}

                {/* Movie Cards */}
                <Row gutter={[16, 16]}>
                    {movies.map(movie => (
                        <GridCards
                            key={movie.id}
                            image={getImageUrl(movie.poster_path, POSTER_SIZE)}
                            movieId={movie.id}
                            movieName={movie.original_title || movie.title}
                        />
                    ))}
                </Row>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0' }}>
                <button onClick={handleLoadMore} disabled={loading}>
                    {loading ? 'Loading...' : 'Load More'}
                </button>
            </div>
        </div>
    );
}

export default LandingPage
