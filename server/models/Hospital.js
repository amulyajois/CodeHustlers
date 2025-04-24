const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  state: String,
  district: String,
  password: String
});

module.exports = mongoose.model('Hospital', hospitalSchema);
