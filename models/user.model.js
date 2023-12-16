const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  conpassword: {
    type: String,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
  mobile: {
    type: String,
    require: true,
  },
  lastName: {
    type: String,
    // require: true,
  },
  firstName: {
    type: String,
    // require: true,
  },
  age: {
    type: String,
  },
  status: {
    type: Boolean,
  },
  otp: String, // Store the OTP here
  isVerified: { type: Boolean, default: false },
  createdOn: {
    type: Date,
    default: Date.now,
  },
});


module.exports = mongoose.model("user", userSchema);