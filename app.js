// match from database authentication
require("dotenv").config();

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
const AddACar = require("./router/AddACar"); 
const GETCALLDATALISTING = require("./router/GetCallDataListing");
const GetCallDataListing = require("./router/GetCallDataListing");
const JWT_SECRET = "jjkdjskdjkjdkdjkdjskdnsdsndskndj94949i4knfknfnie";

 

// 1 mintue multiple click handler
// const rateLimiter = rateLimit({
//   windowMs: 1 * 60 * 1000,
//   max: 1,
//   message: 'Too many request form this IP. please try after 2 minute',
// });


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
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


// User Router 
app.use(userRouter);

// app.use('/api/users', rateLimiter, async (req, res) => {
//   try {
//     const users = await User.find();
//     res.json(users);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });


// call for get all users
app.use(getAllUser);

// // get userlist in admin
// app.get("/getAllUser", async (req, res) => {
//   try {
//     const alluser = await User.find({});
//     res.send({ status: "ok", data: alluser });
//   } catch (error) {
//     console.log(error);
//   }
// });


app.use(profileData);
// // INDIVIDUAL PROFILE DATA
// app.get("/profile/:id", async (req, res) => {
//   const userId = req.params.id;
//   try {
//     const userProfile = await User.findById(userId);
//     if (!userProfile) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     res.json(userProfile);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });



// GET ALL ADMIN CAR DATA 
app.use(CarDataFormAdmins);

// app.use('/api/CarDataFormAdmins', async (req, res) => {
//   try {
//     const CarAllDataAdmins = await CarDataAdmin.find();
//     res.json(CarAllDataAdmins);
//   }
//   catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });


// GET ALL CLIENT CAR DATA 
app.use(CarDataFormClient);


// app.use('/api/CarDataFormClient', async (req, res) => {
//   try {
//     const CarAllDataClient = await SellmyCarData.find();
//     res.json(CarAllDataClient);
//   }
//   catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });


// as a register
app.use(Register);

// app.post("/register", async (req, res) => {
//   const { email, password, name, mobile } = req.body;
//   const encryptedPassword = await bcrypt.hash(password, 10);
//   try {
//     // console.log(email +" === "+ password);
//     const oldUser = await User.findOne({ email });
//     if (oldUser) {
//       return res.send({ error: "User Already Exists!" });
//     }
//     const newUser = new User({
//       email,
//       password: encryptedPassword,
//       name,
//       mobile
//     });
//     await newUser.save();
//     res.status(201).json(newUser);
//   } catch (error) {
//     res.status(500).json(error.message);
//   }
// });

// Login in API 
app.use(Login);

// app.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email: email });
//     // console.log(email+" "+password+" "+user);

//     console.log("This is Status : " + res.status);
//     if (!user) {
//       return res.status(404).json({ status: "USER NOT FOUND!" });
//     }
//     if (await bcrypt.compare(password, user.password)) {
//       const userInfo = {
//         id: user._id, // Assuming the user's ID is stored in the _id field
//         email: user.email,
//       };
//       // Create the JWT token with the payload
//       const token = jwt.sign(userInfo, JWT_SECRET);
//       return res.status(200).json({ status: "valid user", data: token, id: userInfo.id, email: userInfo.email });

//       // const token = jwt.sign({ email: user.email }, JWT_SECRET);
//       // return res.status(200).json({ status: "valid user", data: token });
//     }
//     else {
//       return res.status(401).json({ status: "Error", error: "Invaild Password!" });
//     }
//   } catch (error) {
//     res.status(500).json(error.message);
//   }
// });

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




// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
// ADD A CAR FOR ADMIN PANELL

app.use(AddACar);
// app.post('/api/addacar', async (req, res) => {
//   const {
//     name,
//     model,
//     year,
//     color,
//     bodytype,
//     mileages,
//     condition,
//     vin,
//     stocknumber,
//     fueltype,
//     gasmileages,
//     fueltanksize,
//     transmission,
//     Engine,
//     Horsepower,
//     Doors,
//     picture,
//     gallery,
//     Brand,
//     price } = req.body;

//   try {
//     const CarDataforAdmin = new CarDataAdmin({
//       name,
//       model,
//       year,
//       color,
//       bodytype,
//       mileages,
//       condition,
//       vin,
//       stocknumber,
//       fueltype,
//       gasmileages,
//       fueltanksize,
//       transmission,
//       Engine,
//       Horsepower,
//       Doors,
//       Brand,
//       picture,
//       gallery,
//       price
//     });
//     await CarDataforAdmin.save();
//     res.status(201).json(CarDataforAdmin);

//   } catch (error) {
//     console.error('Error adding car:', error);
//     // Return a 400 Bad Request status with an error message
//     res.status(400).json({
//       message: 'Invalid JSON data in the request',
//       error: error.message, // Include the error message in the response
//     });
//   }
// });


// add car for every client

app.use(SellMyCar);

// app.post('/api/sellmycar', async (req, res) => {
//   const {
//     name,
//     model,
//     year,
//     color,
//     bodytype,
//     mileages,
//     condition,
//     vin,
//     stocknumber,
//     fueltype,
//     gasmileages,
//     fueltanksize,
//     transmission,
//     Engine,
//     Horsepower,
//     Doors,
//     picture,
//     gallery,
//     Brand,
//     price } = req.body;

//   try {
//     const carData = new SellmyCarData({
//       name,
//       model,
//       year,
//       color,
//       bodytype,
//       mileages,
//       condition,
//       vin,
//       stocknumber,
//       fueltype,
//       gasmileages,
//       fueltanksize,
//       transmission,
//       Engine,
//       Horsepower,
//       Doors,
//       picture,
//       gallery,
//       Brand,
//       price
//     });
//     await carData.save();
//     res.status(201).json(carData);

//     // res.status(201).json({ message: 'Car added successfully' });
//   } catch (error) {
//     console.error('Error adding car:', error);
//     // Return a 400 Bad Request status with an error message
//     res.status(400).json({
//       message: 'Invalid JSON data in the request',
//       error: error.message, // Include the error message in the response
//     });
//   }
// });


// API for GET all data from carlisting 
app.use(GetCallDataListing);

// app.get("/api/getcalldatalisting", async (req, res) => {
//   try{
//       const GetAllCarData = await SellmyCarData.find({});
//       res.send({ status : "OK" , data : GetAllCarData});
//       console.log("ALL IS WELL");
//       res.json(GetAllCarData);

//   }catch (error) {
//       console.log("This error comeing from GETCALLDATALISTING and it is :" + error);
//   }
// } );

// Coneected MongoDB


app.get('/api/getcalldatalisting/:carId', async (req, res) => {
  const carId = req.params.carId;
  try {
    const carProfile = await SellmyCarData.findById(carId);
    if (!carProfile) {
      return res.status(404).json({ error: 'Car not found' });
    }

    // Assuming carData is obtained or processed somehow
    const carData = {}; // Adjust this line based on how you get carData

    // Adjust the response format based on your needs
    res.json({ data: carData, carProfile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


mongoose.connect(DBURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("DataBase is CONNECTED! ");
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

