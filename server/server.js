const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static HTML files from public/ folder
app.use(express.static(path.join(__dirname, '..', 'public')));

// ================= ROUTES =================
const authRoutes = require('./routes/auth');
const predictRoutes = require('./routes/predict');
const contactRoutes = require('./routes/contact');

app.use('/api/auth', authRoutes);
app.use('/api/predict', predictRoutes);
app.use('/api/contact', contactRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'EnergyPredict API is running' });
});

// ================= CONNECT TO MONGODB & START SERVER =================
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log('Server running on http://localhost:' + PORT);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
