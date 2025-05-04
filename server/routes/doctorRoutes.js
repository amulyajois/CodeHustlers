const express = require("express");
const router = express.Router();
const Doctor = require("../models/Doctor");
const Booking = require('../models/Booking');
const Patient =require('../models/Patient') // ✅ Add this at the top

const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");

// Doctor Registration
router.post("/register", [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Please provide a valid email address"),
  body("hospital").notEmpty().withMessage("Hospital ID is required"), // Accept hospitalId
  body("specialization").notEmpty().withMessage("Specialization is required"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/\d/)
    .withMessage("Password must contain at least one number")
    .matches(/[@$!%*#?&^]/)
    .withMessage("Password must contain at least one special character")
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, hospital, specialization, password } = req.body;

  try {
    // Check if doctor already exists
    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({ message: "Doctor already registered" });
    }

    // Hash the password
   // const salt = await bcrypt.genSalt(10);
   // const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save new doctor
    const newDoctor = new Doctor({
      name,
      email,
      hospital,  // This is the hospitalId
      specialization,
      password
    });

    await newDoctor.save();
    res.status(201).json({ message: "Doctor registered successfully" });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// Doctor Login
// ... existing imports ...
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide both email and password' });
  }

  try {
    const doctor = await Doctor.findOne({ email: email.trim() });
    if (!doctor) {
      return res.status(400).json({ message: 'Doctor not found' });
    }

    const isMatch = await doctor.comparePassword(password); // ✅ FIXED here
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({
      message: 'Login successful',
      doctor: {
        doctorId: doctor._id,
        doctorName: doctor.name,
        email: doctor.email,
        specialization: doctor.specialization,
        hospital: doctor.hospital,
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
})
  // GET appointments for a specific doctor and date
router.get("/appointments", async (req, res) => {
  const { date, doctorId } = req.query; // Get date and doctorId from query parameters

  // Basic validation
  if (!date || !doctorId) {
    return res.status(400).json({ message: "Missing date or doctorId query parameters" });
  }

  try {
    // Find bookings for the given doctor and date
    const appointments = await Booking.find({
      doctor: doctorId, // Match the doctor ID
      date: date         // Match the date
    }).populate('patient', 'name'); // Optionally populate patient name

    // Return the found appointments
    res.status(200).json(appointments);

  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: "Server error fetching appointments. Please try again later." });
  }
});

// GET patient details by ID
router.get('/patient/:id', async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json({
      name: patient.name,
      email: patient.email,
      age: patient.age,
      gender: patient.gender,
      height: patient.height,
      weight: patient.weight,
      bloodGroup: patient.bloodGroup,
      additionalDetails: patient.additionalDetails,
    });
;
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
// Get patient details by patient ID

 


// ... rest of the file ...



module.exports = router;
