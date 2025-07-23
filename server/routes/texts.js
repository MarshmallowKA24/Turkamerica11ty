const express = require('express');
const router = express.Router();
const Text = require('../models/Text');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const texts = await Text.find({ userId: req.user.id });
    res.json(texts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.post('/', auth, async (req, res) => {
  try {
    const text = new Text({ ...req.body, userId: req.user.id });
    await text.save();
    res.json(text);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
