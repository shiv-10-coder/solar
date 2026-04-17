import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import predictRoutes from './routes/predict.js';
import contactRoutes from './routes/contact.js';
import { trainModels } from './ml/trainer.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ================= MIDDLEWARE =================
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= ROUTES =================
app.use('/api/auth', authRoutes);
app.use('/api/predict', predictRoutes);
app.use('/api/contact', contactRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'EnergyPredict API is running ⚡' });
});

// ================= MONGODB + SERVER =================
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`⚡ Server running: http://localhost:${PORT}`);
    });
    // Train ML models in background
    try {
      await trainModels();
    } catch (err) {
      console.error('⚠️ ML Training error (non-fatal):', err.message);
    }
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });

