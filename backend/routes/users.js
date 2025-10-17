const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { verifyToken, isAdmin } = require('../middleware/auth');

// -------------------------------------------------------
// 👥 Get all users (admin only)
// -------------------------------------------------------
router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
});

// -------------------------------------------------------
// 👤 Get current user profile
// -------------------------------------------------------
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user)
      return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ success: false, message: 'Failed to load profile' });
  }
});

// -------------------------------------------------------
// ✏️ Update current user's name/email
// -------------------------------------------------------
router.put('/me', verifyToken, async (req, res) => {
  try {
    const { name, email } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true }
    ).select('-password');
    res.status(200).json(updated);
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ success: false, message: 'Failed to update user' });
  }
});

// -------------------------------------------------------
// 🔑 Change password (user self)
// -------------------------------------------------------
router.put('/me/password', verifyToken, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Old password incorrect' });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    console.error('Error updating password:', err);
    res.status(500).json({ success: false, message: 'Failed to update password' });
  }
});

// -------------------------------------------------------
// 🧩 Change role (admin only)
// -------------------------------------------------------
router.put('/:id/role', verifyToken, isAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user)
      return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    console.error('Error updating role:', err);
    res.status(500).json({ success: false, message: 'Failed to update role' });
  }
});

// -------------------------------------------------------
// 🗑️ Delete user (admin only)
// -------------------------------------------------------
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, message: 'User deleted' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ success: false, message: 'Failed to delete user' });
  }
});

module.exports = router;
