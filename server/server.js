// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const morgan = require('morgan');
const helmet = require('helmet');  // Optional, but good for security

dotenv.config();
connectDB();  // Ensure environment variables are loaded before DB connection

const app = express();

// Middlewares
app.use(cors());
app.use(helmet());  // Adds security headers to HTTP responses
app.use(express.json());  // Built-in middleware for parsing JSON

// Request logging (optional for development or production environments)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/states', require('./routes/stateRoutes'));
app.use('/api/districts', require('./routes/districtRoutes'));
app.use('/api/hospital', require('./routes/hospitalRoutes'));
app.use('/api/doctor', require('./routes/doctorRoutes'));
app.use('/api/slots', require('./routes/slotRoutes'));
app.use('/api/patient', require('./routes/patientRoutes'));
app.use('/api/booking', require('./routes/bookingRoutes'));

// Home route for testing if server is working
app.get('/', (req, res) => {
  res.send('Hello World');
});

// Error handling middleware (for unhandled errors)
app.use((err, req, res, next) => {
  console.error(err.stack);  // Log the stack trace to the console
  res.status(500).json({
    message: err.message || "Something went wrong. Please try again later."
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
