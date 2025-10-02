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
userSchema.methods.comparePassword = function(plain) {
  return bcrypt.compare(plain, this.password);
};

// 토큰 생성
userSchema.methods.generateToken = async function() {
  const token = jwt.sign(
    { _id: this._id.toHexString() },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
  this.token = token;
  this.tokenExp = Date.now() + 60 * 60 * 1000;
  await this.save();
  return this;
};

// 토큰으로 찾기
userSchema.statics.findByToken = async function(token) {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const id = decoded?._id ?? decoded;
  return this.findOne({ _id: id, token });
};


const User = mongoose.model('User', userSchema);

module.exports = { User }