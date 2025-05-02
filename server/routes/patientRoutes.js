const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Patient = require("../models/Patient");
const Hospital = require("../models/Hospital");
const Doctor = require("../models/Doctor");
const Booking = require("../models/Booking");
const State = require("../models/State");
const District = require("../models/District");

// Utility to generate unique patientId
function generatePatientId() {
  return 'PAT' + Date.now();
}

// ========== AUTH ROUTES ==========

// REGISTER
router.post("/register", async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const existing = await Patient.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const newPatient = new Patient({
      patientId: generatePatientId(),
      email,
      password, // bcrypt handled in schema pre('save')
      name
    });

    await newPatient.save();
    res.status(201).json({ message: "Patient registered successfully" });
  } catch (err) {
    console.error("Register Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const patient = await Patient.findOne({ email });
    if (!patient) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, patient.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    res.status(200).json({
      message: "Login successful",
      patient: {
        id: patient._id,
        name: patient.name,
        email: patient.email
      }
    });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ========== LOCATION ROUTES ==========

// GET all states
router.get("/states", async (req, res) => {
  try {
    const states = await State.find().select("name");
    res.status(200).json(states);
  } catch (err) {
    console.error("States Fetch Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// GET districts by state ID
router.get("/districts/:stateId", async (req, res) => {
  try {
    const districts = await District.find({ state: req.params.stateId }).select("name");
    res.status(200).json(districts);
  } catch (err) {
    console.error("Districts Fetch Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ========== HOSPITAL & DOCTOR ROUTES ==========

// Filter hospitals by state & district
router.get("/hospitals", async (req, res) => {
  const { state, district } = req.query;
  if (!state || !district) return res.status(400).json({ message: "State and district required" });

  try {
    const hospitals = await Hospital.find({ state, district }).select("-password");
    res.status(200).json(hospitals);
  } catch (err) {
    console.error("Hospital Fetch Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Get doctors in hospital with available slots
router.get("/hospitals/:hospitalId/doctors", async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.hospitalId).populate('doctors.doctor', 'name specialization');
    if (!hospital) return res.status(404).json({ message: "Hospital not found" });

    const doctors = hospital.doctors.map(entry => ({
      _id: entry.doctor._id,
      name: entry.doctor.name,
      specialization: entry.doctor.specialization,
      availableSlots: entry.availableSlots
    }));

    res.status(200).json(doctors);
  } catch (err) {
    console.error("Doctor Fetch Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ========== PATIENT PROFILE ==========

// Get patient by ID
router.get("/:id", async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).select("-password");
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    res.status(200).json(patient);
  } catch (err) {
    console.error("Profile Fetch Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Update patient profile
router.put("/:id", async (req, res) => {
  const fields = [
    "age", "gender", "height", "weight", "bloodGroup", "additionalDetails",
    "contactInfo", "emergencyContact", "allergies", "medicalHistory",
    "currentMedications", "insuranceInfo"
  ];

  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        patient[field] = req.body[field];
      }
    });

    await patient.save();
    res.status(200).json({ message: "Profile updated successfully", patient });
  } catch (err) {
    console.error("Profile Update Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ========== BOOKING ROUTE ==========

// Book appointment slot
router.post("/book-slot", async (req, res) => {
  const { patientId, hospitalId, doctorId, date, slot } = req.body;

  if (!patientId || !hospitalId || !doctorId || !date || !slot) {
    return res.status(400).json({ message: "All fields required" });
  }

  try {
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) return res.status(404).json({ message: "Hospital not found" });

    const doctorEntry = hospital.doctors.find(d => d.doctor.toString() === doctorId);
    if (!doctorEntry) return res.status(404).json({ message: "Doctor not found in this hospital" });

    const dateSlot = doctorEntry.availableSlots.find(d => d.date === date);
    if (!dateSlot) return res.status(400).json({ message: "No slots available for selected date" });

    const slotIndex = dateSlot.slots.indexOf(slot);
    if (slotIndex === -1) return res.status(400).json({ message: "Slot already booked or invalid" });

    dateSlot.slots.splice(slotIndex, 1); // Remove booked slot
    await hospital.save();

    const newBooking = new Booking({ patient: patientId, hospital: hospitalId, doctor: doctorId, date, slot });
    await newBooking.save();

    res.status(200).json({ message: "Slot booked successfully", booking: newBooking });
  } catch (err) {
    console.error("Booking Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
