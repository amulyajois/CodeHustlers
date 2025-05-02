const mongoose = require('mongoose');

const stateSchema = new mongoose.Schema({
  name: { type: String, required: true }
});

// Indexing for better performance
stateSchema.index({ name: 1 });

module.exports = mongoose.model('State', stateSchema);
