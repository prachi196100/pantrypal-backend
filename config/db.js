const mongoose = require("mongoose");

let cachedConnection = null;

const connectDB = async () => {
  // Reuse connection (important for Vercel / serverless)
  if (cachedConnection) {
    return cachedConnection;
  }

  try {
    // Support both env variable names
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error(
        "Missing MongoDB URI. Set MONGODB_URI or MONGO_URI in .env"
      );
    }

    const conn = await mongoose.connect(mongoUri);

    cachedConnection = conn;

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    return conn;
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    throw error; // don't kill server in serverless
  }
};

module.exports = connectDB;
