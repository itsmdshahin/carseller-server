// BidModel.js
const mongoose = require('mongoose');


const BidSchema = new mongoose.Schema({ 
    bidAmount: { type: String, required: true },
    carId: { type: String, required: true },
    bidderUserId: { type: String, required: true },
    bidTime: { type: Date, default: Date.now },
});


const BidSchemaModel = mongoose.model('Bid', BidSchema);


module.exports = { BidSchemaModel };
