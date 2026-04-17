// ═══════════════════════════════════════════════════════════════
// ML TRAINER — Trains solar & wind models on real data
// Called on server startup
// ═══════════════════════════════════════════════════════════════

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { NeuralNetwork, Normalizer } from './neuralNetwork.js';
import { generateAndSave } from '../data/generateData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '..', 'data');

// Trained models (exported for use in routes)
export let solarModel = null;
export let windModel = null;
export let solarNorm = null;
export let windNorm = null;
export let solarOutputNorm = null;
export let windOutputNorm = null;
export let modelStatus = { solar: 'not_trained', wind: 'not_trained', solarInfo: {}, windInfo: {} };

export async function trainModels() {
  console.log('\n🧠 Starting ML Model Training...\n');

  // ── Generate data if not exists ──
  const solarPath = path.join(dataDir, 'solar_training.json');
  const windPath = path.join(dataDir, 'wind_training.json');

  if (!fs.existsSync(solarPath) || !fs.existsSync(windPath)) {
    console.log('📊 Generating training data...');
    generateAndSave();
  }

  const solarData = JSON.parse(fs.readFileSync(solarPath, 'utf-8'));
  const windData = JSON.parse(fs.readFileSync(windPath, 'utf-8'));

  // ── TRAIN SOLAR MODEL ──
  console.log('☀️ Training Solar Energy Model...');
  console.log(`   Dataset: ${solarData.length} samples`);

  const solarInputKeys = ['area', 'efficiency', 'irradiance', 'pr', 'temperature', 'humidity', 'cloudCover'];
  solarNorm = new Normalizer();
  solarNorm.fit(solarData, solarInputKeys);

  solarOutputNorm = new Normalizer();
  solarOutputNorm.fit(solarData, ['energy']);

  const solarTraining = solarData.map(d => ({
    input: solarNorm.normalize(d),
    output: [solarOutputNorm.normalize(d, 'energy')]
  }));

  // Helper function for single key normalize
  solarOutputNorm.normalize = function(obj, key) {
    const range = this.maxs[key] - this.mins[key];
    return range === 0 ? 0 : (obj[key] - this.mins[key]) / range;
  };

  // Rebuild training data with corrected normalizer
  const solarTrainingFixed = solarData.map(d => ({
    input: solarNorm.normalize(d),
    output: [(d.energy - solarOutputNorm.mins['energy']) / (solarOutputNorm.maxs['energy'] - solarOutputNorm.mins['energy'])]
  }));

  solarModel = new NeuralNetwork([7, 32, 16, 1]); // 7 inputs → 32 → 16 → 1 output
  solarModel.train(solarTrainingFixed, {
    epochs: 300,
    learningRate: 0.005,
    batchSize: 32,
    verbose: true
  });

  modelStatus.solar = 'trained';
  modelStatus.solarInfo = {
    ...solarModel.trainingInfo,
    inputFeatures: solarInputKeys,
    architecture: [7, 32, 16, 1],
    dataSize: solarData.length
  };
  console.log('   ✅ Solar model trained!\n');

  // ── TRAIN WIND MODEL ──
  console.log('🌬️ Training Wind Energy Model...');
  console.log(`   Dataset: ${windData.length} samples`);

  const windInputKeys = ['area', 'airDensity', 'velocity', 'cp', 'efficiency', 'temperature', 'altitude', 'turbulence'];
  windNorm = new Normalizer();
  windNorm.fit(windData, windInputKeys);

  windOutputNorm = new Normalizer();
  windOutputNorm.fit(windData, ['power']);

  const windTrainingFixed = windData.map(d => ({
    input: windNorm.normalize(d),
    output: [(d.power - windOutputNorm.mins['power']) / (windOutputNorm.maxs['power'] - windOutputNorm.mins['power'])]
  }));

  windModel = new NeuralNetwork([8, 48, 24, 1]); // 8 inputs → 48 → 24 → 1 output
  windModel.train(windTrainingFixed, {
    epochs: 300,
    learningRate: 0.003,
    batchSize: 32,
    verbose: true
  });

  modelStatus.wind = 'trained';
  modelStatus.windInfo = {
    ...windModel.trainingInfo,
    inputFeatures: windInputKeys,
    architecture: [8, 48, 24, 1],
    dataSize: windData.length
  };
  console.log('   ✅ Wind model trained!\n');

  console.log('🎉 All models trained and ready for predictions!\n');
}

// ── Prediction functions ──

export function predictSolar(inputs) {
  if (!solarModel) throw new Error('Solar model not trained');
  const normalized = solarNorm.normalize(inputs);
  const output = solarModel.predict(normalized);
  const energy = output[0] * (solarOutputNorm.maxs['energy'] - solarOutputNorm.mins['energy']) + solarOutputNorm.mins['energy'];
  return Math.max(0, energy);
}

export function predictWind(inputs) {
  if (!windModel) throw new Error('Wind model not trained');
  const normalized = windNorm.normalize(inputs);
  const output = windModel.predict(normalized);
  const power = output[0] * (windOutputNorm.maxs['power'] - windOutputNorm.mins['power']) + windOutputNorm.mins['power'];
  return Math.max(0, power);
}
