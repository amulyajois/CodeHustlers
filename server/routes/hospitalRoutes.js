const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Hospital = require('../models/Hospital');
const { body, validationResult } = require('express-validator');

// Validation Middleware
const hospitalValidation = [
  body('hospitalName').notEmpty().withMessage('Hospital name is required'),
  body('email').isEmail().withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/\d/).withMessage('Password must contain at least one number')
    .matches(/[@$!%*#?&^]/).withMessage('Password must contain at least one special character'),
  body('state').notEmpty().withMessage('State is required'),
  body('district').notEmpty().withMessage('District is required')
];

// Register Hospital
router.post('/register', hospitalValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { hospitalName, email, state, district, password } = req.body;

  try {
    const existingHospital = await Hospital.findOne({ email });
    if (existingHospital) {
      return res.status(400).json({ message: 'Hospital already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newHospital = new Hospital({
      hospitalName,
      email,
      state,
      district,
      password: hashedPassword
    });

    await newHospital.save();

    // Send the hospital's ID in the response along with a success message
    res.status(201).json({
      message: 'Hospital registered successfully',
      hospitalId: newHospital._id // Send the Hospital ID
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// Hospital Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide both email and password' });
  }

  try {
    const hospital = await Hospital.findOne({ email: email.trim() });
    if (!hospital) {
      return res.status(400).json({ message: 'Hospital not found' });
    }

    const isMatch = await bcrypt.compare(password, hospital.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({
      message: 'Login successful',
      hospital: {
        hospitalId: hospital._id,
        hospitalName: hospital.hospitalName,
        email: hospital.email,
        state: hospital.state,
        district: hospital.district
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// Get All Hospitals
router.get('/all', async (req, res) => {
  try {
    const hospitals = await Hospital.find();
    res.status(200).json(hospitals);
  } catch (error) {
    console.error('Error fetching hospitals:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// Fetch Single Hospital Dashboard
router.get('/dashboard/:hospitalId', async (req, res) => {
  const { hospitalId } = req.params;

  try {
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    res.status(200).json({
      hospitalName: hospital.hospitalName,
      email: hospital.email,
      timings: hospital.timings,
      doctors: hospital.doctors,
      state: hospital.state,
      district: hospital.district
    });
  } catch (error) {
    console.error('Error fetching hospital dashboard:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update Hospital Dashboard
router.put('/dashboard/:hospitalId', async (req, res) => {
  const { hospitalId } = req.params;
  const { timings, doctors } = req.body;

  try {
    if (!timings || !doctors) {
      return res.status(400).json({ message: 'Timings and Doctors are required' });
    }

    const updatedHospital = await Hospital.findByIdAndUpdate(
      hospitalId,
      { timings, doctors },
      { new: true, runValidators: true }
    );

    if (!updatedHospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    res.status(200).json({
      message: 'Dashboard updated successfully!',
      updatedHospital
    });

  } catch (error) {
    console.error('Error updating hospital dashboard:', error);
    res.status(500).json({ message: 'Failed to update dashboard' });
  }
});


// Define the route to fetch hospitals
router.get('/hospitals', async (req, res) => {
  try {
    const hospitals = await Hospital.find()
      .populate('state', 'name')  // Populating the 'state' field with the 'name' property
      .exec();
    
    // Send the result as a response
    res.status(200).json(hospitals);  // Sends the hospitals with populated state
  } catch (error) {
    console.error('Error fetching hospitals:', error);
    res.status(500).json({ message: 'Error fetching hospitals' });  // Error handling
  }
});

// Get hospitals based on district
router.get('/:stateId/:districtId', async (req, res) => {
  try {
    const hospitals = await Hospital.find({
      state: req.params.stateId,
      district: req.params.districtId
    });
    res.json(hospitals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
