const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String,
    },
    tokenExp: {
        type: Number
    }
})


// 비번 해시 (pre save)
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// 비번 비교
userSchema.methods.comparePassword = async function(plain) {
  return bcrypt.compare(plain, this.password);
};

// 토큰 생성
userSchema.methods.generateToken = async function() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not set');

  const payload = { _id: this._id.toHexString() };
  const token = jwt.sign(payload, secret); // 옵션으로 expiresIn 사용 가능

  this.token = token;
  // this.tokenExp = Date.now() + 1000 * 60 * 60 * 24; // 선택
  await this.save();
  return token;
};

// 토큰으로 찾기
userSchema.statics.findByToken = async function(token, cb) {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET is not set');

    const decoded = jwt.verify(token, secret);
    const user = await this.findOne({ _id: decoded._id, token });
    if (cb) return cb(null, user);
    return user;
  } catch (err) {
    if (cb) return cb(err);
    throw err;
  }
};


const User = mongoose.model('User', userSchema);

module.exports = { User }