const express = require("express");
const router = express.Router();
const Doctor = require("../models/Doctor");
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
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save new doctor
    const newDoctor = new Doctor({
      name,
      email,
      hospital,  // This is the hospitalId
      specialization,
      password: hashedPassword
    });

    await newDoctor.save();
    res.status(201).json({ message: "Doctor registered successfully" });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

module.exports = router;