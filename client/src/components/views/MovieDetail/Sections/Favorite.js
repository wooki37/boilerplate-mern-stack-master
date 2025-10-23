import axios from 'axios';
import { set } from 'mongoose';
import React, { useState, useEffect, useCallback } from 'react'
import { use } from 'react';

function Favorite({ movieId, userFrom, movieInfo }) {

    const movieTitle = movieInfo?.title || movieInfo?.original_title || '';
    const moviePost = movieInfo?.backdrop_path || movieInfo?.poster_path || '';
    const movieRunTime = movieInfo?.runtime ?? null;

    const [favoriteNumber, setFavoriteNumber] = useState(0);
    const [favorited, setFavorited] = useState(false);
    const [error, setError] = useState('');

    const payload = {userFrom, movieId, movieTitle, moviePost, movieRunTime};

    const fetchFavoriteInfo = useCallback(async () => {
        try {
            setError('');

            const countRes = await axios.post('/api/favorite/favoriteNumber', payload);
            if (countRes.data.success) {
                setFavoriteNumber(countRes.data.favoriteNumber ?? 0);
            } else {
                throw new Error('Failed to get favorite number');
            }

            const favoritedRes = await axios.post('/api/favorite/favorited', payload);
            if (favoritedRes.data?.success) {
                setFavorited(!!favoritedRes.data.favorited);
            } else {
                throw new Error('Failed to get favorite status');
            }
        } catch (e) {
            setError(e?.message || 'Fail to load favorite info');
        }
    }, [movieId, userFrom, movieTitle, moviePost, movieRunTime]);

    useEffect(() => {

        if (userFrom && movieId) {
            fetchFavoriteInfo();
        }
    }, [fetchFavoriteInfo, userFrom, movieId]);

    const onClickFavorite = async () => {
        try {
            setError('');

            if (!userFrom) {
                alert('Please log in to manage favorites');
                return;
            }
            if (favorited) {
                // 이미 favorite 등록된 상태 -> favorite 취소
                const removeRes = await axios.post('/api/favorite/removeFromFavorite', payload);
                if (removeRes.data?.success) {
                    setFavorited(false);
                    setFavoriteNumber((n) => Math.max(0, n - 1));
                } else {
                    throw new Error('Failed to remove from favorite');
                }
            } else {
                const addRes = await axios.post('/api/favorite/addToFavorite', payload);
                if (addRes.data?.success) {
                    setFavorited(true);
                    setFavoriteNumber((n) => n + 1);
                } else {
                    throw new Error('Failed to add to favorite');
            }
        }
    } catch (e) {
        setError(e?.message || 'Fail to update favorite info');
    }
};
  return (
    <div>
        <button onClick={onClickFavorite}>
            {favorited ? 'Not Favorite' : 'Add To Favorite'} ({favoriteNumber})
        </button>
        {error && <div style={{ color: 'crimson', marginTop: 8 }}>{error}</div>}
    </div>
  );
}

export default Favorite