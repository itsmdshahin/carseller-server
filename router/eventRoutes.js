const express = require('express');
const EventRegistration = require('../models/EventRegistrationSchema'); // Update the path to your EventRegistration model

const eventRoutes = express.Router();

// Route for event registration
eventRoutes.post('/eventregistrations', async (req, res) => {
  const { name, email, phone } = req.body;

  try {
    const newRegistration = await EventRegistration.create({ name, email, phone });
    res.status(201).json(newRegistration);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registering for event' });
  }
});

// Route to list all registrations (for admin)
eventRoutes.get('/eventregistrations', async (req, res) => {
  try {
    const registrations = await EventRegistration.find();
    res.json(registrations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching registrations' });
  }
});

module.exports = eventRoutes;
