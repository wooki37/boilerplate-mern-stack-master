// server/routes/favorite.js
const express = require('express');
const router = express.Router();
const { Favorite } = require('../models/Favorite');

// POST /api/favorite/favoriteNumber
router.post('/favoriteNumber', async (req, res) => {
  try {
    // 프론트에서 오는 body 구조 확인
    // { userFrom: '...', movieId: '...' } 형태로 받는 게 좋습니다.
    const { movieId } = req.body;

    const favorites = await Favorite.find({ movieId });
    return res.status(200).json({ success: true, favoriteNumber: favorites.length });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

// POST /api/favorite/favorited
router.post('/favorited', async (req, res) => {
  try {
    const { movieId, userFrom } = req.body;
    const favorite = await Favorite.findOne({ movieId, userFrom });
    return res.status(200).json({ success: true, favorited: !!favorite });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

// POST /api/favorite/addToFavorite
router.post('/addToFavorite', async (req, res) => {
  try {
    const favorite = new Favorite(req.body);
    await favorite.save();
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

// POST /api/favorite/removeFromFavorite
router.post('/removeFromFavorite', async (req, res) => {
  try {
    await Favorite.findOneAndDelete(req.body);
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

module.exports = router;
