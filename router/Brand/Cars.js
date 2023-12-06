const express = require('express');
const Cars = express.Router();
const Car = require('../../models/addacars.model');


Cars.get('/api/cars', async (req, res) => {
    try {
      const cars = await Car.find();
      res.json(cars);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

module.exports = Cars;