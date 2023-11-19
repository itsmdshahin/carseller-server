const express = require('express');
const AddACar = express.Router();
const CarDataAdmin = require("../models/addacars.model");



AddACar.post('/api/addacar', async (req, res) => {
    const {
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
      const CarDataforAdmin = new CarDataAdmin({
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
        Brand,
        picture,
        gallery,
        price
      });
      db.addacars.dropIndex("email_1")
      db.addacars.createIndex({email: 1}, {unique: true})

      await CarDataforAdmin.save();
      res.status(201).json(CarDataforAdmin);
  
    } catch (error) {
      console.error('Error adding car:', error);
      // Return a 400 Bad Request status with an error message
      res.status(400).json({
        message: 'Invalid JSON data in the request',
        error: error.message, // Include the error message in the response
      });
    }
  });
  
module.exports  = AddACar;