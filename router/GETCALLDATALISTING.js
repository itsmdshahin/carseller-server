const express = require('express');
const sellmycarsModel = require('../models/sellmycars.model');
const GetCallDataListing = express.Router();

GetCallDataListing.get('/api/getcalldatalisting', async (req, res) => {
    try {
        const GetAllCarData = await sellmycarsModel.find({});
        res.send({ status: "OK", data: GetAllCarData });
        console.log("ALL IS WELL");
    } catch (error) {
        console.log("This error is coming from GetCallDataListing and it is: " + error);
        res.status(500).send({ status: "Error", message: "Internal Server Error" });
    }
});


module.exports = GetCallDataListing;
