const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// register
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: 'Email already used' });
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  const user = new User({ name, email, passwordHash: hash, role });
  await user.save();
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
  res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
});

// login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });
  const ok = await user.comparePassword(password);
  if (!ok) return res.status(400).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
  res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
});

module.exports = router;
