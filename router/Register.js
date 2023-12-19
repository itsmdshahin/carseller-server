const express = require('express');
const Register = express.Router();
const User = require('../models/user.model');

const bcrypt = require("bcryptjs")
const nodemailer = require('nodemailer');

const generateOTP = () => {
  // Implement OTP generation logic (e.g., using a library)
  const otp = Math.floor(1000 + Math.random() * 9000);
  return otp.toString();
};

const sendOTPEmail = (userEmail, otp) => {
  // Implement logic to send OTP to the user's email
  // You may use nodemailer or any other email sending service
  console.log(`Sending OTP ${otp} to ${userEmail}`);
  // ... code to send the OTP email
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Use the appropriate email service
    auth: {
      user: 'shahinur548@gmail.com', // Your email address
      pass: 'xmrq uees btwt qqmu', // Your email password or app-specific password
    },
  });

  // Define the email options
  const mailOptions = {
    from: 'shahinur548@gmail.com', // Sender email address
    to: userEmail, // Recipient email address
    subject: 'OTP Verification for Car Seller Online', // Email subject
    text: `Your OTP for verification is: ${otp}`, // Email body
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending OTP email:', error);
    } else {
      console.log('OTP email sent:', info.response);
    }
  });
};

// as a register
Register.post("/register", async (req, res) => {
  const { email, password, name, mobile } = req.body;
  const encryptedPassword = await bcrypt.hash(password, 10);
  const otp = "0000";
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
      mobile,
      otp
    });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json(error.message);
  }
});


Register.post('/sendOTP', async (req, res) => {
  // Extract user data from the request body (e.g., userId, userEmail)
  const { userId, userEmail } = req.body;
  try {
    // Generate OTP and send it to the user's email
    const otp = generateOTP(); // You need to implement this function
    sendOTPEmail(userEmail, otp); // You need to implement this function
    const user = await User.findById(userId);
    if (user) {
        user.otp = otp;
        await user.save();
    }
    const response = await axios.post(
      'http://localhost:5000/sendOTP',
      {
        userId: userId,
        userEmail: userEmail,
        otp: otp, // Include the generated OTP in the request
      }
    );
    if (response.status === 200) {
      console.log('OTP request sent successfully.');
    } else {
      console.error('Error sending OTP request:', response.status);
    }
    // Respond to the client
    res.status(200).json({ message: 'OTP sent successfully' });
  }
  catch (error) {
    console.error('Error during OTP request:', error);
    // Handle error, if needed
  }
});

Register.post('/verifyOTP', async (req, res) => {
  const { userId, otp } = req.body;

  try {
      const user = await User.findById(userId);
      console.log("This is "+user.otp +" The otp "+ otp)

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      if (user.otp === otp) {
          user.isVerified = true;
          await user.save();
          res.status(200).json({ message: 'OTP verified successfully' });
      } else {
          res.status(400).json({ message: 'Invalid OTP' });
      }
  } catch (error) {
      console.error('Error during OTP verification:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});



module.exports = Register;
