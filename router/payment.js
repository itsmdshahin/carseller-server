
const express = require('express');
const payment = express.Router();
const middleware = require('../middleware/middleware');
const paymentController = require('../controllers/paymentController');


payment.post('/bkash/payment/create', middleware.bkash_auth, paymentController.payment_create)

payment.get('/bkash/payment/callback', middleware.bkash_auth, paymentController.call_back)


module.exports = payment

