const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  front: {
    type: String,
    required: [true, 'Front text is required'],
    trim: true,
    maxlength: [500, 'Front text cannot exceed 500 characters']
  },
  back: {
    type: String,
    required: [true, 'Back text is required'],
    trim: true,
    maxlength: [500, 'Back text cannot exceed 500 characters']
  },
  category: {
    type: String,
    required: true,
    enum: ['vocabulary', 'grammar', 'phrases', 'idioms', 'culture'],
    default: 'vocabulary'
  },
  level: {
    type: String,
    enum: ['A1', 'A2', 'B1', 'B2', 'C1'],
    required: true
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [50, 'Tag cannot exceed 50 characters']
  }],
  difficulty: {
    type: Number,
    min: 1,
    max: 5,
    default: 1
  },
  studyData: {
    timesStudied: {
      type: Number,
      default: 0
    },
    correctAnswers: {
      type: Number,
      default: 0
    },
    wrongAnswers: {
      type: Number,
      default: 0
    },
    lastStudied: Date,
    nextReview: Date,
    easeFactor: {
      type: Number,
      default: 2.5
    },
    interval: {
      type: Number,
      default: 1
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better performance
flashcardSchema.index({ userId: 1, category: 1 });
flashcardSchema.index({ userId: 1, level: 1 });
flashcardSchema.index({ userId: 1, 'studyData.nextReview': 1 });

module.exports = mongoose.model('Flashcard', flashcardSchema);