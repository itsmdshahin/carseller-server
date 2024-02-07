// match from database authentication
require("dotenv").config();
 
const Bid = require("./models/BidModel"); // Update the path accordingly

const express = require("express");
const app = express(); 
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/user.model");
const CarDataAdmin = require("./models/addacars.model");
const SellmyCarData = require("./models/sellmycars.model");


const multer = require('multer');
const morgan = require('morgan');
const xssClean = require('xss-clean');
const rateLimit = require('express-rate-limit');


// this 2 port his for moggourl and server port
const DBURL = process.env.MONGO_URL;
const PORT = process.env.PORT || 5001;
const VITE_BASE_URI = process.env.VITE_BASE_URI;


const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const userRouter = require("./router/userRouter");
const getAllUser = require("./router/getAllUser");
const profileData = require("./router/profileData");
const CarDataFormAdmins = require("./router/Admin/CarDataFormAdmins");
const CarDataFormClient = require("./router/Admin/CarDataFormClient");
const SellMyCar = require("./router/sellmycar");
const Register = require("./router/Register");
const Login = require("./router/Login");
const addacar = require("./router/addacar"); 
const GETCALLDATALISTING = require("./router/GetCallDataListing");
const GetCallDataListing = require("./router/GetCallDataListing");
const CardataPreview = require("./router/CardataPreview");
const carRoutes = require("./router/carRoutes");
const Cars = require("./router/Brand/Cars");
const TransictionData = require("./controllers/TransictionData");
const bidPage = require("./controllers/bidPage");
const payment = require("./router/payment");
const router = require("./router/CRUD/router");
const JWT_SECRET = "jjkdjskdjkjdkdjkdjskdnsdsndskndj94949i4knfknfnie";

 

// 1 mintue multiple click handler
// const rateLimiter = rateLimit({
//   windowMs: 1 * 60 * 1000,
//   max: 1,
//   message: 'Too many request form this IP. please try after 2 minute',
// });


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(
  // {
  //   origin: 'http://127.0.0.1:5173',
  //   credentials: true
  // }
));
// morgan for middleware
app.use(morgan('dev')); 
app.use(xssClean());  
// app.use(rateLimiter); // click handler function 


const isLoggedIn = (req, res, next) => {
  console.log("LogIn Middle ware");
  const loggin = true;
  if (loggin) {
    next();
  }
  else {
    return res.status(401).json({
      message: 'Please login first'
    });
  }
}


app.use(router);
// User Router 
app.use(userRouter); 
// call for get all users
app.use(getAllUser);

app.use(profileData);
// GET ALL ADMIN CAR DATA 
app.use(CarDataFormAdmins);
// GET ALL CLIENT CAR DATA 
app.use(CarDataFormClient);
// as a register
app.use(Register);
// Login in API 
app.use(Login);
// for google singup import from auth 

/// user DATA
app.post('/userData', async (req, res) => {
  const { token } = req.body;
  try {
    const user = jwt.verify(token, JWT_SECRET);
    console.log(user);
    res.json(user); // Send the user object back to the client
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Token verification failed" });
  }

})

// add the payment api
app.use(TransictionData);

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
// ADD A CAR FOR ADMIN PANELL

app.use(addacar);  
// add car for every client
app.use(SellMyCar);
// API for GET all data from carlisting 
app.use(GetCallDataListing); 
app.use(Cars);
app.use(CardataPreview);
app.use(bidPage);

// adding payment apiendpoint
app.use('/api', payment);
// car


app.get('/vehicle-value', async (req, res) => {
  const vin = req.query.vin;
  const apiKey = 'u37rz3hcp_0s7baaji9_78ub2ujlx'; // Securely stored
  const apiUrl = 'https://api.carsxe.com/marketvalue';

  try {
      const response = await axios.get(apiUrl, {
          params: {
              key: apiKey,
              vin: vin,
          },
      });
      res.json(response.data);
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
});

mongoose.connect(DBURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("DATABASE IS CONNECTED ! ");
  })
  .catch((error) => {
    // console.log(status);
    console.log("NOT DataBase CONNECTED " + error);
    process.exit(1);
  });



// default message for server
app.use('/', (req, res) => {
  res.status(200).json({
    message: "WELCOME TO CARSELLERONLINE",
  })
});

// server error handling
app.use((err, req, res, next) => {
  res.status(500).json({
    message: " Something Error! ",
  });
});

// server error handling
app.use((req, res, next) => {
  res.status(404).json({
    message: "Route not Found!",
  })
});

app.listen(PORT, () => {
  console.log(`Server is ${VITE_BASE_URI}${PORT}`);
});

