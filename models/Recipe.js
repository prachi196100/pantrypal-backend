const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Healthy', 'Quick & Easy', 'Desserts', 'Vegetarian']
  },
  time: {
    type: String,
    default: '30 min'
  },
  timeValue: {
    type: Number,
    default: 30
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Easy'
  },
  calories: {
    type: String,
    default: '300'
  },
  servings: {
    type: Number,
    default: 2
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'
  },
  ingredients: [{
    type: String
  }],
  instructions: {
    type: String,
    required: true
  },
  // Optional: Link recipe to user who created it
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Recipe', recipeSchema);