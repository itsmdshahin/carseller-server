const express = require('express');
const Register = express.Router();
const User = require('../models/user.model');

const bcrypt = require("bcryptjs")

// as a register
Register.post("/register", async (req, res) => {
    const { email, password, name, mobile } = req.body;
    const encryptedPassword = await bcrypt.hash(password, 10);
    try {
      // console.log(email +" === "+ password);
      const oldUser = await User.findOne({ email });
      if (oldUser) {
        return res.send({ error: "User Already Exists!" });
      }
      const newUser = new User({
        email,
        password: encryptedPassword,
        name,
        mobile
      });
      await newUser.save();
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json(error.message);
    }
  });
  
module.exports = Register;
