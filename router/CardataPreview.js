const SellmyCarData = require('../models/sellmycars.model');
const express = require('express');
const CardataPreview = express.Router();

CardataPreview.get('/api/getcalldatalisting/:carId', async (req, res) => {
  const carId = req.params.carId;
  try {
    const carProfile = await SellmyCarData.findById(carId);
    if (!carProfile) {
      return res.status(404).json({ error: 'Car not found' });
    }
    // Assuming carData is obtained or processed somehow
    const carData = {}; // Adjust this line based on how you get carData
    // Adjust the response format based on your needs
    res.json({ data: carData, carProfile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

CardataPreview.put('/api/getcalldatalisting/:carId', async (req, res) => {
  const carId = req.params.carId;

  try {
    const carProfile = await SellmyCarData.findById(carId);

    if (!carProfile) {
      return res.status(404).json({ error: 'Car not found' });
    }

    // Assuming carPrice is part of carProfile, adjust this based on your actual data structure
    const carPrice = carProfile.price;

    // Assuming userId is passed as a header or part of the request
    const userId = req.headers.userid;

    const updatedCar = await sellmycarsModel.findByIdAndUpdate(
      carId,
      { price: carPrice },
      { new: true }
    );

    // Adjust the response format based on your needs
    res.json({ success: true, updatedCar });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// INDIVIDUAL CAR DATA

module.exports = CardataPreview;
