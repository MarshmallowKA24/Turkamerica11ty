const mongoose = require('mongoose');

const textSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    maxlength: [10000, 'Content cannot exceed 10000 characters']
  },
  originalText: {
    type: String,
    maxlength: [10000, 'Original text cannot exceed 10000 characters']
  },
  language: {
    from: {
      type: String,
      required: true,
      enum: ['tr', 'en', 'es'],
      default: 'tr'
    },
    to: {
      type: String,
      required: true,
      enum: ['tr', 'en', 'es'],
      default: 'es'
    }
  },
  level: {
    type: String,
    enum: ['A1', 'A2', 'B1', 'B2', 'C1'],
    required: true
  },
  category: {
    type: String,
    enum: ['conversation', 'story', 'news', 'academic', 'business', 'culture'],
    default: 'conversation'
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
    timesRead: {
      type: Number,
      default: 0
    },
    timeSpent: {
      type: Number,
      default: 0 // in minutes
    },
    lastRead: Date,
    bookmarked: {
      type: Boolean,
      default: false
    },
    notes: [{
      content: String,
      timestamp: {
        type: Date,
        default: Date.now
      }
    }],
    highlightedWords: [{
      word: String,
      translation: String,
      position: Number
    }]
  },
  metadata: {
    wordCount: Number,
    estimatedReadingTime: Number, // in minutes
    audioUrl: String,
    imageUrl: String
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Calculate word count and reading time before saving
textSchema.pre('save', function(next) {
  if (this.isModified('content')) {
    const words = this.content.split(/\s+/).length;
    this.metadata.wordCount = words;
    this.metadata.estimatedReadingTime = Math.ceil(words / 200); // 200 words per minute
  }
  next();
});

// Indexes for better performance
textSchema.index({ userId: 1, category: 1 });
textSchema.index({ userId: 1, level: 1 });
textSchema.index({ isPublic: 1, level: 1 });

module.exports = mongoose.model('Text', textSchema);