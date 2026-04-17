import mongoose from 'mongoose';

const predictionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['solar', 'wind'],
    required: true
  },
  inputs: {
    // Solar: area, efficiency, irradiance, pr
    // Wind: area, airDensity, velocity, cp, efficiency
    type: Object,
    required: true
  },
  result: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    default: 'kWh'
  }
}, {
  timestamps: true
});

export default mongoose.model('Prediction', predictionSchema);
