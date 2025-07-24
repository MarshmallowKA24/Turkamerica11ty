// server/routes/texts.js
const express = require('express');
const router = express.Router();
const Text = require('../models/Text');
const auth = require('../middleware/auth'); // Imports the object

// Use auth.authenticateToken for GET
router.get('/', auth.authenticateToken, async (req, res) => {
  try {
    // req.user is now available because authenticateToken ran successfully
    const texts = await Text.find({ userId: req.user.id });
    res.json(texts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Use auth.authenticateToken for POST
router.post('/', auth.authenticateToken, async (req, res) => {
  try {
    // req.user is now available here too
    const text = new Text({ ...req.body, userId: req.user.id });
    await text.save();
    res.json(text);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
