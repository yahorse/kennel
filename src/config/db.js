import mongoose from 'mongoose';

const connectDB = async () => {
  const uriEnvKeys = [
    'MONGO_URI',
    'MONGODB_URI',
    'MONGO_URL',
    'MONGODB_URL',
    'DATABASE_URL',
    'DB_URI',
    'DB_URL',
  ];

  const mongoUriEntry = uriEnvKeys
    .map((key) => {
      const value = process.env[key];
      if (!value) {
        return null;
      }

      const trimmed = value.trim();
      return trimmed ? { key, value: trimmed } : null;
    })
    .find(Boolean);

  if (!mongoUriEntry) {
    throw new Error(
      `Database connection string is not configured. Set one of ${uriEnvKeys.join(
        ', '
      )} before starting the server.`
    );
  }

  mongoose.set('strictQuery', true);

  try {
    await mongoose.connect(mongoUriEntry.value, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB connected using ${mongoUriEntry.key}`);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

export default connectDB;
