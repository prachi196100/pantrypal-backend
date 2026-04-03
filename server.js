// server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const userRoutes = require("./api/index");

const app = express();

// Connect to MongoDB
connectDB()
  .then(() => console.log("MongoDB connected"))
  .catch(err => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });

// Middleware
app.use(cors({
  // Allow only your deployed frontend domain
  origin: "https://pantrypal-frontend-uyxr-plhbo9wqn-prachi196100s-projects.vercel.app",
  credentials: true
}));
app.use(express.json());

// Routes
app.use("/api", userRoutes);

// Test route
app.get("/api/test", (req, res) => {
  res.json({
    message: "Backend running!",
    status: "Running",
    database: "MongoDB Atlas",
    features: ["Recipes", "User Auth", "Favorites"]
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));