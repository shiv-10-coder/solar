const express = require('express');
const Contact = require('../models/Contact');

const router = express.Router();

// POST /api/contact - Save a contact form submission
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Save contact message to database
    const contact = new Contact({ name, email, message });
    await contact.save();

    res.status(201).json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Contact error:', error);
    res.status(500).json({ message: 'Error sending message' });
  }
});

module.exports = router;
