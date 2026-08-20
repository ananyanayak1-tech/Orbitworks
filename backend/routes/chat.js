const express = require('express');
const router = express.Router();
const { getDb } = require('../config/db');
const auth = require('../middleware/auth');

// @route   GET /api/chat/:room
// @desc    Get chat history for a specific room
// @access  Private
router.get('/:room', auth, async (req, res) => {
  const room = req.params.room;
  try {
    const db = getDb();
    // Fetch the last 100 messages for this room, sorted by timestamp ascending
    const messages = await db.collection('messages')
      .find({ room })
      .sort({ timestamp: 1 })
      .limit(100)
      .toArray();

    // Map _id to id
    const mapped = messages.map(m => ({
      ...m,
      id: m._id.toString()
    }));
    
    res.json(mapped);
  } catch (err) {
    console.error("Failed to fetch chat history:", err);
    res.status(500).json({ message: "Server error fetching chat history" });
  }
});

module.exports = router;
