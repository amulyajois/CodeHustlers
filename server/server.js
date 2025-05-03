const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const morgan = require('morgan');
const helmet = require('helmet'); // Optional, but good for security

dotenv.config();
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(helmet()); // Adds security headers to HTTP responses
app.use(express.json());

// Request logging (optional for development or production environments)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/doctor', require('./routes/doctorRoutes'));
app.use('/api/hospital', require('./routes/hospitalRoutes'));
app.use('/api/patient', require('./routes/patientRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));



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