// ═══════════════════════════════════════════════════════════════
// PURE JAVASCRIPT NEURAL NETWORK
// No native dependencies — works everywhere in Node.js
// Implements a feedforward NN with backpropagation
// ═══════════════════════════════════════════════════════════════

export class NeuralNetwork {
  constructor(layers) {
    // layers = [inputSize, hidden1, hidden2, ..., outputSize]
    this.layers = layers;
    this.weights = [];
    this.biases = [];
    this.trainingInfo = {};

    // Xavier initialization
    for (let i = 0; i < layers.length - 1; i++) {
      const scale = Math.sqrt(2 / (layers[i] + layers[i + 1]));
      const w = Array.from({ length: layers[i] }, () =>
        Array.from({ length: layers[i + 1] }, () => (Math.random() * 2 - 1) * scale)
      );
      const b = Array.from({ length: layers[i + 1] }, () => 0);
      this.weights.push(w);
      this.biases.push(b);
    }
  }

  // Activation functions
  relu(x) { return Math.max(0, x); }
  reluDeriv(x) { return x > 0 ? 1 : 0; }
  sigmoid(x) { return 1 / (1 + Math.exp(-Math.max(-500, Math.min(500, x)))); }
  sigmoidDeriv(x) { const s = this.sigmoid(x); return s * (1 - s); }

  // Forward pass
  forward(input) {
    let activations = [input];
    let preActivations = [input];

    for (let l = 0; l < this.weights.length; l++) {
      const prev = activations[activations.length - 1];
      const z = [];
      const a = [];

      for (let j = 0; j < this.weights[l][0].length; j++) {
        let sum = this.biases[l][j];
        for (let i = 0; i < prev.length; i++) {
          sum += prev[i] * this.weights[l][i][j];
        }
        z.push(sum);
        // Use ReLU for hidden layers, linear for output
        a.push(l < this.weights.length - 1 ? this.relu(sum) : sum);
      }
      preActivations.push(z);
      activations.push(a);
    }

    return { activations, preActivations };
  }

  predict(input) {
    const { activations } = this.forward(input);
    return activations[activations.length - 1];
  }

  // Training with backpropagation
  train(trainingData, options = {}) {
    const {
      epochs = 500,
      learningRate = 0.001,
      batchSize = 32,
      validationSplit = 0.15,
      verbose = true
    } = options;

    // Split data
    const shuffled = [...trainingData].sort(() => Math.random() - 0.5);
    const splitIdx = Math.floor(shuffled.length * (1 - validationSplit));
    const trainSet = shuffled.slice(0, splitIdx);
    const valSet = shuffled.slice(splitIdx);

    let bestValLoss = Infinity;
    let patience = 50;
    let patienceCounter = 0;
    const history = { trainLoss: [], valLoss: [] };

    for (let epoch = 0; epoch < epochs; epoch++) {
      // Shuffle training data each epoch
      trainSet.sort(() => Math.random() - 0.5);
      let epochLoss = 0;

      // Mini-batch training
      for (let b = 0; b < trainSet.length; b += batchSize) {
        const batch = trainSet.slice(b, b + batchSize);
        const gradW = this.weights.map(w => w.map(row => row.map(() => 0)));
        const gradB = this.biases.map(b => b.map(() => 0));

        for (const sample of batch) {
          const { activations, preActivations } = this.forward(sample.input);
          const output = activations[activations.length - 1];
          const error = output.map((o, i) => o - sample.output[i]);
          epochLoss += error.reduce((s, e) => s + e * e, 0);

          // Backpropagation
          let delta = error; // For linear output layer

          for (let l = this.weights.length - 1; l >= 0; l--) {
            const prevAct = activations[l];
            const nextDelta = [];

            // Accumulate gradients
            for (let j = 0; j < delta.length; j++) {
              gradB[l][j] += delta[j];
              for (let i = 0; i < prevAct.length; i++) {
                gradW[l][i][j] += prevAct[i] * delta[j];
              }
            }

            // Propagate delta backward (skip for input layer)
            if (l > 0) {
              for (let i = 0; i < this.weights[l].length; i++) {
                let sum = 0;
                for (let j = 0; j < delta.length; j++) {
                  sum += this.weights[l][i][j] * delta[j];
                }
                nextDelta.push(sum * this.reluDeriv(preActivations[l][i]));
              }
              delta = nextDelta;
            }
          }

          // Update weights
          const lr = learningRate / batch.length;
          for (let l = 0; l < this.weights.length; l++) {
            for (let i = 0; i < this.weights[l].length; i++) {
              for (let j = 0; j < this.weights[l][i].length; j++) {
                this.weights[l][i][j] -= lr * gradW[l][i][j];
              }
            }
            for (let j = 0; j < this.biases[l].length; j++) {
              this.biases[l][j] -= lr * gradB[l][j];
            }
          }
        }
      }

      epochLoss /= trainSet.length;

      // Validation loss
      let valLoss = 0;
      for (const sample of valSet) {
        const pred = this.predict(sample.input);
        valLoss += pred.reduce((s, p, i) => s + Math.pow(p - sample.output[i], 2), 0);
      }
      valLoss /= valSet.length;

      history.trainLoss.push(epochLoss);
      history.valLoss.push(valLoss);

      // Early stopping
      if (valLoss < bestValLoss) {
        bestValLoss = valLoss;
        patienceCounter = 0;
      } else {
        patienceCounter++;
        if (patienceCounter >= patience) {
          if (verbose) console.log(`   ⏹ Early stopping at epoch ${epoch + 1}`);
          break;
        }
      }

      if (verbose && (epoch + 1) % 50 === 0) {
        console.log(`   Epoch ${epoch + 1}: trainLoss=${epochLoss.toFixed(6)} valLoss=${valLoss.toFixed(6)}`);
      }
    }

    this.trainingInfo = {
      finalTrainLoss: history.trainLoss[history.trainLoss.length - 1],
      finalValLoss: history.valLoss[history.valLoss.length - 1],
      epochs: history.trainLoss.length,
      trainSamples: trainSet.length,
      valSamples: valSet.length
    };

    return history;
  }

  // Export/import model
  toJSON() {
    return { layers: this.layers, weights: this.weights, biases: this.biases, trainingInfo: this.trainingInfo };
  }

  static fromJSON(json) {
    const nn = new NeuralNetwork(json.layers);
    nn.weights = json.weights;
    nn.biases = json.biases;
    nn.trainingInfo = json.trainingInfo || {};
    return nn;
  }
}

// ═══════════════════════════════════════════════════════════════
// DATA NORMALIZER
// ═══════════════════════════════════════════════════════════════

export class Normalizer {
  constructor() {
    this.mins = {};
    this.maxs = {};
    this.keys = [];
  }

  fit(data, keys) {
    this.keys = keys;
    keys.forEach(key => {
      const values = data.map(d => d[key]);
      this.mins[key] = Math.min(...values);
      this.maxs[key] = Math.max(...values);
    });
  }

  normalize(obj) {
    return this.keys.map(key => {
      const range = this.maxs[key] - this.mins[key];
      return range === 0 ? 0 : (obj[key] - this.mins[key]) / range;
    });
  }

  denormalize(value, key) {
    return value * (this.maxs[key] - this.mins[key]) + this.mins[key];
  }

  toJSON() {
    return { mins: this.mins, maxs: this.maxs, keys: this.keys };
  }

  static fromJSON(json) {
    const n = new Normalizer();
    n.mins = json.mins;
    n.maxs = json.maxs;
    n.keys = json.keys;
    return n;
  }
}
