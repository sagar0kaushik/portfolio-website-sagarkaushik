import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { memoryStore, getDbStatus } from '../config/db.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required.' });
    }

    let user;
    const { mode } = getDbStatus();

    if (mode === 'mongodb') {
      user = await User.findOne({ username });
    } else {
      user = memoryStore.users.find(u => u.username === username);
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const secret = process.env.JWT_SECRET || 'sagar_kaushik_production_jwt_secret_key_2026_swiss_editorial';
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      secret,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      message: 'Authentication successful.',
      token,
      user: {
        username: user.username,
        role: user.role
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/me', requireAdmin, (req, res) => {
  return res.json({
    success: true,
    user: req.user
  });
});

export default router;
