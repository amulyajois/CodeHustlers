const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  date: { type: Date, required: true },
  availableSlots: [String]
});

// Indexing for better querying
slotSchema.index({ doctor: 1 });
slotSchema.index({ date: 1 });

module.exports = mongoose.model('Slot', slotSchema);
