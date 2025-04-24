import React from "react";
import { useNavigate } from 'react-router-dom';
import "../styles/DoctorDashboard.css";

const DoctorDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/DoctorLogin');
  };

  return (
    <div className="doctor-dashboard">
      <header className="navbar">
        <div className="logo">MediMeet</div>
        <nav className="nav-links">
          <a href="/">Home<br /><span>Let’s Start</span></a>
          <a href="#">Contact<br /><span>For Help?</span></a>
          <a onClick={handleLogout} href="#">Logout<br /><span>Check Again</span></a>
        </nav>
      </header>

      <section className="banner">
        <h2>EXPAND YOUR REACH. ENHANCE YOUR CARE.</h2>
        <p>Grow with Us in the Digital Health Era.</p>
        <div className="icons">
          {/* Add icons if needed */}
        </div>
      </section>

      <main className="dashboard-section">
        <h3>YOUR APPOINTMENT REQUESTS</h3>
        <p>Manage your schedule and patient details</p>

        <form className="doctor-form">
          <div className="form-group">
            <label>Select Date:</label>
            <select>
              <option>Select Date</option>
              <option>2025-04-25</option>
              <option>2025-04-26</option>
            </select>
            <button type="button">View Schedule</button>
          </div>

          <div className="form-group">
            <label>Patient ID:</label>
            <input type="text" placeholder="Enter Patient ID" />
            <button type="button">View Patient Details</button>
          </div>
        </form>

        <img src="/assets/doctor-illustration.png" alt="Doctor Illustration" className="illustration" />
      </main>
    </div>
  );
};

export default DoctorDashboard;
