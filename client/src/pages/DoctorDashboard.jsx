import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/DoctorDashboard.css';

const DoctorDashboard = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [patientId, setPatientId] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('doctorId');
    localStorage.removeItem('doctorToken');
    navigate('/login/doctor');
  };

  const viewSchedule = () => {
    if (!selectedDate) {
      alert('Please select a date.');
      return;
    }
    // Navigate to the ViewSchedule page with the selected date
    navigate('/doctor/dashboard/view-schedule', {
      state: { date: selectedDate },
    });
  };

  const viewPatientDetails = () => {
    if (!patientId.trim()) {
      alert('Please enter a patient ID.');
      return;
    }
    alert(`Fetching details for Patient ID: ${patientId}`);
    // You can implement navigate here as well if you have a patient details route
  };

  return (
    <div className="doctor-dashboard">
      <header className="navbar">
        <div className="logo">MediMeet</div>
        <nav className="nav-links">
          <a href="/">Home<br /><span>Let's Start</span></a>
          <a href="/contact">Contact<br /><span>For Help?</span></a>
          <button type="button" onClick={handleLogout} className="logout">
            Logout<br /><span>Check Again</span>
          </button>
        </nav>
      </header>

      <section className="banner">
        <h2>EXPAND YOUR REACH. ENHANCE YOUR CARE.</h2>
        <p>Grow with Us in the Digital Health Era.</p>
        <div className="icons-container">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="icon-hexagon">
              <img src={`/assets/icon${i + 1}.png`} alt={`Icon ${i + 1}`} />
            </div>
          ))}
        </div>
      </section>

      <main className="doctor-content">
        <div className="left-panel">
          <h4>FROM APPOINTMENTS TO ACTION</h4>
          <p>Track, treat, and thrive—your workflow in one place</p>

          <div className="form-group">
            <label>Select Date:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            <button className="primary-button" onClick={viewSchedule}>
              View Schedule
            </button>
          </div>

          <div className="form-group">
            <label>Patient ID:</label>
            <input
              type="text"
              placeholder="Enter Patient ID"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
            />
            <button className="primary-button" onClick={viewPatientDetails}>
              View Patient Details
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;
