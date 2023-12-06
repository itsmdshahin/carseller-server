const mongoose = require("mongoose");

const TransictionData = new mongoose.Schema({
  userId:{
    type: String,
  }, 
  seller:{
    type:String,
  },
  transiction:{
    type:String,
  },
  buyer:{
    type:String,
  },
  amount:{
    type:String,
  },
  status:{
    type:String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("TransictionData", TransictionData);