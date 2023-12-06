const express = require('express');
const SellMyCar = express.Router();
const SellmyCarData = require("../models/sellmycars.model");



SellMyCar.post('/api/sellmycar', async (req, res) => {

  const {
    userId,
    name,
    model,
    year,
    color,
    bodytype,
    mileages,
    condition,
    vin,
    stocknumber,
    fueltype,
    gasmileages,
    fueltanksize,
    transmission,
    Engine,
    Horsepower,
    Doors,
    picture,
    gallery,
    Brand,
    price } = req.body;

  try {
    const carData = new SellmyCarData({
      userId,
      name,
      model,
      year,
      color,
      bodytype,
      mileages,
      condition,
      vin,
      stocknumber,
      fueltype,
      gasmileages,
      fueltanksize,
      transmission,
      Engine,
      Horsepower,
      Doors,
      picture,
      gallery,
      Brand,
      price
    });
    await carData.save();
    console.log("RES : " + req.params.id);
    res.status(201).json(carData);

    // res.status(201).json({ message: 'Car added successfully' });
  } catch (error) {
    console.error('Error adding car:', error);
    // Return a 400 Bad Request status with an error message
    res.status(400).json({
      message: 'Invalid JSON data in the request',
      error: error.message, // Include the error message in the response
    });
  }
});

SellMyCar.get('/api/sellmycar', async (req, res) => {
  try {
    const AllCarList = await SellmyCarData.find();
    res.json(AllCarList);
    console.log('Successfully handled GET request on server!');
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


SellMyCar.delete('/api/sellmycar/:id', async (req, res) => {
  try {
    const deletecars = await SellmyCarData.findByIdAndDelete(req.params.id);

    if (!deletecars) {
      return res.status(404).json({ error: 'Car not found' });
    }
    res.json({ message: 'Car deleted successfully' });

  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ error: 'Invalid request data' });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});


module.exports = SellMyCar;
