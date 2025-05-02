const mongoose = require('mongoose');

const TimingSchema = new mongoose.Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
});

const SlotSchema = new mongoose.Schema({
  date: { type: String, required: true },
  slots: [{ type: String }]
});

const DoctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialization: { type: String, required: true },
  availableSlots: [SlotSchema]
});

const HospitalSchema = new mongoose.Schema({
  hospitalName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  state: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'State', // This ensures it references the 'State' model correctly
    required: true 
  },
  district: { type: mongoose.Schema.Types.ObjectId, ref: 'District' },
  timings: [{ from: String, to: String }],
  doctors: [{ name: String, specialization: String, availableSlots: [{ date: String, slots: [String] }] }]
});

HospitalSchema.index({ district: 1 });

module.exports = mongoose.model('Hospital', HospitalSchema);
