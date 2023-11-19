const CarDataAdmin = require('../../models/addacars.model');
const express = require('express');
const CarDataFormAdmins = express.Router();


// GET ALL ADMIN CAR DATA 
CarDataFormAdmins.use('/api/CarDataFormAdmins', async (req, res) => {
    try {
      const CarAllDataAdmins = await CarDataAdmin.find();
      res.json(CarAllDataAdmins);
    }
    catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
module.exports = CarDataFormAdmins;