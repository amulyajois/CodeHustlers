import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/HospitalDashboard.css';

const HospitalDashboard = () => {
  const navigate = useNavigate();
  
    // Function to handle logout
    const handleLogout = () => {
      // Here, you can add logic to clear user data or authentication tokens if needed.
      navigate('/login/hospital'); // Redirect back to login page on logout
    };
  return (
    <div className="hospital-dashboard">
      <header className="navbar">
        <div className="logo">MediMeet</div>
        <nav className="nav-links">
          <a href="/">Home<br /><span>Let’s Start</span></a>
          <a href="/contact">Contact<br /><span>For Help?</span></a>
          <a href="/login">Logout<br /><span>Check Again</span></a>
        </nav>
      </header>

      <section className="banner">
        <h2>EXPAND YOUR REACH. ENHANCE YOUR CARE.</h2>
        <p>Grow with Us in the Digital Health Era.</p>
        <div className="icons">
          {[...Array(6)].map((_, i) => (
            <img key={i} src={`/assets/icon${i + 1}.png`} alt={`icon-${i + 1}`} />
          ))}
        </div>
      </section>

      <main className="dashboard-content">
        <h3>CONNECT. CARE. COLLABORATE.</h3>
        <p>Your Hospital, Our Platform, Better Outcomes.</p>

        <form className="hospital-form">
          <div className="timings">
            <label>Hospital Timings:</label>
            <div className="time-inputs">
              <div>
                <label>From:</label>
                <select><option>--</option></select>
              </div>
              <div>
                <label>To:</label>
                <select><option>--</option></select>
              </div>
            </div>
          </div>

          <div className="doctor-row">
            <div>
              <label>Doctor Name:</label>
              <input type="text" />
            </div>
            <div>
              <label>Available Slots:</label>
              <select><option>--</option></select>
            </div>
          </div>

          <div className="buttons">
            <button type="button" className="add">Add More</button>
            <button type="submit" className="done">Done</button>
          </div>
        </form>

        <img src="/assets/hospital-illustration.png" alt="Hospital Illustration" className="illustration" />
      </main>
    </div>
  );
};

export default HospitalDashboard;
