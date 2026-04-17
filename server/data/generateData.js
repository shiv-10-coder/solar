// ═══════════════════════════════════════════════════════════════
// REAL-WORLD TRAINING DATA GENERATOR
// Generates realistic solar & wind energy data based on physics
// with environmental factors and real-world noise
// ═══════════════════════════════════════════════════════════════

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function gaussian(mean, std) {
  // Box-Muller transform for normal distribution
  const u1 = Math.random();
  const u2 = Math.random();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return mean + z * std;
}

// ─────────────────────────────────────────
// SOLAR ENERGY DATA
// Based on: E = A × η × G × PR × TempFactor × CloudFactor
// ─────────────────────────────────────────
function generateSolarData(count = 600) {
  const data = [];

  // Real-world city irradiance profiles (kWh/m²/day)
  const cities = [
    { name: 'Phoenix', baseIrradiance: 6.5, avgTemp: 35, humidity: 20 },
    { name: 'Mumbai', baseIrradiance: 5.2, avgTemp: 30, humidity: 75 },
    { name: 'Berlin', baseIrradiance: 2.8, avgTemp: 12, humidity: 65 },
    { name: 'Dubai', baseIrradiance: 6.8, avgTemp: 38, humidity: 45 },
    { name: 'Tokyo', baseIrradiance: 3.8, avgTemp: 18, humidity: 60 },
    { name: 'Sydney', baseIrradiance: 5.0, avgTemp: 22, humidity: 55 },
    { name: 'Nairobi', baseIrradiance: 5.5, avgTemp: 20, humidity: 50 },
    { name: 'London', baseIrradiance: 2.5, avgTemp: 11, humidity: 75 },
    { name: 'Delhi', baseIrradiance: 5.4, avgTemp: 32, humidity: 55 },
    { name: 'Cairo', baseIrradiance: 6.2, avgTemp: 28, humidity: 35 },
  ];

  for (let i = 0; i < count; i++) {
    const city = cities[Math.floor(Math.random() * cities.length)];

    // Vary parameters realistically
    const area = rand(10, 500);                        // m² (residential to commercial)
    const efficiency = rand(0.12, 0.23);               // Panel efficiency
    const irradiance = Math.max(0.5, gaussian(city.baseIrradiance, 1.0));  // kWh/m²/day
    const pr = rand(0.6, 0.85);                        // Performance ratio
    const temperature = gaussian(city.avgTemp, 6);      // °C
    const humidity = Math.min(100, Math.max(5, gaussian(city.humidity, 12))); // %
    const cloudCover = Math.min(100, Math.max(0, rand(0, 80)));  // %

    // Temperature coefficient: panels lose ~0.4% efficiency per °C above 25°C
    const tempFactor = 1 - 0.004 * Math.max(0, temperature - 25);

    // Cloud cover reduces irradiance non-linearly
    const cloudFactor = 1 - (0.7 * Math.pow(cloudCover / 100, 1.5));

    // Humidity effect (slight reduction at very high humidity)
    const humidityFactor = 1 - (0.05 * Math.max(0, humidity - 70) / 30);

    // Calculate actual energy with all factors
    let energy = area * efficiency * irradiance * pr * tempFactor * cloudFactor * humidityFactor;

    // Add realistic noise (±5%)
    energy *= gaussian(1.0, 0.05);
    energy = Math.max(0, energy);

    data.push({
      area: parseFloat(area.toFixed(1)),
      efficiency: parseFloat(efficiency.toFixed(4)),
      irradiance: parseFloat(irradiance.toFixed(2)),
      pr: parseFloat(pr.toFixed(3)),
      temperature: parseFloat(temperature.toFixed(1)),
      humidity: parseFloat(humidity.toFixed(1)),
      cloudCover: parseFloat(cloudCover.toFixed(1)),
      energy: parseFloat(energy.toFixed(2))
    });
  }

  return data;
}

