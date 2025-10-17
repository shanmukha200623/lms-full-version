const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// -------------------------------------------------------
// 🧩 User Schema
// -------------------------------------------------------
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/.+\@.+\..+/, 'Please use a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    role: {
      type: String,
      enum: ['student', 'teacher', 'admin'],
      default: 'student',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// -------------------------------------------------------
// 🔐 Hash password before saving
// -------------------------------------------------------
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // skip if unchanged

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// -------------------------------------------------------
// 🔑 Compare password during login
// -------------------------------------------------------
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// -------------------------------------------------------
// 🧾 Generate JWT Token
// -------------------------------------------------------
userSchema.methods.generateToken = function () {
  return jwt.sign(
    {
      id: this._id,
      role: this.role,
      name: this.name,
      email: this.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// -------------------------------------------------------
module.exports = mongoose.model('User', userSchema);
