const mongoose = require('mongoose');

const connectDB = async (mongoUri = process.env.MONGODB_URI) => {
  if (!mongoUri) {
    throw new Error('MONGODB_URI is required. Set it in .env or Render environment variables.');
  }

  mongoose.set('strictQuery', true);
  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 10000
  });

  return mongoose.connection;
};

const disconnectDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
};

module.exports = { connectDB, disconnectDB };
