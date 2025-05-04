const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Hospital = require('../models/Hospital');
const Doctor = require('../models/Doctor'); // Make sure to import Doctor model
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

    res.status(201).json({
      message: 'Hospital registered successfully',
      hospitalId: newHospital._id
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
    // Populate the 'doctor' field within the 'doctors' array
    const hospital = await Hospital.findById(hospitalId)
      .populate('doctors.doctor')
      .exec();

    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    // Fetch all doctors registered under this hospital (for the dropdown)
    const registeredDoctors = await Doctor.find({ hospital: hospitalId });

    res.status(200).json({
      hospitalName: hospital.hospitalName,
      email: hospital.email,
      timings: hospital.timings,
      // Return the populated doctors array with their specific slots
      dashboardDoctors: hospital.doctors,
      registeredDoctors: registeredDoctors, // All doctors registered under this hospital
      state: hospital.state,
      district: hospital.district
    });
  } catch (error) {
    console.error('Error fetching hospital dashboard:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add or Update Doctor Slots on Hospital Dashboard
router.post('/dashboard/:hospitalId/doctor', async (req, res) => {
  const { hospitalId } = req.params;
  const { doctorId, availableSlots } = req.body; // Expect doctorId and availableSlots

  try {
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Find if the doctor is already on the dashboard
    const doctorEntryIndex = hospital.doctors.findIndex(
      (docEntry) => docEntry.doctor && docEntry.doctor.toString() === doctorId
    );

    if (doctorEntryIndex > -1) {
      // Doctor exists on dashboard, merge new slots with existing ones
      const existingSlots = hospital.doctors[doctorEntryIndex].availableSlots;
      const newSlots = availableSlots; // Slots sent from frontend

      // Merge logic: Iterate through new slots and add/merge into existing slots
      newSlots.forEach(newSlotEntry => {
          const existingDateEntry = existingSlots.find(
              slotEntry => slotEntry.date === newSlotEntry.date
          );

          if (existingDateEntry) {
              // Date exists, add new time slots, avoiding duplicates
              newSlotEntry.slots.forEach(newTimeSlot => {
                  if (!existingDateEntry.slots.includes(newTimeSlot)) {
                      existingDateEntry.slots.push(newTimeSlot);
                  }
              });
          } else {
              // Date does not exist, add the new date entry
              existingSlots.push(newSlotEntry);
          }
      });

      // Sort slots by date if needed (optional but good practice)
      existingSlots.sort((a, b) => new Date(a.date) - new Date(b.date));


      hospital.doctors[doctorEntryIndex].availableSlots = existingSlots; // Update the slots array
      await hospital.save();

      // Populate the updated doctor entry to return it in the response
      await hospital.populate('doctors.doctor');
      const updatedDoctorEntry = hospital.doctors[doctorEntryIndex];

      res.status(200).json({ message: 'Doctor slots updated successfully', doctor: updatedDoctorEntry });

    } else {
      // Doctor does not exist on dashboard, add them
      const doctorEntry = {
        doctor: doctorId,
        availableSlots: availableSlots // Save the hospital-specific slots
      };

      hospital.doctors.push(doctorEntry);
      await hospital.save();

      // Populate the added doctor entry to return it in the response
      await hospital.populate('doctors.doctor');
       const addedDoctorEntry = hospital.doctors.find(
         (docEntry) => docEntry.doctor && docEntry.doctor._id.toString() === doctorId
       );


      res.status(200).json({ message: 'Doctor added to dashboard successfully', doctor: addedDoctorEntry });
    }

  } catch (error) {
    console.error('Error adding/updating doctor on dashboard:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Update Hospital Dashboard (Timings & Doctors - Note: This route might need adjustment
// if you intend to update doctor-specific slots via this route as well)
router.put('/dashboard/:hospitalId', async (req, res) => {
  const { hospitalId } = req.params;
  const { timings, doctors } = req.body; // 'doctors' here is expected to be the array of embedded objects

  try {
    if (!timings || !doctors) {
      return res.status(400).json({ message: 'Timings and Doctors are required' });
    }

    // Find the hospital and update timings and the entire doctors array
    const updatedHospital = await Hospital.findByIdAndUpdate(
      hospitalId,
      { timings, doctors }, // This will replace the entire doctors array
      { new: true, runValidators: true }
    ).populate('doctors.doctor'); // Populate after update

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

module.exports = router;
