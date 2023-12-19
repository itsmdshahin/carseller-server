const express = require('express');
const addacarsModel = require('../models/addacars.model');

const addacar = express.Router(); // Define addacar first

addacar.post('/api/addacar', async (req, res) => {
    const {
        name,
        model,
        year,
        color,
        bodytype,
        mileages,
        condition,
        vin,
        stocknumber,
        fueltype,
        gasmileages,
        fueltanksize,
        transmission,
        engine,
        Horsepower,
        Doors,
        picture,
        gallery,
        Brand,
        price
    } = req.body;

    try {
        const CarDataAdmin = new addacarsModel({
            name,
            model,
            year,
            color,
            bodytype,
            mileages,
            condition,
            vin,
            stocknumber,
            fueltype,
            gasmileages,
            fueltanksize,
            transmission,
            engine,
            Horsepower,
            Doors,
            picture,
            gallery,
            Brand,
            price,
        });
        console.log(CarDataAdmin);
        await CarDataAdmin.save();
        // res.status(201).json(CarDataAdmin);
        res.status(201).json({ message: 'Car added successfully', data: CarDataAdmin });

    } catch (error) {
        console.error('Error adding car:', error);
        // Return a 400 Bad Request status with an error message
        res.status(400).json({
            message: 'Invalid JSON data in the request',
            error: error.message, // Include the error message in the response
        });
    }
});

addacar.get('/api/addacar', async (req, res) => {
    try {
        const AllCarList = await addacarsModel.find();
        res.json(AllCarList);
        console.log('Successfully handled GET request on server!');
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

addacar.put('/api/addacar/:id', async (req, res) => {
    try {
        const {
            name,
            model,
            year,
            color,
            bodytype,
            mileages,
            condition,
            vin,
            stocknumber,
            fueltype,
            gasmileages,
            fueltanksize,
            transmission,
            engine,
            Horsepower,
            Doors,
            picture,
            gallery,
            Brand,
            price
        } = req.body;
        console.log(name);
        const updatecars = await addacarsModel.findByIdAndUpdate(
            req.params.id,
            {
                name,
                model,
                year,
                color,
                bodytype,
                mileages,
                condition,
                vin,
                stocknumber,
                fueltype,
                gasmileages,
                fueltanksize,
                transmission,
                engine,
                Horsepower,
                Doors,
                picture,
                gallery,
                Brand,
                price
            },
            { new: true }
        );

        if (!updatecars) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json(updatecars);
        console.log('Updated the Database');
    } catch (error) {
        if (error.name === 'ValidationError') {
            res.status(400).json({ error: 'Invalid request data' });
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});

addacar.delete('/api/addacar/:id', async (req, res) => {
    try {
        const deletecars = await addacarsModel.findByIdAndDelete(req.params.id);

        if (!deletecars) {
            return res.status(404).json({ error: 'Car not found' });
        } 
        res.json({ message: 'Car deleted successfully' });

    } catch (error) {
        if (error.name === 'ValidationError') {
            res.status(400).json({ error: 'Invalid request data' });
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});


module.exports = addacar;