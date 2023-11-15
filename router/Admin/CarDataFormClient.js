const SellmyCarData = require('../../models/sellmycars.model');
const express = require('express');
const CarDataFormClient = express.Router();


// GET ALL CLIENT CAR DATA 
CarDataFormClient.use('/api/CarDataFormClient', async (req, res) => {
    try {
      const CarAllDataClient = await SellmyCarData.find();
      res.json(CarAllDataClient);
    }
    catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

module.exports = CarDataFormClient;