const mongoose = require('mongoose');

// Prediction schema - stores each energy prediction made by users
const predictionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',        // Links to the User who made this prediction
    required: true
  },
  type: {
    type: String,
    enum: ['solar', 'wind'],   // Only allows 'solar' or 'wind'
    required: true
  },
  inputs: {
    type: Object,        // Stores all input parameters (area, efficiency, etc.)
    required: true
  },
  result: {
    type: Number,        // The calculated energy value
    required: true
  },
  unit: {
    type: String,
    default: 'kWh'
  }
}, {
  timestamps: true       // Adds createdAt and updatedAt
});

module.exports = mongoose.model('Prediction', predictionSchema);
