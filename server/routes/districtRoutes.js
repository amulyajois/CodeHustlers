// routes/districtRoutes.js
const express = require('express');
const router = express.Router();
const District = require('../models/District');  // Assuming you're using a Mongoose model

// Route to get all districts by state
router.get('/:stateId', async (req, res) => {
  const { stateId } = req.params;
  try {
    const districts = await District.find({ state: stateId });  // Find districts by state ID
    res.status(200).json(districts);  // Send back districts as JSON
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error, unable to fetch districts.' });
  }
});

module.exports = router;
