const mongoose = require('mongoose');

let cachedConnection = null;

const connectDB = async () => {
  // Return cached connection if available (for serverless)
  if (cachedConnection) {
    return cachedConnection;
  }

  try {
<<<<<<< HEAD
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('Missing MongoDB URI. Set MONGODB_URI or MONGO_URI in backend/.env');
    }
    const conn = await mongoose.connect(mongoUri);
    console.log(`? MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('? MongoDB Connection Error:', error.message);
    process.exit(1);
=======
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    cachedConnection = conn;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    throw error;
>>>>>>> 8606f46364b6df3e09659cd499af589c6368293b
  }
};

module.exports = connectDB;
