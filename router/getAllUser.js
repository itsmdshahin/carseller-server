
const User = require('../models/user.model');
const express = require('express');
const getAllUser = express.Router();

// get userlist in admin
getAllUser.get("/getAllUser", async (req, res) => {
    try {
        const alluser = await User.find({});
        res.send({ status: "ok", data: alluser });
        console.log("OK DONE !");
    } catch (error) {
        console.log(error);
    }
});


module.exports = getAllUser;
