const express = require('express');
const Login = express.Router();
const User = require('../models/user.model');


const bcrypt = require("bcryptjs")
const JWT_SECRET = "jjkdjskdjkjdkdjkdjskdnsdsndskndj94949i4knfknfnie";
const jwt = require("jsonwebtoken");


Login.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email: email });
      // console.log(email+" "+password+" "+user);
  
      console.log("This is Status : " + res.status);
      if (!user) {
        return res.status(404).json({ status: "USER NOT FOUND!" });
      }
      if (await bcrypt.compare(password, user.password)) {
        const userInfo = {
          id: user._id, // Assuming the user's ID is stored in the _id field
          email: user.email,
        };
        // Create the JWT token with the payload
        const token = jwt.sign(userInfo, JWT_SECRET);
        return res.status(200).json({ status: "valid user", data: token, id: userInfo.id, email: userInfo.email });
  
        // const token = jwt.sign({ email: user.email }, JWT_SECRET);
        // return res.status(200).json({ status: "valid user", data: token });
      }
      else {
        return res.status(401).json({ status: "Error", error: "Invaild Password!" });
      }
    } catch (error) {
      res.status(500).json(error.message);
    }
  });
  
module.exports = Login;