// server/middleware/auth.js
const { User } = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // 쿠키 키 통일: x_auth
    const token = req.cookies?.x_auth;
    if (!token) {
      return res.status(401).json({ isAuth: false, error: 'No token' });
    }

    // findByToken 이 콜백 기반이면 Promise로 감싸서 await
    const user =
      typeof User.findByToken === 'function' &&
      (User.findByToken.length >= 2
        ? await new Promise((resolve, reject) =>
            User.findByToken(token, (err, u) => (err ? reject(err) : resolve(u)))
          )
        : await User.findByToken(token));

    if (!user) {
      return res.status(401).json({ isAuth: false, error: 'Invalid token' });
    }

    req.token = token;
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ isAuth: false, error: err.message || 'Auth failed' });
  }
};

module.exports = { auth };
