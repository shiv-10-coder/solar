import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', 'server', '.env') });

import authRoutes from '../server/routes/auth.js';
import predictRoutes from '../server/routes/predict.js';
import contactRoutes from '../server/routes/contact.js';
import { trainModels, modelStatus } from '../server/ml/trainer.js';

const app = express();

// ═══════ MIDDLEWARE ═══════
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ═══════ DB CONNECTION (reused across warm invocations) ═══════
let isConnected = false;
let isTraining = false;

async function connectDB() {
  if (isConnected) return;
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/energypredict';
  await mongoose.connect(uri);
  isConnected = true;
  console.log('✅ MongoDB connected');

  if (!isTraining && modelStatus.solar === 'not_trained') {
    isTraining = true;
    try { await trainModels(); } catch (e) { console.error('ML error:', e.message); }
    isTraining = false;
  }
}

// Connect DB before every request
app.use(async (req, res, next) => {
  try { await connectDB(); } catch (e) { console.error('DB error:', e.message); }
  next();
});

// ═══════ ROUTES ═══════
app.use('/api/auth', authRoutes);
app.use('/api/predict', predictRoutes);
app.use('/api/contact', contactRoutes);
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', models: modelStatus });
});

export default app;
