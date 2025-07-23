const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const Flashcard = require('../models/Flashcard');

const router = express.Router();

// Get all flashcards for authenticated user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { category, level, limit = 50, page = 1 } = req.query;
    
    const filter = { userId: req.user._id, isActive: true };
    if (category) filter.category = category;
    if (level) filter.level = level;

    const flashcards = await Flashcard.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Flashcard.countDocuments(filter);

    res.json({
      flashcards,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch flashcards' });
  }
});

// Create new flashcard
router.post('/',
  authenticateToken,
  [
    body('front').notEmpty().trim().isLength({ max: 500 }),
    body('back').notEmpty().trim().isLength({ max: 500 }),
    body('category').isIn(['vocabulary', 'grammar', 'phrases', 'idioms', 'culture']),
    body('level').isIn(['A1', 'A2', 'B1', 'B2', 'C1'])
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const flashcard = new Flashcard({
        ...req.body,
        userId: req.user._id
      });

      await flashcard.save();
      res.status(201).json(flashcard);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create flashcard' });
    }
  }
);

// Update flashcard
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const flashcard = await Flashcard.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );

    if (!flashcard) {
      return res.status(404).json({ error: 'Flashcard not found' });
    }

    res.json(flashcard);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update flashcard' });
  }
});

// Delete flashcard
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const flashcard = await Flashcard.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { isActive: false },
      { new: true }
    );

    if (!flashcard) {
      return res.status(404).json({ error: 'Flashcard not found' });
    }

    res.json({ message: 'Flashcard deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete flashcard' });
  }
});

module.exports = router;