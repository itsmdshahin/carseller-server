const express = require('express');
const router = express.Router();
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

module.exports = router;