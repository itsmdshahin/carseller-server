const express = require('express');
const router = express.Router();

const SellmyCarData = require('../../models/sellmycars.model'); 
const SellmyCarSchema = require('../../models/sellmycars.model');
const addaCarSchema = require('../../models/addacars.model'); 
  

// Update a task by its id 
router.put('/api/car/:id', async (req, res) => {
    try {
        const { title, description, status, dueDate } = req.body;
        console.log(title);
        const task = await taskManagementSchema.findByIdAndUpdate(
            req.params.id,
            {
                title,
                description,
                status,
                dueDate
            },
            { new: true }
        );

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json(task);
        console.log('Updated the Database');
    } catch (error) {
        if (error.name === 'ValidationError') {
            res.status(400).json({ error: 'Invalid request data' });
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});

// Delete a task by its id 

router.delete('/api/car/:id', async (req, res) => {
    try {
        const task = await taskManagementSchema.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// Ensure this path matches your file structure

// Update car data
router.put('/api/updatecar/:carId', async (req, res) => {
    const { carId } = req.params;
    const updateData = req.body; // This contains the data you want to update

    try {
        const updatedCar = await SellmyCarData.findByIdAndUpdate(carId, updateData, { new: true });
        if (!updatedCar) {
            return res.status(404).json({ message: 'Car not found' });
        }
        res.json({ message: 'Car updated successfully', updatedCar });
    }  catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
      }
});

// Delete car data
router.delete('/api/deletecar/:carId', async (req, res) => {
    const { carId } = req.params;

    try {
        const car = await SellmyCarData.findByIdAndRemove(carId);
        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }
        res.json({ message: 'Car deleted successfully' });
    } catch (error) {
        console.error('Delete Car Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
  

module.exports = router;