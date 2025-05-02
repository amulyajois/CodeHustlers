// routes/slotRoutes.js
const express = require('express');
const router = express.Router();
const Slot = require('../models/Slot');  // Assuming you're using a Mongoose model

// Route to get available slots for a doctor
router.get('/:doctorId', async (req, res) => {
  const { doctorId } = req.params;
  const { date } = req.query;

  try {
    const query = { doctorId };
    if (date) query.date = date;

    const slots = await Slot.find(query);
    res.status(200).json(slots);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error, unable to fetch slots.' });
  }
});


module.exports = router;
