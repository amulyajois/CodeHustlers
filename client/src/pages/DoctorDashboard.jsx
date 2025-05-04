import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/DoctorDashboard.css';

function DoctorDashboard() {
  const [selectedDate, setSelectedDate] = useState('');
  const [patientIdInput, setPatientIdInput] = useState('');
  const [availableDates, setAvailableDates] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [doctorId, setDoctorId] = useState(null);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [appointmentError, setAppointmentError] = useState('');
  const [patientDetails, setPatientDetails] = useState(null);

  useEffect(() => {
    const storedDoctorId = localStorage.getItem("doctorId");
    if (storedDoctorId) {
      setDoctorId(storedDoctorId);
    } else {
      console.error("Doctor ID not found in local storage.");
      setAppointmentError("Doctor ID not available. Please log in again.");
    }

    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const value = date.toISOString().split('T')[0];
      const display = date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      dates.push({ value, display });
    }
    setAvailableDates(dates);
  }, []);

  const fetchAppointments = async (date, currentDoctorId) => {
    if (!date || !currentDoctorId) {
      setAppointments([]);
      return;
    }

    setLoadingAppointments(true);
    setAppointmentError('');
    try {
      const res = await axios.get(`http://localhost:5000/api/doctor/appointments?date=${date}&doctorId=${currentDoctorId}`);
      setAppointments(res.data);
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
      setAppointmentError("Failed to fetch appointments. Please try again.");
      setAppointments([]);
    } finally {
      setLoadingAppointments(false);
    }
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    if (doctorId) {
      fetchAppointments(date, doctorId);
    } else {
      setAppointmentError("Doctor ID not available to fetch appointments.");
      setAppointments([]);
    }
  };

  const handleViewPatientDetails = async (patientId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/doctor/patient/${patientId}`);
      console.log("Patient Details:", res.data);
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
      <div className="main-content two-column-layout">
        {/* Left Side: Appointments */}
        <div className="dashboard-panel left-panel">
          <div className="panel-title">
            <h2>FROM APPOINTMENTS TO ACTION</h2>
            <p>Track, treat, and thrive—your workflow in one place</p>
          </div>

          <div className="form-section">
            <div className="form-group">
              <label>Select Date:</label>
              <select value={selectedDate} onChange={handleDateChange}>
                <option value="" disabled>Select a date</option>
                {availableDates.map((date) => (
                  <option key={date.value} value={date.value}>{date.display}</option>
                ))}
              </select>
              <button className="view-appointments-btn" onClick={() => fetchAppointments(selectedDate, doctorId)}>
                View Appointments
              </button>
            </div>

            <div className="appointments-section">
              <h3>Appointments for {selectedDate || 'selected date'}</h3>
              {loadingAppointments && <p>Loading appointments...</p>}
              {appointmentError && <p className="error">{appointmentError}</p>}
              {!loadingAppointments && !appointmentError && (
                appointments.length > 0 ? (
                  <table className="appointments-table">
                    <thead>
                      <tr>
                        <th>Time</th>
                        <th>Patient Name</th>
                        <th>Patient ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map((appointment) => (
                        <tr key={appointment._id || `${appointment.patient}-${appointment.slot}`}>
                          <td>{appointment.slot}</td>
                          <td>{appointment.patient?.name || 'N/A'}</td>
                          <td
                            className="clickable-patient-id"
                            onClick={() => handleViewPatientDetails(appointment.patient?._id)}
                          >
                            {appointment.patient?._id || 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>{selectedDate ? 'No appointments found for this date.' : 'Select a date to view appointments.'}</p>
                )
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Patient Details */}
        <div className="patient-details-panel right-panel">
          <h2>Patient Details</h2>
          {patientDetails ? (
            <>
              <p><strong>Name:</strong> {patientDetails.name}</p>
              <p><strong>Email:</strong> {patientDetails.email}</p>
              <p><strong>Age:</strong> {patientDetails.age}</p>
              <p><strong>Gender:</strong> {patientDetails.gender}</p>
              <p><strong>Height:</strong> {patientDetails.height}</p>
              <p><strong>Weight:</strong> {patientDetails.weight}</p>
              <p><strong>Blood Group:</strong> {patientDetails.bloodGroup}</p>
              <p><strong>Additional Details:</strong> {patientDetails.additionalDetails}</p>
            </>
          ) : (
            <p>Select a patient ID to view details</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default DoctorDashboard;
