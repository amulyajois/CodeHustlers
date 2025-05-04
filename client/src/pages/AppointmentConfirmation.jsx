import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/AppointmentConfirmation.css';

const AppointmentConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate(); // ✅ Added navigate hook

  const [bookingInfo, setBookingInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (location.state && location.state.bookingDetails) {
      setBookingInfo(location.state.bookingDetails);
      setLoading(false);
    } else {
      setError("No booking details provided.");
      setLoading(false);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("patientId");
    navigate('/login/patient');
  };

  const handleBook = () => {
    navigate('/dashboard/patient');
  };

  if (loading) {
    return <div className="confirmation-container">Loading appointment details...</div>;
  }

  if (error) {
    return <div className="confirmation-container error">Error: {error}</div>;
  }

  if (!bookingInfo) {
    return <div className="confirmation-container">No appointment details to display.</div>;
  }

  return (
    <div className="confirmation-container">
      <header className="navbar">
        <div className="logo">MediMeet</div>
        <nav className="nav-links">
          <button onClick={() => navigate('/')}>
            Home<br />
            <span>Let's Start</span>
          </button>
          <button onClick={handleBook} className="BookAgain">
            Book Again
          </button>
          <button onClick={handleLogout} className="logout">
            Logout
          </button>
        </nav>
      </header>

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

      <div className="main-content">
      <div className="form-wrapper">
  <div className="confirmation-box">
    <h3>Appointment Confirmed!</h3>
    <p>Your appointment has been successfully booked</p>
    <form className="confirmation-form">
      <label>Appointment ID:</label>
      <input type="text" readOnly value={bookingInfo._id || ''} />
      <label>Patient ID:</label>
      <input type="text" readOnly value={bookingInfo.patient || ''} />
      <label>Date:</label>
      <input type="text" readOnly value={bookingInfo.date || ''} />
      <label>Slot:</label>
      <input type="text" readOnly value={bookingInfo.slot || ''} />
    </form>
  </div>
</div>

        
      </div>
    </div>
  );
};

export default AppointmentConfirmation;
