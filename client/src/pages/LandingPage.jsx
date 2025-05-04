import React, { useRef } from 'react';
import "../styles/LandingPage.css"; // Make sure this path is correct!
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const rolesSection = useRef(null); // Create a ref for the roles section
  const scrollToRoles = () => {
    const roleSection = document.querySelector('.select-role');
    if (roleSection) {
      roleSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <div className="landing-page">
    {/* Navbar */}
    <header className="navbar">
          <div className="logo">MediMeet</div>
          <nav className="nav-links">
            <a href="/">
              Home<br />
              <span>Let's Start</span>
            </a>
            <a href="/contact">
              Contact<br />
              <span>For Help?</span>
            </a>
            
            <button 
            onClick={scrollToRoles}
            className="scroll-btn"
          >
            Register/Login
            
          </button>
          </nav>
        </header>

      <section className="hero-section">
        <h1>Book Appointment with Trusted Doctors</h1>
        <p>Secure appointments with top city specialists.</p>
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
      </section>

      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Health Appointment Booking Platform</h2>
          <div className="feature-cards">
            <div className="feature-card">
              <div className="feature-icon">
                <img src="/assets/icons/hospital-illustration.png" alt="Hospitals & Clinics" className="feature-img" />
              </div>
              <h3 className="feature-title">Hospitals & Clinics</h3>
              <p className="feature-description">Find the best healthcare facilities near you with detailed information and patient reviews.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <img src="/assets/icons/doctor.png" alt="Find Doctors Nearby" className="feature-img" />
              </div>
              <h3 className="feature-title">Find Doctors Nearby</h3>
              <p className="feature-description">Search for specialists by location, expertise, availability and patient ratings.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <img src="/assets/icons/patient-illustration.png" alt="Book Convenient Appointments" className="feature-img" />
              </div>
              <h3 className="feature-title">Book Convenient Appointments</h3>
              <p className="feature-description">Schedule your visit online in seconds, receive confirmations, and manage your bookings.</p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="why-choose">
        <div className="container">
          <h2 className="section-title">Why Choose MediMeet</h2>
          <div className="benefit-cards">
            <div className="benefit-card">
              <div className="benefit-icon">
                <img src="/assets/icons/schedule.png" alt="Simplified Booking" className="benefit-img" />
              </div>
              <h3 className="benefit-title">Super-Easy Scheduling</h3>
              <p className="benefit-description">Use a modern, intuitive platform to schedule appointments easily and efficiently.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">
                <img src="/assets/icons/computer.png" alt="Data Analytics" className="benefit-img" />
              </div>
              <h3 className="benefit-title">Powerful Personal Dashboards</h3>
              <p className="benefit-description">Access powerful analytics, appointment history, and personalized health data.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="select-role" ref={rolesSection}>

        <h2>Select Your Role</h2>
        <p>Choose how you want to contribute – as a patient, a doctor, or a hospital admin.</p>
        <div className="roles">
          <div className="role-card" onClick={() => navigate("/register/patient")}> 
            <img src="/assets/icons/patient-illustration.png" alt="Patient" />
            <h3>Patient</h3>
            <p>Search, book, and manage your appointments seamlessly.</p>
          </div>
          <div className="role-card" onClick={() => navigate("/register/hospital")}> 
            <img src="/assets/icons/hospital-illustration.png" alt="Hospital" />
            <h3>Hospital</h3>
            <p>Manage doctor availability and patient bookings easily.</p>
          </div>
          <div className="role-card" onClick={() => navigate("/register/doctor")}> 
            <img src="/assets/icons/doctor.png" alt="Doctor" />
            <h3>Doctor</h3>
            <p>Provide quality care and manage appointments efficiently.</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>© 2025 MediMeet. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;