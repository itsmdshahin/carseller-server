const mongoose = require("mongoose");

const SellmyCarSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: true,
  },
  model: {
    type: String,
    // required: true,
  },
  year: {
    type: String,
    // required: true,
  },
  color: {
    type: String,
    // required: true,
  },
  bodytype: {
    type: String,
    // required: true,
  },
  mileages: {
    type: String,
    // required: true,
  },
  condition: {
    type: String,
    // required: true,
  },
  vin: {
    type: String,
    // required: true,
  },
  stocknumber: {
    type: String,
    // required: true,
  },
  fueltype: {
    type: String,
    // // required: true,
  },
  gasmileages: {
    type: String,
    // required: true,
  },
  fueltanksize: {
    type: String,
    // required: true,
  },
  transmission: {
    type: String,
    // required: true,
  },
  Engine: {
    type: String,
    // required: true,
  },
  Horsepower: {
    type: String,
    // required: true,
  },
  Doors: {
    type: String,
    // required: true,
  },
  Brand: {
    type: String,
    // required: true,
  },
  price: {
    type: String,
    // required: true,
  },
  picture: {
    type: Buffer, // Store image as binary data
  },
  gallery: {
    type: [Buffer], // Store multiple images as an array of binary data
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("sellmycars", SellmyCarSchema);