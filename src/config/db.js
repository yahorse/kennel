import mongoose from 'mongoose';

const connectDB = async () => {
  const mongoUri =
    process.env.MONGO_URI ||
    process.env.MONGODB_URI ||
    process.env.DATABASE_URL ||
    '';

  if (!mongoUri) {
    throw new Error(
      'Database connection string is not configured. Set MONGO_URI (or MONGODB_URI / DATABASE_URL) before starting the server.'
    );
  }

  mongoose.set('strictQuery', true);

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

export default connectDB;
