import React, { useState } from 'react';
import '../styles/DoctorDashboard.css'; 

function DoctorDashboard() {
  const [selectedDate, setSelectedDate] = useState('');
  const [patientId, setPatientId] = useState('');

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
                onChange={(e) => setSelectedDate(e.target.value)}
              >
                <option value="" disabled>Select a date</option>
                <option value="today">Today</option>
                <option value="tomorrow">Tomorrow</option>
                <option value="nextWeek">Next Week</option>
              </select>
            </div>

            <button className="action-button">View Schedule</button>

            <div className="form-group">
              <label>Patient ID:</label>
              <input 
                type="text" 
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                placeholder="Enter patient ID"
              />
            </div>

            <button className="action-button">View Patient Details</button>
          </div>
        </div>

        <div className="sidebar">
          <div className="doctor-avatar">
            <img src="/doctor-avatar.png" alt="Doctor" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorDashboard;