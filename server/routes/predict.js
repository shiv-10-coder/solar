import express from 'express';
import Prediction from '../models/Prediction.js';
import auth from '../middleware/auth.js';
import { predictSolar, predictWind, modelStatus } from '../ml/trainer.js';

const router = express.Router();

// POST /api/predict/solar (Formula-based)
router.post('/solar', auth, async (req, res) => {
  try {
    const { area, efficiency, irradiance, pr } = req.body;

    const energy = parseFloat(area) *
                   parseFloat(efficiency) *
                   parseFloat(irradiance) *
                   parseFloat(pr);

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
      unit: 'kWh/day',
      method: 'formula',
      predictionId: prediction._id
    });
  } catch (error) {
    console.error('Solar prediction error:', error);
    res.status(500).json({ message: 'Error calculating solar energy' });
  }
});

// POST /api/predict/wind (Formula-based)
router.post('/wind', auth, async (req, res) => {
  try {
    const { area, airDensity, velocity, cp, efficiency } = req.body;

    const energy = 0.5 *
      parseFloat(airDensity) *
      parseFloat(area) *
      Math.pow(parseFloat(velocity), 3) *
      parseFloat(cp) *
      parseFloat(efficiency);

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
      unit: 'Watts',
      method: 'formula',
      predictionId: prediction._id
    });
  } catch (error) {
    console.error('Wind prediction error:', error);
    res.status(500).json({ message: 'Error calculating wind energy' });
  }
});

// ═══════════════════════════════════════════
// ML-POWERED PREDICTIONS
// ═══════════════════════════════════════════

// POST /api/predict/ml-solar
router.post('/ml-solar', auth, async (req, res) => {
  try {
    if (modelStatus.solar !== 'trained') {
      return res.status(503).json({ message: 'Solar ML model is still training. Try again shortly.' });
    }

    const { area, efficiency, irradiance, pr, temperature, humidity, cloudCover } = req.body;

    const inputs = {
      area: parseFloat(area),
      efficiency: parseFloat(efficiency),
      irradiance: parseFloat(irradiance),
      pr: parseFloat(pr),
      temperature: parseFloat(temperature || 25),
      humidity: parseFloat(humidity || 50),
      cloudCover: parseFloat(cloudCover || 20)
    };

    const mlEnergy = predictSolar(inputs);

    // Also compute formula result for comparison
    const formulaEnergy = inputs.area * inputs.efficiency * inputs.irradiance * inputs.pr;

    const prediction = new Prediction({
      userId: req.userId,
      type: 'solar',
      inputs: inputs,
      result: mlEnergy,
      unit: 'kWh/day'
    });
    await prediction.save();

    res.json({
      type: 'solar',
      energy: parseFloat(mlEnergy.toFixed(2)),
      formulaEnergy: parseFloat(formulaEnergy.toFixed(2)),
      unit: 'kWh/day',
      method: 'ml',
      modelInfo: modelStatus.solarInfo,
      predictionId: prediction._id
    });
  } catch (error) {
    console.error('ML Solar prediction error:', error);
    res.status(500).json({ message: 'Error in ML solar prediction' });
  }
});

// POST /api/predict/ml-wind
router.post('/ml-wind', auth, async (req, res) => {
  try {
    if (modelStatus.wind !== 'trained') {
      return res.status(503).json({ message: 'Wind ML model is still training. Try again shortly.' });
    }

    const { area, airDensity, velocity, cp, efficiency, temperature, altitude, turbulence } = req.body;

    const inputs = {
      area: parseFloat(area),
      airDensity: parseFloat(airDensity || 1.225),
      velocity: parseFloat(velocity),
      cp: parseFloat(cp),
      efficiency: parseFloat(efficiency),
      temperature: parseFloat(temperature || 15),
      altitude: parseFloat(altitude || 0),
      turbulence: parseFloat(turbulence || 0.1)
    };

    const mlPower = predictWind(inputs);

    // Formula comparison
    const formulaPower = 0.5 * inputs.airDensity * inputs.area * Math.pow(inputs.velocity, 3) * inputs.cp * inputs.efficiency;

    const prediction = new Prediction({
      userId: req.userId,
      type: 'wind',
      inputs: inputs,
      result: mlPower,
      unit: 'Watts'
    });
    await prediction.save();

    res.json({
      type: 'wind',
      energy: parseFloat(mlPower.toFixed(2)),
      formulaEnergy: parseFloat(formulaPower.toFixed(2)),
      unit: 'Watts',
      method: 'ml',
      modelInfo: modelStatus.windInfo,
      predictionId: prediction._id
    });
  } catch (error) {
    console.error('ML Wind prediction error:', error);
    res.status(500).json({ message: 'Error in ML wind prediction' });
  }
});

// GET /api/predict/model-info
router.get('/model-info', (req, res) => {
  res.json(modelStatus);
});

// GET /api/predict/history
router.get('/history', auth, async (req, res) => {
  try {
    const predictions = await Prediction.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(predictions);
  } catch (error) {
    console.error('History error:', error);
    res.status(500).json({ message: 'Error fetching history' });
  }
});

export default router;
