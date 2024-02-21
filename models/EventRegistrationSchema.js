const mongoose = require('mongoose');

const EventRegistrationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
});

const EventRegistration = mongoose.model('EventRegistration', EventRegistrationSchema);

module.exports = EventRegistration;
