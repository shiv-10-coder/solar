const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
// This runs BEFORE protected routes
// It checks the Authorization header for a valid token
const auth = (req, res, next) => {
  try {
    // Get token from header (format: "Bearer <token>")
    const token = req.header('Authorization').replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify the token using our secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach userId to request so routes can use it
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth;
