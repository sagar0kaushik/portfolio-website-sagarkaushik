import express from 'express';
import { Contact } from '../models/Contact.js';
import { memoryStore, getDbStatus } from '../config/db.js';
import { requireAdmin } from '../middleware/auth.js';
import { contactLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// POST /api/contact - Submit contact message (Rate limited, validated)
router.post('/', contactLimiter, async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Strict validation
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Your name is required.' });
    }
    if (!email || !email.trim() || !email.includes('@') || !email.includes('.')) {
      return res.status(400).json({ success: false, message: 'A valid email address is required.' });
    }
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message content is required.' });
    }

    const sanitizedName = name.trim().slice(0, 100);
    const sanitizedEmail = email.trim().toLowerCase().slice(0, 100);
    const sanitizedMessage = message.trim().slice(0, 3000);
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';

    const { mode } = getDbStatus();
    let saved;

    if (mode === 'mongodb') {
      saved = await Contact.create({
        name: sanitizedName,
        email: sanitizedEmail,
        message: sanitizedMessage,
        ip: clientIp,
        status: 'new'
      });
    } else {
      saved = {
        _id: 'msg-' + Date.now(),
        name: sanitizedName,
        email: sanitizedEmail,
        message: sanitizedMessage,
        ip: clientIp,
        status: 'new',
        createdAt: new Date()
      };
      memoryStore.contacts.push(saved);
    }

    return res.status(201).json({
      success: true,
      message: 'Thank you, Sagar has received your message and will respond promptly.',
      data: {
        id: saved._id,
        name: saved.name,
        createdAt: saved.createdAt
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to process message: ' + err.message });
  }
});

// GET /api/contact - View received messages (Admin protected)
router.get('/', requireAdmin, async (req, res) => {
  try {
    const { mode } = getDbStatus();
    let messages;

    if (mode === 'mongodb') {
      messages = await Contact.find().sort({ createdAt: -1 });
    } else {
      messages = [...memoryStore.contacts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return res.json({ success: true, count: messages.length, data: messages });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
