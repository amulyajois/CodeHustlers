const mongoose = require('mongoose');

const TimingSchema = new mongoose.Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
});

const SlotSchema = new mongoose.Schema({
  date: { type: String, required: true },
  slots: [{ type: String }],
});

const HospitalSchema = new mongoose.Schema({
  hospitalName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  state: { type: String, required: true },
  district: { type: String, required: true },
  timings: [TimingSchema],
  // Modified to store doctor reference and hospital-specific slots
  doctors: [{
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
    availableSlots: [SlotSchema] // Slots specific to this doctor at this hospital
  }]
});


module.exports = mongoose.model('Hospital', HospitalSchema);
