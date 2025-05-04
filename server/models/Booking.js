const mongoose = require('mongoose');

const BookingSchema = mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  date: {
    type: String, // Or Date, depending on how you store dates
    required: true
  },
  slot: {
    type: String,
    required: true
  },
  bookedAt: {
    type: Date,
    default: Date.now
  },
  bookingNumber: {
    type: Number,
    unique: true // Ensure each booking number is unique
  }
});

module.exports = mongoose.model('Booking', BookingSchema);
