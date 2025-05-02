const express = require('express');
const router = express.Router();
const Hospital = require('../models/Hospital');
const State = require('../models/State');
const mongoose = require('mongoose');

router.get('/', async (req, res) => {
  try {
    // Fetch distinct state IDs from the Hospital model
    const stateIds = await Hospital.distinct('state');
    console.log('Raw state IDs:', stateIds);

    // Filter out invalid or null ObjectIds
    const validStateIds = stateIds.filter(id => mongoose.Types.ObjectId.isValid(id));

    // Fetch states that match the valid state IDs
    const states = await State.find({ _id: { $in: validStateIds } }).select('_id name');
    console.log("Fetched States:", states);  // Debugging line to check fetched states

    // Set Cache-Control header to prevent caching
    res.set('Cache-Control', 'no-store');
    
    // Return the states in the response
    res.status(200).json(states);
  } catch (error) {
    console.error('Error fetching states:', error);
    res.status(500).json({ message: 'Server error, unable to fetch states.' });
  }
});

module.exports = router;