// ─────────────────────────────────────────
// WIND ENERGY DATA
// Based on: P = 0.5 × ρ × A × V³ × Cp × η × corrections
// ─────────────────────────────────────────
function generateWindData(count = 600) {
  const data = [];

  // Real turbine profiles
  const turbines = [
    { name: 'Small Residential', areaRange: [5, 30], cpRange: [0.25, 0.35] },
    { name: 'Medium Commercial', areaRange: [50, 500], cpRange: [0.30, 0.42] },
    { name: 'Large Industrial', areaRange: [1000, 12000], cpRange: [0.35, 0.48] },
  ];

  // Wind speed profiles by terrain
  const terrains = [
    { name: 'Offshore', baseSpeed: 9.5, turbulence: 0.08 },
    { name: 'Flat Plains', baseSpeed: 7.0, turbulence: 0.12 },
    { name: 'Hills', baseSpeed: 6.5, turbulence: 0.18 },
    { name: 'Coastal', baseSpeed: 8.0, turbulence: 0.10 },
    { name: 'Mountain Ridge', baseSpeed: 8.5, turbulence: 0.15 },
  ];

  for (let i = 0; i < count; i++) {
    const turbine = turbines[Math.floor(Math.random() * turbines.length)];
    const terrain = terrains[Math.floor(Math.random() * terrains.length)];

    const area = rand(turbine.areaRange[0], turbine.areaRange[1]);  // m²
    const airDensity = gaussian(1.225, 0.05);  // kg/m³ (varies with altitude/temp)
    const velocity = Math.max(0.5, gaussian(terrain.baseSpeed, 2.5));  // m/s
    const cp = rand(turbine.cpRange[0], turbine.cpRange[1]);  // Power coefficient
    const efficiency = rand(0.80, 0.95);  // Generator efficiency
    const temperature = gaussian(15, 10);  // °C
    const altitude = rand(0, 2000);  // meters above sea level
    const turbulenceIntensity = gaussian(terrain.turbulence, 0.03);  // fraction

    // Air density correction for altitude & temperature
    const altDensityFactor = Math.exp(-altitude / 8500);
    const tempDensityFactor = 288.15 / (273.15 + temperature);
    const correctedDensity = airDensity * altDensityFactor * tempDensityFactor;

    // Turbulence reduces effective power
    const turbulenceFactor = 1 - Math.max(0, turbulenceIntensity * 0.5);

    // Cut-in speed (below 3 m/s, no power)
    const cutInFactor = velocity < 3 ? 0 : (velocity < 4 ? (velocity - 3) : 1);

    // Cut-out speed (above 25 m/s, turbine shuts down)
    const cutOutFactor = velocity > 25 ? 0 : (velocity > 22 ? (25 - velocity) / 3 : 1);

    // Calculate power
    let power = 0.5 * correctedDensity * area * Math.pow(velocity, 3) * cp * efficiency
                * turbulenceFactor * cutInFactor * cutOutFactor;

    // Add realistic noise (±8%)
    power *= gaussian(1.0, 0.08);
    power = Math.max(0, power);

    data.push({
      area: parseFloat(area.toFixed(1)),
      airDensity: parseFloat(correctedDensity.toFixed(4)),
      velocity: parseFloat(velocity.toFixed(2)),
      cp: parseFloat(cp.toFixed(4)),
      efficiency: parseFloat(efficiency.toFixed(4)),
      temperature: parseFloat(temperature.toFixed(1)),
      altitude: parseFloat(altitude.toFixed(0)),
      turbulence: parseFloat(Math.max(0, turbulenceIntensity).toFixed(3)),
      power: parseFloat(power.toFixed(2))
    });
  }

  return data;
}

// ─────────────────────────────────────────
// GENERATE AND SAVE
// ─────────────────────────────────────────
export function generateAndSave() {
  const solarData = generateSolarData(600);
  const windData = generateWindData(600);

  const dataDir = path.join(__dirname);

  fs.writeFileSync(path.join(dataDir, 'solar_training.json'), JSON.stringify(solarData, null, 2));
  fs.writeFileSync(path.join(dataDir, 'wind_training.json'), JSON.stringify(windData, null, 2));

  console.log(`📊 Generated ${solarData.length} solar + ${windData.length} wind training samples`);
  return { solarData, windData };
}

// Export generators for direct use
export { generateSolarData, generateWindData };

// Run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateAndSave();
}
