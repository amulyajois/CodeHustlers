const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  height: { type: String, required: true },
  weight: { type: String, required: true },
  bloodGroup: { type: String, required: true },
  state: { type: mongoose.Schema.Types.ObjectId, ref: 'State' },
  district: { type: mongoose.Schema.Types.ObjectId, ref: 'District' },
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  date: { type: Date },
  slot: { type: String }
});

// Indexing for better performance
UserSchema.index({ email: 1 });
UserSchema.index({ doctor: 1 });

module.exports = mongoose.model('PatientUser', UserSchema);
