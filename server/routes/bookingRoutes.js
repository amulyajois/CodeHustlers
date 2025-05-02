const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// POST /api/bookings
router.post('/', async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).json({ message: 'Booking successful', booking });
  } catch (error) {
    res.status(500).json({ message: 'Booking failed', error });
  }
});

module.exports = router;
