const express = require('express');
const TransictionDataModel = require('../models/TransictionData.model');

const TransictionData = express.Router();

TransictionData.post('/api/payment/transiction', async (req, res) => {
    try {
        const {
            seller,
            buyer,
            transiction,
            amount,
            status,
            date
        } = req.body;
        const TransictionList = new TransictionDataModel({
            seller,
            buyer,
            transiction,
            amount,
            status,
            date
        });
        console.log(TransictionList);
        await TransictionList.save();
        res.status(201).json({ message: 'Transaction added successfully', data: TransictionList });
    } catch (error) {
        console.error('Error transaction:', error);
        // Return a 400 Bad Request status with an error message
        res.status(400).json({
            message: 'Invalid JSON data in the request',
            error: error.message, // Include the error message in the response
        });
    }
});

TransictionData.get('/api/payment/transiction', async (req, res) => {
    try {
        const TransictionAllList = await TransictionDataModel.find({});
        res.json(TransictionAllList);
        console.log('Successfully handled GET request on server!');
    } catch (error) {
        console.error('Error transaction:', error);
        // Return a 400 Bad Request status with an error message
        res.status(400).json({
            message: 'Invalid JSON data in the request',
            error: error.message, // Include the error message in the response
        });
    }
});

TransictionData.delete('/api/payment/transiction/:id', async (req, res) => {
    try {
        const DeleteTransictionList = await TransictionDataModel.findByIdAndDelete(req.params.id);
        if (!DeleteTransictionList) {
            return res.status(404).json({ error: 'Payment not found' });
        }
        res.json({ message: 'Payment deleted successfully' });
    } catch (error) {
        console.error('Error transaction:', error);
        // Return a 400 Bad Request status with an error message
        res.status(400).json({
            message: 'Invalid JSON data in the request',
            error: error.message, // Include the error message in the response
        });
    }
});

module.exports = TransictionData;
