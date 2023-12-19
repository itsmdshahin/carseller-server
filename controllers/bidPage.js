const express = require('express');
const bidPage = express.Router();
const { BidSchemaModel } = require('../models/BidModel');

// API endpoint to place a bid
bidPage.post('/api/place-bid', async (req, res) => {
    try {
      const { carId, bidAmount, bidderUserId } = req.body;
  
      // Check if required fields are provided
      if (!carId || !bidAmount || !bidderUserId) {
        return res.status(400).json({ error: 'carId, bidAmount, and bidderUserId are required.' });
      }
  
      const newBid = await BidSchemaModel.create({
        bidAmount: bidAmount,
        carId: carId,
        bidderUserId: bidderUserId,
      });
  
      res.json({ success: true, newBid });
      console.log("Successfully inserted new bid!");
  
    } catch (error) {
      console.error('Error placing bid:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

// API endpoint to retrieve all bids
bidPage.get('/api/get-all-bids', async (req, res) => {
  try {
    const allBidList = await BidSchemaModel.find({});
    res.json(allBidList);
    console.log('Successsfully handled GET request for all bids on the server!');
} catch (error) {
  console.error('Error retrieving bids:', error);
  res.status(500).json({ error: 'Internal Server Error' });
}
});


module.exports = bidPage;
