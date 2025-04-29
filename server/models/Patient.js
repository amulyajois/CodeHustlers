const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  // Add new fields for additional patient details
  age: {
    type: Number
  },
  gender: {
    type: String
  },
  height: {
    type: String // Storing as string to allow units like "cm" or "inches"
  },
  weight: {
    type: String // Storing as string to allow units like "kg" or "lbs"
  },
  bloodGroup: {
    type: String
  },
  additionalDetails: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Patient', PatientSchema);
