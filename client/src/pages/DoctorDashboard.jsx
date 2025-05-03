import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios
import '../styles/DoctorDashboard.css';

function DoctorDashboard() {
  const [selectedDate, setSelectedDate] = useState('');
  const [patientIdInput, setPatientIdInput] = useState(''); // Renamed to avoid conflict
  const [availableDates, setAvailableDates] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [doctorId, setDoctorId] = useState(null); // State to hold the logged-in doctor's ID
  const [loadingAppointments, setLoadingAppointments] = useState(false); // Loading state
  const [appointmentError, setAppointmentError] = useState(''); // Error state for appointments
  const [patientDetails, setPatientDetails] = useState(null); // State for storing selected patient details

  // Get doctor ID from local storage on component mount
  useEffect(() => {
    const storedDoctorId = localStorage.getItem("doctorId"); // Assuming doctorId is stored in localStorage
    if (storedDoctorId) {
      setDoctorId(storedDoctorId);
    } else {
      // Handle case where doctorId is not found (e.g., redirect to login)
      console.error("Doctor ID not found in local storage.");
      setAppointmentError("Doctor ID not available. Please log in again."); // Set error state
      // You might want to redirect the doctor to the login page here
      // navigate('/login/doctor'); // Assuming you have navigate from react-router-dom
    }

    // Generate dates for the next 7 days on component mount
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      // Format date as YYYY-MM-DD for value and a readable format for display
      const value = date.toISOString().split('T')[0];
      const display = date.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
      dates.push({ value, display });
    }
    setAvailableDates(dates);
  }, []); // Empty dependency array means this runs once on mount

  // Function to fetch appointments for the selected date
  const fetchAppointments = async (date, currentDoctorId) => {
    if (!date || !currentDoctorId) {
      setAppointments([]); // Clear appointments if date or doctorId is missing
      return;
    }

    setLoadingAppointments(true);
    setAppointmentError(''); // Clear previous errors
    try {
      // Make API call to fetch appointments for the selected date and doctor
      // Assuming the backend endpoint is /api/doctor/appointments and accepts date and doctorId as query params
      const res = await axios.get(`http://localhost:5000/api/doctor/appointments?date=${date}&doctorId=${currentDoctorId}`);
      // Assuming the backend returns an array of appointment objects matching the Booking schema
      setAppointments(res.data);
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
      setAppointmentError("Failed to fetch appointments. Please try again.");
      setAppointments([]); // Clear appointments on error
    } finally {
      setLoadingAppointments(false);
    }
  };

  // Function to handle date selection and fetch appointments
  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    // Fetch appointments for the selected date and the logged-in doctor
    if (doctorId) {
      fetchAppointments(date, doctorId);
    } else {
      setAppointmentError("Doctor ID not available to fetch appointments.");
      setAppointments([]);
    }
  };

  // Function to handle viewing patient details (existing functionality)
  const handleViewPatientDetails = async (patientId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/doctor/patient/${patientId}`);
      console.log("Patient Details:", res.data);
      // Set the patient details into the state for display (e.g., modal, sidebar, or new section)
      setPatientDetails(res.data); // Assuming you have a state variable like `patientDetails`
    } catch (err) {
      console.error("Failed to fetch patient details", err);
      alert("Patient not found or an error occurred.");
    }
  };

  // Function to handle patient ID input and show patient details
  const handlePatientIdInput = async () => {
    if (!patientIdInput) {
      alert("Please enter a patient ID.");
      return;
    }

    try {
      const res = await axios.get(`http://localhost:5000/api/doctor/patient/${patientIdInput}`);
      console.log("Patient Details by Input:", res.data);
      setPatientDetails(res.data);
    } catch (err) {
      console.error("Failed to fetch patient details", err);
      alert("Patient not found or an error occurred.");
    }
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="header">
        <span className="header-title">Doctor Dashboard</span>
      </div>

      {/* Navigation */}
      <div className="nav-container">
        <div className="logo">MediMeet</div>
        <div className="nav-links">
          <div className="nav-item">
            <div className="nav-link">Home</div>
            <div className="nav-description">Let's Start</div>
          </div>
          <div className="nav-item">
            <div className="nav-link">Contact</div>
            <div className="nav-description">For Help?</div>
          </div>
          <div className="nav-item">
            <div className="nav-link">Logout</div>
            <div className="nav-description">Check Again</div>
          </div>
        </div>
      </div>

      {/* Banner */}
      <div className="banner">
        <h1>EXPAND YOUR REACH. ENHANCE YOUR CARE.</h1>
        <p>Grow with Us in the Digital Health Era.</p>

        <div className="icon-container">
          {[1, 2, 3, 4, 5, 6].map((icon, index) => (
            <div key={index} className="icon-box">
              {/* Replace with actual icons */}
              <img
                src={`/assets/icons/icon${icon}.png`}
                alt={`icon-${icon}`}
                className="banner-icon"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="dashboard-panel">
          <div className="panel-title">
            <h2>FROM APPOINTMENTS TO ACTION</h2>
            <p>Track, treat, and thrive—your workflow in one place</p>
          </div>

          <div className="form-section">
            <div className="form-group">
              <label>Select Date:</label>
              <select
                value={selectedDate}
                onChange={handleDateChange} // Use the new handler
              >
                <option value="" disabled>Select a date</option>
                {availableDates.map((date) => (
                  <option key={date.value} value={date.value}>
                    {date.display}
                  </option>
                ))}
              </select>
            </div>

            {/* Section to display appointments */}
            <div className="appointments-section">
              <h3>Appointments for {selectedDate ? selectedDate : 'selected date'}</h3>
              {loadingAppointments && <p>Loading appointments...</p>}
              {appointmentError && <p className="error">{appointmentError}</p>}
              {!loadingAppointments && !appointmentError && (
                appointments.length > 0 ? (
                  <ul>
                    {appointments.map((appointment) => (
                      <li key={appointment._id || `${appointment.patient}-${appointment.slot}`}>
                        Appointment Time: {appointment.slot},
                        <button onClick={() => handleViewPatientDetails(appointment.patient._id)}>
                          Patient Name: {appointment.patient ? appointment.patient.name : 'N/A'}
                        </button>,
                        Patient ID: <button onClick={() => handleViewPatientDetails(appointment.patient._id)}>
                          {appointment.patient ? appointment.patient._id : 'N/A'}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>{selectedDate ? 'No appointments found for this date.' : 'Select a date to view appointments.'}</p>
                )
              )}
            </div>

            {/* Patient ID input */}
            <div className="form-group">
              <label>Patient ID:</label>
              <input
                type="text"
                value={patientIdInput}
                onChange={(e) => setPatientIdInput(e.target.value)}
                placeholder="Enter patient ID"
              />
            </div>

            <button className="action-button" onClick={handlePatientIdInput}>
              View Patient Details by ID
            </button>
          </div>
        </div>

        <div className="sidebar">
          <div className="doctor-avatar">
            {/* Ensure image path is correct */}
            <img src="/assets/icons/doctor-avatar.png" alt="Doctor" />
          </div>
        </div>
      </div>

      {/* Modal or section to display patient details */}
      {patientDetails && (
        <div className="patient-details-modal">
          <h2>Patient Details</h2>
          <p><strong>Name:</strong> {patientDetails.name}</p>
          <p><strong>Email:</strong> {patientDetails.email}</p>
          <p><strong>Age:</strong> {patientDetails.age}</p>
          <p><strong>Gender:</strong> {patientDetails.gender}</p>
          <p><strong>Height:</strong> {patientDetails.height}</p>
          <p><strong>Weight:</strong> {patientDetails.weight}</p>
          <p><strong>Blood Group:</strong> {patientDetails.bloodGroup}</p>
          <p><strong>Additional Details:</strong> {patientDetails.additionalDetails}</p>
        </div>
      )}
    </div>
  );
}

export default DoctorDashboard;
