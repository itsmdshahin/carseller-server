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

// API endpoint to retrieve the highest bidder for a specific carId
bidPage.get('/api/get-highest-bid/:carId', async (req, res) => {
  try {
    const carId = req.params.carId;
    const highestBid = await BidSchemaModel
      .findOne({ carId })
      .sort({ bidAmount: -1 }) // Sort in descending order to get the highest bid first

    res.json(highestBid);
    console.log(`Successfully handled GET request for the highest bid of carId: ${carId}`);
  } catch (error) {
    console.error(`Error retrieving the highest bid for carId ${carId}:`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

bidPage.get('/api/get-all-bids', async (req, res) => {
  const { bidderUserId } = req.query; // Get bidderUserId from query parameters

  try {
    let query = {};
    if (bidderUserId) query.bidderUserId = bidderUserId; // Filter by bidderUserId if provided

    const allBidList = await BidSchemaModel.find(query);
    res.json(allBidList);
  } catch (error) {
    console.error('Error retrieving bids:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

bidPage.get('/api/get-top-bidders', async (req, res) => {
  try {
      const topBidders = await BidSchemaModel.aggregate([
          {
              $group: {
                  _id: '$bidderUserId',
                  totalAmount: { $sum: { $convert: { input: "$bidAmount", to: "decimal" } } }
              }
          },
          { $sort: { totalAmount: -1 } },
          { $limit: 5 }
      ]);

      res.json(topBidders);
  } catch (error) {
      console.error('Error retrieving top bidders:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});
module.exports = bidPage;
