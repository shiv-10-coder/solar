# ⚡ EnergyPredict — Wind & Solar Energy Prediction

A full **MERN Stack** application for predicting wind and solar energy availability, featuring **ML-powered predictions** trained on real-world data.

## 🏗️ Project Structure

```
SEM4_Project/
├── client/               # React Frontend (Vite)
│   └── src/
│       ├── components/   # Navbar, Forms, Charts, etc.
│       ├── pages/        # Home, Login, Signup, Dashboard, etc.
│       ├── context/      # Auth Context (JWT)
│       └── App.jsx       # Main app with routing
├── server/               # Express.js Backend
│   ├── models/           # Mongoose schemas (User, Prediction, Contact)
│   ├── routes/           # API routes (auth, predict, contact)
│   ├── middleware/        # JWT auth middleware
│   ├── ml/               # Neural network & trainer
│   └── data/             # Training data generator
├── package.json          # Root workspace scripts
└── README.md
```

## 🚀 Quick Start

```bash
# Install all dependencies
cd server && npm install
cd ../client && npm install

# Terminal 1 — Start backend (trains ML models on startup)
cd server && npm run dev

# Terminal 2 — Start frontend
cd client && npm run dev
```

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000

## 🧠 ML Features

- **600+ solar** and **600+ wind** training data points
- Custom **Neural Network** (pure JavaScript, no native deps)
- Solar model: `7→32→16→1` | Wind model: `8→48→24→1`
- Environmental factors: temperature, humidity, cloud cover, altitude, turbulence
- **Formula vs ML** comparison on results page

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React (JSX), Vite, Chart.js |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcrypt |
| ML | Custom Neural Network (brain) |
| Theme | Neon Glow Dark Theme |
