const express = require('express');
const userRouter = express.Router();
const User = require('../models/user.model');


userRouter.get('/api/users', async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  

  module.exports = userRouter;