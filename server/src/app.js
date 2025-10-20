import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import connectDB from './config/db.js';
import kennelRoutes from './routes/kennelRoutes.js';
import petRoutes from './routes/petRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN?.split(',') ?? '*',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/kennels', kennelRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/bookings', bookingRoutes);

app.use(notFound);
app.use(errorHandler);

export const startServer = async () => {
  await connectDB();
  const port = process.env.PORT || 5000;
  return app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

export default app;
