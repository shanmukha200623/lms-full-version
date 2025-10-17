const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = {
  requireAuth: async (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token' });
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(payload.id).select('-passwordHash');
      if (!user) return res.status(401).json({ message: 'Invalid token' });
      req.user = user;
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Token error', error: err.message });
    }
  },

  requireRole: (role) => (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
    if (req.user.role !== role) return res.status(403).json({ message: 'Forbidden' });
    next();
  }
};
