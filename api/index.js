const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const Recipe = require('../models/Recipe');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Load environment variables
dotenv.config();

// Database connection for serverless
let isConnected = false;
const connectToDatabase = async () => {
  if (isConnected) return;
  try {
    await require('../config/db')();
    isConnected = true;
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
};

// Connect to database
connectToDatabase();

const app = express();

// ==========================================
// MIDDLEWARE (CORS + JSON parsing)
// ==========================================
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://pantrypal-frontend-uyxr-plhbo9wqn-prachi196100s-projects.vercel.app',
    'https://pantrypal-frontend.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));
app.use(express.json());

// ==========================================
// JWT TOKEN GENERATOR
// ==========================================
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// ==========================================
// PUBLIC ROUTES
// ==========================================

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to PantryPal API! 🍳',
    status: 'Running',
    database: 'MongoDB Atlas',
    features: ['Recipes', 'User Auth', 'Favorites']
  });
});

// GET all recipes
app.get('/api/recipes', async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single recipe by ID
app.get('/api/recipes/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search recipes
app.get('/api/recipes/search', async (req, res) => {
  try {
    const { keyword, category } = req.query;
    let query = {};
    
    if (keyword) {
      query.title = { $regex: keyword, $options: 'i' };
    }
    if (category && category !== 'all') {
      query.category = category;
    }
    
    const recipes = await Recipe.find(query);
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==========================================
// AUTH ROUTES (Register/Login)
// ==========================================

// REGISTER new user
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
        message: 'User registered successfully!'
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// LOGIN user
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      favorites: user.favorites,
      token: generateToken(user._id),
      message: 'Login successful!'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==========================================
// PROTECTED ROUTES
// ==========================================

// Get current user profile
app.get('/api/auth/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE new recipe (protected)
app.post('/api/recipes', protect, async (req, res) => {
  try {
    const recipeData = {
      ...req.body,
      createdBy: req.user._id
    };
    
    const recipe = new Recipe(recipeData);
    const savedRecipe = await recipe.save();
    res.status(201).json(savedRecipe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE recipe (protected)
app.put('/api/recipes/:id', protect, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.json(updatedRecipe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE recipe (protected)
app.delete('/api/recipes/:id', protect, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    await recipe.deleteOne();
    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ADD/REMOVE favorite recipe
app.post('/api/auth/favorites/:recipeId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const recipeId = req.params.recipeId;

    const isFavorite = user.favorites.includes(recipeId);

    if (isFavorite) {
      user.favorites = user.favorites.filter(id => id.toString() !== recipeId);
      await user.save();
      res.json({ message: 'Removed from favorites', favorites: user.favorites });
    } else {
      user.favorites.push(recipeId);
      await user.save();
      res.json({ message: 'Added to favorites', favorites: user.favorites });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET user's favorites
app.get('/api/auth/favorites', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites');
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

// Export for Vercel serverless
module.exports = app;