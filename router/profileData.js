const User = require('../models/user.model');
const express = require('express');
const profileData = express.Router();


// INDIVIDUAL PROFILE DATA
profileData.get("/profile/:id", async (req, res) => {
    const userId = req.params.id;
    try {
      const userProfile = await User.findById(userId);
      if (!userProfile) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(userProfile);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

module.exports = profileData;
