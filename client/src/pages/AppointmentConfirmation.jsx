import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios'; // Import axios
import '../styles/AppointmentConfirmation.css';

const AppointmentConfirmation = () => {
  const location = useLocation();
  const [bookingInfo, setBookingInfo] = useState(null);
  const [hospitalName, setHospitalName] = useState(''); // State for hospital name
  const [doctorName, setDoctorName] = useState('');     // State for doctor name
  const [loading, setLoading] = useState(true);         // State for loading indicator
  const [error, setError] = useState(null);             // State for error handling

  useEffect(() => {
    // Check if booking details were passed via state
    if (location.state && location.state.bookingDetails) {
      setBookingInfo(location.state.bookingDetails);
      setLoading(false); // Booking info received, stop initial loading
    } else {
      setError("No booking details provided.");
      setLoading(false);
    }
  }, [location]);

  useEffect(() => {
    // Fetch hospital and doctor names when bookingInfo is available
    const fetchNames = async () => {
      if (bookingInfo && bookingInfo.hospitalId && bookingInfo.doctorId) {
       try {
          // Fetch Hospital Name using bookingInfo.hospital (the ObjectId)
          const hospitalRes = await axios.get(`http://localhost:5000/api/hospital/${bookingInfo.hospital}`);
          setHospitalName(hospitalRes.data.hospitalName); // Adjust based on your backend response

          // Fetch Doctor Name using bookingInfo.doctor (the ObjectId)
          const doctorRes = await axios.get(`http://localhost:5000/api/doctor/${bookingInfo.doctor}`);
          setDoctorName(doctorRes.data.name); // Adjust based on your backend response

          setLoading(false); // Stop loading after fetching names

        }  catch (err) {
          console.error("Failed to fetch hospital or doctor details:", err);
          setError("Failed to load hospital or doctor details.");
        }
      }
    };

    fetchNames();
  }, [bookingInfo]); // This effect runs when bookingInfo changes

  // Render loading or error state
  if (loading) {
    return <div className="confirmation-container">Loading appointment details...</div>;
  }

  if (error) {
    return <div className="confirmation-container error">Error: {error}</div>;
  }

  // Render null or a message if bookingInfo is still not available after loading
  if (!bookingInfo) {
     return <div className="confirmation-container">No appointment details to display.</div>;
  }


  return (
    <div className="confirmation-container">
      <header className="header">
        <h1 className="logo">MediMeet</h1>
        <nav className="nav-links">
          <a href="#">Contact<br /><span>For Help?</span></a>
          <a href="#">Dashboard<br /><span>Book Again</span></a>
          <a href="#">Logout<br /><span>Book Again</span></a>
        </nav>
      </header>

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

      <div className="main-content">
        <div className="form-section">
          <h3>Appointment Confirmed!</h3>
          <p>Your appointment has been successfully booked</p>
          <form className="confirmation-form">
            <label>Appointment_id:</label>
            <input type="text" readOnly value={bookingInfo._id || ''} />
            <label>Patient_id</label>
            <input type="text" readOnly value={bookingInfo.patient || ''} />
            <label>Hospital name</label>
            {/* Use the fetched hospitalName state */}
            <input type="text" readOnly value={hospitalName || 'Fetching...'} />
            <label>Doctor name</label>
            {/* Use the fetched doctorName state */}
            <input type="text" readOnly value={doctorName || 'Fetching...'} />
            <label>Date</label>
            <input type="text" readOnly value={bookingInfo.date || ''} />
            <label>Slot:</label>
            <input type="text" readOnly value={bookingInfo.slot || ''} />
          </form>
        </div>
        <div className="image-section">
          <img src="doctor-illustration.png" />
        </div>
      </div>
    </div>
  );
};

export default AppointmentConfirmation;
