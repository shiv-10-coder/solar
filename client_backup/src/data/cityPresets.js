// Pre-computed solar & wind energy predictions for popular cities
// Values based on typical climate data for each location

const cityPresets = [
  {
    name: 'Delhi',
    country: 'India',
    flag: '🇮🇳',
    coordinates: '28.6°N, 77.2°E',
    climate: 'Semi-arid, hot summers',
    solar: {
      energy: 41.25,
      unit: 'kWh/day',
      method: 'formula',
      type: 'solar',
      inputs: {
        area: '50',
        efficiency: '0.20',
        irradiance: '5.5',
        pr: '0.75',
        temperature: '35',
        humidity: '45',
        cloudCover: '25'
      }
    },
    wind: {
      energy: 529.2,
      unit: 'Watts',
      method: 'formula',
      type: 'wind',
      inputs: {
        area: '8000',
        airDensity: '1.164',
        velocity: '4.5',
        cp: '0.35',
        efficiency: '0.90',
        temperature: '35',
        altitude: '216',
        turbulence: '0.18'
      }
    }
  },
  {
    name: 'New York',
    country: 'USA',
    flag: '🇺🇸',
    coordinates: '40.7°N, 74.0°W',
    climate: 'Humid subtropical, four seasons',
    solar: {
      energy: 30.60,
      unit: 'kWh/day',
      method: 'formula',
      type: 'solar',
      inputs: {
        area: '50',
        efficiency: '0.20',
        irradiance: '4.2',
        pr: '0.73',
        temperature: '18',
        humidity: '63',
        cloudCover: '45'
      }
    },
    wind: {
      energy: 2381.4,
      unit: 'Watts',
      method: 'formula',
      type: 'wind',
      inputs: {
        area: '8000',
        airDensity: '1.225',
        velocity: '6.5',
        cp: '0.40',
        efficiency: '0.90',
        temperature: '18',
        altitude: '10',
        turbulence: '0.14'
      }
    }
  },
  {
    name: 'London',
    country: 'UK',
    flag: '🇬🇧',
    coordinates: '51.5°N, 0.1°W',
    climate: 'Temperate maritime, cloudy',
    solar: {
      energy: 19.35,
      unit: 'kWh/day',
      method: 'formula',
      type: 'solar',
      inputs: {
        area: '50',
        efficiency: '0.19',
        irradiance: '2.9',
        pr: '0.70',
        temperature: '12',
        humidity: '75',
        cloudCover: '65'
      }
    },
    wind: {
      energy: 3920.4,
      unit: 'Watts',
      method: 'formula',
      type: 'wind',
      inputs: {
        area: '8000',
        airDensity: '1.240',
        velocity: '7.8',
        cp: '0.42',
        efficiency: '0.90',
        temperature: '12',
        altitude: '11',
        turbulence: '0.12'
      }
    }
  },
  {
    name: 'Amritsar',
    country: 'India',
    flag: '🇮🇳',
    coordinates: '31.6°N, 74.9°E',
    climate: 'Semi-arid, extreme seasons',
    solar: {
      energy: 38.70,
      unit: 'kWh/day',
      method: 'formula',
      type: 'solar',
      inputs: {
        area: '50',
        efficiency: '0.19',
        irradiance: '5.4',
        pr: '0.75',
        temperature: '32',
        humidity: '40',
        cloudCover: '20'
      }
    },
    wind: {
      energy: 422.1,
      unit: 'Watts',
      method: 'formula',
      type: 'wind',
      inputs: {
        area: '8000',
        airDensity: '1.180',
        velocity: '4.2',
        cp: '0.35',
        efficiency: '0.88',
        temperature: '32',
        altitude: '234',
        turbulence: '0.16'
      }
    }
  },
  {
    name: 'Tokyo',
    country: 'Japan',
    flag: '🇯🇵',
    coordinates: '35.7°N, 139.7°E',
    climate: 'Humid subtropical, monsoon',
    solar: {
      energy: 27.00,
      unit: 'kWh/day',
      method: 'formula',
      type: 'solar',
      inputs: {
        area: '50',
        efficiency: '0.20',
        irradiance: '3.6',
        pr: '0.75',
        temperature: '22',
        humidity: '68',
        cloudCover: '40'
      }
    },
    wind: {
      energy: 1814.4,
      unit: 'Watts',
      method: 'formula',
      type: 'wind',
      inputs: {
        area: '8000',
        airDensity: '1.220',
        velocity: '5.8',
        cp: '0.38',
        efficiency: '0.90',
        temperature: '22',
        altitude: '40',
        turbulence: '0.15'
      }
    }
  },
  {
    name: 'Dubai',
    country: 'UAE',
    flag: '🇦🇪',
    coordinates: '25.3°N, 55.3°E',
    climate: 'Hot desert, intense sun',
    solar: {
      energy: 49.50,
      unit: 'kWh/day',
      method: 'formula',
      type: 'solar',
      inputs: {
        area: '50',
        efficiency: '0.20',
        irradiance: '6.6',
        pr: '0.75',
        temperature: '40',
        humidity: '55',
        cloudCover: '10'
      }
    },
    wind: {
      energy: 1058.4,
      unit: 'Watts',
      method: 'formula',
      type: 'wind',
      inputs: {
        area: '8000',
        airDensity: '1.150',
        velocity: '5.0',
        cp: '0.38',
        efficiency: '0.88',
        temperature: '40',
        altitude: '5',
        turbulence: '0.10'
      }
    }
  },
  {
    name: 'Sydney',
    country: 'Australia',
    flag: '🇦🇺',
    coordinates: '33.9°S, 151.2°E',
    climate: 'Oceanic, sunny',
    solar: {
      energy: 36.75,
      unit: 'kWh/day',
      method: 'formula',
      type: 'solar',
      inputs: {
        area: '50',
        efficiency: '0.20',
        irradiance: '5.0',
        pr: '0.735',
        temperature: '22',
        humidity: '60',
        cloudCover: '35'
      }
    },
    wind: {
      energy: 2857.6,
      unit: 'Watts',
      method: 'formula',
      type: 'wind',
      inputs: {
        area: '8000',
        airDensity: '1.225',
        velocity: '7.0',
        cp: '0.38',
        efficiency: '0.90',
        temperature: '22',
        altitude: '58',
        turbulence: '0.11'
      }
    }
  },
  {
    name: 'Mumbai',
    country: 'India',
    flag: '🇮🇳',
    coordinates: '19.1°N, 72.9°E',
    climate: 'Tropical, monsoon-heavy',
    solar: {
      energy: 35.25,
      unit: 'kWh/day',
      method: 'formula',
      type: 'solar',
      inputs: {
        area: '50',
        efficiency: '0.19',
        irradiance: '5.0',
        pr: '0.74',
        temperature: '30',
        humidity: '72',
        cloudCover: '35'
      }
    },
    wind: {
      energy: 1425.6,
      unit: 'Watts',
      method: 'formula',
      type: 'wind',
      inputs: {
        area: '8000',
        airDensity: '1.170',
        velocity: '5.5',
        cp: '0.36',
        efficiency: '0.90',
        temperature: '30',
        altitude: '14',
        turbulence: '0.17'
      }
    }
  }
];

export default cityPresets;
