const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true
  },
  state: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'State',
    required: true
  },
  district: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'District',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  slot: {
    type: String,
    required: true
  },
  healthCondition: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexing for better query performance
bookingSchema.index({ date: 1 });
bookingSchema.index({ slot: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
