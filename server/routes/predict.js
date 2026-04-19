const express = require('express');
const Prediction = require('../models/Prediction');
const auth = require('../middleware/auth');

const router = express.Router();

// POST /api/predict/solar - Calculate solar energy (protected route)
// Formula: Energy = Area × Efficiency × Irradiance × Performance Ratio
router.post('/solar', auth, async (req, res) => {
  try {
    const { area, efficiency, irradiance, pr } = req.body;

    // Solar energy formula
    const energy = parseFloat(area) *
                   parseFloat(efficiency) *
                   parseFloat(irradiance) *
                   parseFloat(pr);

    // Save prediction to database
    const prediction = new Prediction({
      userId: req.userId,
      type: 'solar',
      inputs: { area, efficiency, irradiance, pr },
      result: energy,
      unit: 'kWh/day'
    });
    await prediction.save();

    res.json({
      type: 'solar',
      energy: parseFloat(energy.toFixed(2)),
      unit: 'kWh/day'
    });
  } catch (error) {
    console.error('Solar prediction error:', error);
    res.status(500).json({ message: 'Error calculating solar energy' });
  }
});

// POST /api/predict/wind - Calculate wind energy (protected route)
// Formula: Power = 0.5 × Air Density × Area × Velocity³ × Cp × Efficiency
router.post('/wind', auth, async (req, res) => {
  try {
    const { area, airDensity, velocity, cp, efficiency } = req.body;

    // Wind power formula
    const energy = 0.5 *
      parseFloat(airDensity) *
      parseFloat(area) *
      Math.pow(parseFloat(velocity), 3) *
      parseFloat(cp) *
      parseFloat(efficiency);

    // Save prediction to database
    const prediction = new Prediction({
      userId: req.userId,
      type: 'wind',
      inputs: { area, airDensity, velocity, cp, efficiency },
      result: energy,
      unit: 'Watts'
    });
    await prediction.save();

    res.json({
      type: 'wind',
      energy: parseFloat(energy.toFixed(2)),
      unit: 'Watts'
    });
  } catch (error) {
    console.error('Wind prediction error:', error);
    res.status(500).json({ message: 'Error calculating wind energy' });
  }
});

// GET /api/predict/history - Get user's prediction history (protected route)
router.get('/history', auth, async (req, res) => {
  try {
    const predictions = await Prediction.find({ userId: req.userId })
      .sort({ createdAt: -1 })   // Newest first
      .limit(50);                 // Max 50 results

    res.json(predictions);
  } catch (error) {
    console.error('History error:', error);
    res.status(500).json({ message: 'Error fetching history' });
  }
});

module.exports = router;
