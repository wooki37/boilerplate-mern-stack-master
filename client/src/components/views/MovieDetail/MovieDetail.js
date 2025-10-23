import React, { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { API_URL, IMAGE_BASE_URL } from '../../Config';
import MainImage from '../LandingPage/Sections/MainImage';
import MovieInfo from './Sections/MovieInfo';
import Favorite from './Sections/Favorite';

const BACKDROP_SIZE = 'w1280';
const POSTER_SIZE = 'w500';
const getImageUrl = (path, size = BACKDROP_SIZE) =>
    path ? `${IMAGE_BASE_URL}${size}${path}` : null;

export default function MovieDetail() {
    const { movieId } = useParams();
    const [movie, setMovie] = useState(null);
    const [casts, setCasts] = useState([]);
    const [showActors, setShowActors] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const abortRef = useRef(null);

    const API_KEY = process.env.REACT_APP_MOVIE_API_KEY;

    const fetchMovie = useCallback(async () => {
        if (!API_KEY) {
            setError('API Key is missing (.env 설정 확인)');
            return;
        }

        // 이전 요청 취소
        if (abortRef.current) abortRef.current.abort();
        abortRef.current = new AbortController();

        try {
            setLoading(true);
            setError('');

            // 상세 + 크레딧 병렬 요청
            const [detailRes, creditRes] = await Promise.all([
                axios.get(`${API_URL}movie/${movieId}`, {
                    params: { api_key: API_KEY, language: 'en-US' },
                    signal: abortRef.current.signal,
                }),
                axios.get(`${API_URL}movie/${movieId}/credits`, {
                    params: { api_key: API_KEY },
                    signal: abortRef.current.signal,
                }),
            ]);

            setMovie(detailRes.data);
            setCasts(creditRes.data?.cast ?? []);
        } catch (e) {
            if (axios.isCancel(e)) return; // 취소는 무시
            setError(e?.message || '영화 정보를 불러오지 못했습니다.');
        } finally {
            setLoading(false);
        }
    }, [API_KEY, movieId]);

    useEffect(() => {
        fetchMovie();
        return () => abortRef.current?.abort();
    }, [fetchMovie]);

    if (loading && !movie) return <div style={{ padding: 16 }}>Loading…</div>;
    if (error && !movie) return <div style={{ padding: 16, color: 'crimson' }}>{error}</div>;
    if (!movie) return null;

    const heroImage =
        movie.backdrop_path || movie.poster_path
            ? getImageUrl(movie.backdrop_path ?? movie.poster_path, BACKDROP_SIZE)
            : null;

    return (
        <div>
            {/* Header */}
            {heroImage && (
                <MainImage
                    image={heroImage}
                    title={movie.original_title || movie.title}
                    text={movie.overview}
                />
            )}

            {/* Body */}
            <div style={{ width: '85%', margin: '1rem auto' }}>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Favorite movieInfo={movie} movieId={movieId} userFrom={localStorage.getItem('userId')} />
                </div>

                {/* Movie Info */}
                <MovieInfo movie={movie} />

                <br />

                {/* Actors Grid 토글 */}
                <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem' }}>
                    <button onClick={() => setShowActors((s) => !s)}>
                        {showActors ? 'Hide Actors' : 'Show Actors'}
                    </button>
                </div>

                {showActors && (
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                            gap: 16,
                        }}
                    >
                        {casts.map((c) => {
                            const src = getImageUrl(c.profile_path, POSTER_SIZE);
                            return (
                                <div key={`${c.cast_id}-${c.credit_id}`} style={{ textAlign: 'center' }}>
                                    {src ? (
                                        <img
                                            src={src}
                                            alt={c.name}
                                            style={{ width: '100%', borderRadius: 8, display: 'block' }}
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div
                                            style={{
                                                width: '100%',
                                                paddingTop: '150%',
                                                background: '#333',
                                                borderRadius: 8,
                                                color: '#fff',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: 12,
                                            }}
                                        >
                                            No Image
                                        </div>
                                    )}
                                    <div style={{ marginTop: 8, fontSize: 12 }}>
                                        <div style={{ fontWeight: 600 }}>{c.name}</div>
                                        <div style={{ opacity: 0.7 }}>{c.character}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {error && <div style={{ marginTop: 16, color: 'crimson' }}>{error}</div>}
            </div>
        </div>
    );
}
