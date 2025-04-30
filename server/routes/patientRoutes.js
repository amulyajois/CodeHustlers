const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Patient = require("../models/Patient");
const Hospital = require("../models/Hospital"); // Import Hospital model
const Doctor = require("../models/Doctor"); // Import Doctor model
const Booking = require("../models/Booking"); // Import Booking model

// Register Route
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingPatient = await Patient.findOne({ email });
    if (existingPatient) {
      return res.status(400).json({ message: "Patient already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newPatient = new Patient({
      name,
      email,
      password: hashedPassword
    });

    await newPatient.save();
    res.status(201).json({ message: "Patient registered successfully" });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const patient = await Patient.findOne({ email });
    if (!patient) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, patient.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // In a real application, you would generate and send a JWT token here
    // Sending patient id, name, and email in the response
    res.status(200).json({ message: "Login successful", patient: { id: patient._id, name: patient.name, email: patient.email } });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Route to get hospitals by state and district - MOVED ABOVE /:id route
router.get("/hospitals", async (req, res) => {
  const { state, district } = req.query;

  if (!state || !district) {
    return res.status(400).json({ message: "State and district are required" });
  }

  try {
    // Find hospitals matching state and district
    const hospitals = await Hospital.find({ state, district }).select('-password'); // Exclude password
    res.status(200).json(hospitals);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});


// Route to get patient details by ID - MOVED BELOW /hospitals route
router.get("/:id", async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).select('-password'); // Exclude password
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.status(200).json(patient);
  } catch (err) {
    console.error(err.message);
    // Handle case where ID format is invalid
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ message: "Invalid Patient ID format" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

// New route to update patient details
router.put("/:id", async (req, res) => {
  const { age, gender, height, weight, bloodGroup, additionalDetails } = req.body;

  try {
    let patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Update fields if they are provided in the request body
    if (age !== undefined) patient.age = age;
    if (gender !== undefined) patient.gender = gender;
    if (height !== undefined) patient.height = height;
    if (weight !== undefined) patient.weight = weight;
    if (bloodGroup !== undefined) patient.bloodGroup = bloodGroup;
    if (additionalDetails !== undefined) patient.additionalDetails = additionalDetails;

    await patient.save();

    res.status(200).json({ message: "Patient details updated successfully", patient });

  } catch (err) {
    console.error(err.message);
    // Handle case where ID format is invalid
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ message: "Invalid Patient ID format" });
    }
    res.status(500).json({ message: "Server error" });
  }
});


// Route to get doctors and their slots for a specific hospital
router.get("/hospitals/:hospitalId/doctors", async (req, res) => {
  const { hospitalId } = req.params;

  try {
    // Find the hospital and populate the doctor details and their available slots
    const hospital = await Hospital.findById(hospitalId).populate('doctors.doctor', 'name specialization'); // Populate doctor details
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    // Return doctors with their hospital-specific available slots
    const doctorsWithSlots = hospital.doctors.map(docEntry => ({
      _id: docEntry.doctor._id,
      name: docEntry.doctor.name,
      specialization: docEntry.doctor.specialization,
      availableSlots: docEntry.availableSlots
    }));

    res.status(200).json(doctorsWithSlots);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Route to book a slot
router.post("/book-slot", async (req, res) => {
  const { patientId, hospitalId, doctorId, date, slot } = req.body;

  if (!patientId || !hospitalId || !doctorId || !date || !slot) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Find the hospital and the specific doctor entry within it
    const hospital = await Hospital.findById(hospitalId);

    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    const doctorEntry = hospital.doctors.find(
      (doc) => doc.doctor.toString() === doctorId
    );

    if (!doctorEntry) {
      return res.status(404).json({ message: "Doctor not found in this hospital" });
    }

    // Find the date entry for the doctor's slots at this hospital
    const dateEntry = doctorEntry.availableSlots.find(
      (d) => d.date === date
    );

    if (!dateEntry) {
      return res.status(400).json({ message: "No slots available for this date" });
    }

    // Check if the slot is available and remove it
    const slotIndex = dateEntry.slots.indexOf(slot);

    if (slotIndex === -1) {
      return res.status(400).json({ message: "Slot not available or already booked" });
    }

    // Remove the booked slot
    dateEntry.slots.splice(slotIndex, 1);

    // Save the updated hospital document
    await hospital.save();

    // Create a new booking record
    const newBooking = new Booking({
      patient: patientId,
      hospital: hospitalId,
      doctor: doctorId,
      date: date,
      slot: slot
    });

    await newBooking.save();


    res.status(200).json({ message: "Slot booked successfully", booking: newBooking });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
