const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  staffId: {
    type: String,
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  specialization: {
    type: String,
    required: true
  },
  qualifications: [{
    degree: String,
    institution: String,
    year: Number
  }],
  contactInfo: {
    phone: String,
    email: String,
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    }
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department'
  },
  schedule: [{
    day: {
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      required: true
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    },
    isAvailable: {
      type: Boolean,
      default: true
    }
  }],
  consultationFee: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  numberOfRatings: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'on leave', 'resigned'],
    default: 'active'
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

doctorSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Indexing for better performance
doctorSchema.index({ specialization: 1 });
doctorSchema.index({ department: 1 });
doctorSchema.index({ status: 1 });

module.exports = mongoose.model('Doctor', doctorSchema);
