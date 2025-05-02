const mongoose = require('mongoose');

const districtSchema = new mongoose.Schema({
  name: { type: String, required: true },
  state: { type: mongoose.Schema.Types.ObjectId, ref: 'State', required: true }
});

// Indexing for better performance on frequent queries
districtSchema.index({ name: 1 });
districtSchema.index({ state: 1 });

module.exports = mongoose.model('District', districtSchema);
