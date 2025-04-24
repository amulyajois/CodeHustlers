const express = require("express");
const router = express.Router();
const Doctor = require("../models/Doctor");

// Register Route
router.post("/register", async (req, res) => {
  const { name, email, hospitalName, specialization, password } = req.body;

  try {
    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({ message: "Doctor already registered" });
    }

    const newDoctor = new Doctor({
      name,
      email,
      hospitalName,
      specialization,
      password, // You should hash passwords in production!
    });

    await newDoctor.save();
    res.status(201).json({ message: "Doctor registered successfully" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
