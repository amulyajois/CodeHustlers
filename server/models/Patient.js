const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const patientSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true,
    unique: true
  },
  name: {  // ✅ Replaced firstName and lastName with name
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  dateOfBirth: Date,
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  contactInfo: {
    phone: String,
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    }
  },
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String
  },
  allergies: [String],
  medicalHistory: [{
    condition: String,
    diagnosedDate: Date,
    notes: String
  }],
  currentMedications: [{
    name: String,
    dosage: String,
    frequency: String,
    startDate: Date,
    endDate: Date
  }],
  insuranceInfo: {
    provider: String,
    policyNumber: String,
    expiryDate: Date
  },
  admissionStatus: {
    type: String,
    enum: ['admitted', 'discharged', 'outpatient'],
    default: 'outpatient'
  },
  admissionHistory: [{
    admittedOn: Date,
    dischargedOn: Date,
    reason: String,
    assignedDoctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor'
    },
    assignedRoom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room'
    },
    treatmentNotes: String
  }],
  height: Number,  // in cm
  weight: Number,  // in kg
  age: Number,
  additionalDetails: String
}, {
  timestamps: true
});

// Hash password before saving
patientSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Indexes
patientSchema.index({ email: 1 });
patientSchema.index({ "contactInfo.phone": 1 });

module.exports = mongoose.model('Patient', patientSchema);
