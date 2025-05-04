const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
// For password hashing

const SlotSchema = new mongoose.Schema({
  date: { type: String, required: true },
  slots: [{ type: String }],
});

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true }, // Reference to Hospital schema
  specialization: { type: String, required: true },
  password: { type: String, required: true },
});

// Password hashing before saving the doctor document
doctorSchema.pre("save", async function(next) {
  if (this.isModified("password") || this.isNew) {
    this.password = await bcrypt.hash(this.password, 10); // Hash password with a salt round of 10
  }
  next(); // Continue with the save operation
});

// Method to compare entered password with hashed password in the database
doctorSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Doctor", doctorSchema);