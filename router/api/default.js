const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());



// default message for server
app.use('/', (req, res) => {
    res.status(200).json({
        message: "WELCOME TO CARSELLERONLINE",
    })
});

module.exports = default;
