// routes/schedule.js
const express = require('express');
const router = express.Router();

const Doctor = require('../models/Doctor');
const Hospital = require('../models/Hospital');

// GET /api/schedule?doctorId=xyz&date=YYYY-MM-DD
router.get('/', async (req, res) => {
  const { doctorId, date } = req.query;

  if (!doctorId || !date) {
    return res.status(400).json({ message: 'doctorId and date are required' });
  }

  try {
    // Find the doctor
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    // Find the hospital's slot structure
    const hospital = await Hospital.findById(doctor.hospitalId);
    if (!hospital) return res.status(404).json({ message: 'Hospital not found' });

    const hospitalSlots = hospital.slots[date] || []; // assuming slots is a date-indexed object

    // Find all appointments for that doctor on the given date
    const appointments = await Appointment.find({ doctorId, date });

    // Map appointments to their time slots
    const bookedSlots = appointments.map(app => app.timeSlot);

    res.json({
      date,
      hospitalSlots,
      bookedSlots,
      availableSlots: hospitalSlots.filter(slot => !bookedSlots.includes(slot)),
      appointments, // optional full list
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
