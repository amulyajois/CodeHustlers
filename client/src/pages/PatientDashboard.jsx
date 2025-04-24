import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/PatientDashboard.css';

const PatientDashboard = () => {
  const navigate = useNavigate();

  // Function to handle logout
  const handleLogout = () => {
    // Here, you can add logic to clear user data or authentication tokens if needed.
    navigate('/PatientLogin'); // Redirect back to login page on logout
  };

  return (
    <div className="patient-dashboard">
      {/* Navbar */}
      <header className="navbar">
        <div className="logo">MediMeet</div>
        <nav className="nav-links">
          <a href="/">Home<br /><span>Let’s Start</span></a>
          <a href="/contact">Contact<br /><span>For Help?</span></a>
          <a onClick={handleLogout} href="#">Logout<br /><span>Book Again</span></a>
        </nav>
      </header>

      {/* Banner Section */}
      <section className="banner">
        <h2>BOOK APPOINTMENT WITH TRUSTED DOCTORS</h2>
        <p>Search hospitals, find doctors by specialisation.</p>
        <div className="icons">
          {[...Array(6)].map((_, i) => (
            <img key={i} src={`/assets/icon${i + 1}.png`} alt={`icon-${i + 1}`} />
          ))}
        </div>
      </section>

      {/* Booking Section */}
      <main className="booking-section">
        <h3>HEALTH APPOINTMENT BOOKING PLATFORM</h3>
        <p>Skip the Wait – Book Your Doctor Instantly!</p>

        {/* Booking Form */}
        <form className="booking-form">
          <div className="left">
            <input type="text" placeholder="Enter your name" />
            <input type="number" placeholder="Enter your age" />
            <input type="text" placeholder="Gender" />
            <input type="text" placeholder="Enter Your Height (cm)" />
            <input type="number" placeholder="Enter Your Weight (kg)" />
            <input type="text" placeholder="Enter Your Blood Group" />
            <textarea placeholder="Additional details regarding your health condition"></textarea>
          </div>

          <div className="right">
            <select>
              <option>Select your State</option>
            </select>
            <select>
              <option>Select your District</option>
            </select>
            <select>
              <option>Search for hospitals</option>
            </select>
            <select>
              <option>Search for Doctors/Specialization</option>
            </select>
            <select>
              <option>Choose Date</option>
            </select>
            <select>
              <option>Select your Slot</option>
            </select>
            <button type="submit">Book Now</button>
          </div>
        </form>

        {/* Illustration */}
        <img
          src="/assets/patient-illustration.png"
          alt="Patient Illustration"
          className="illustration"
        />
      </main>
    </div>
  );
};

export default PatientDashboard;
