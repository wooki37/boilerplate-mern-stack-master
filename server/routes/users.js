const express = require('express');
const router = express.Router();
const { User } = require("../models/User");
const { auth } = require("../middleware/auth");

//=================================
//             User
//=================================

router.get("/auth", auth, (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

router.post("/register", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    return res.status(201).json({ success: true });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

// POST /api/users/login  (로그인)
// server/routes/users.js (로그인 핸들러)
router.post('/login', async (req, res) => {
  try {
    const { email, password: plainPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ loginSuccess: false, message: 'Auth failed, email not found' });
    }

    // comparePassword 콜백/프로미스 모두 지원
    const isMatch =
      typeof user.comparePassword === 'function' &&
      (user.comparePassword.length >= 2
        ? await new Promise((resolve, reject) =>
            user.comparePassword(plainPassword, (err, ok) =>
              err ? reject(err) : resolve(ok)
            )
          )
        : await user.comparePassword(plainPassword));

    // ✅ 이제부터 isMatch 참조 가능
    // console.log('[login] isMatch=', isMatch);

    if (!isMatch) {
      return res
        .status(401)
        .json({ loginSuccess: false, message: 'Wrong password' });
    }

    // generateToken 콜백/프로미스 모두 지원
    if (typeof user.generateToken === 'function' && user.generateToken.length >= 1) {
      await new Promise((resolve, reject) =>
        user.generateToken((err) => (err ? reject(err) : resolve()))
      );
    } else if (typeof user.generateToken === 'function') {
      await user.generateToken();
    } else {
      throw new Error('generateToken method not found on User model');
    }

    const cookieOpts = {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      path: '/',
    };

    if (user.tokenExp) res.cookie('x_authExp', user.tokenExp, cookieOpts);
    res.cookie('x_auth', user.token, cookieOpts);

    return res.status(200).json({ loginSuccess: true, userId: user._id });
  } catch (err) {
    return res
      .status(500)
      .json({ loginSuccess: false, error: err.message || String(err) });
  }
});


// GET /api/users/logout  (로그아웃)
router.get('/logout', auth, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { token: '', tokenExp: '' });
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
