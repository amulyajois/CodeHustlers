import React from "react";
import "../styles/LandingPage.css";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <header className="navbar">
        <div className="logo">MediMeet</div>
        <nav className="nav-links">
          <a href="/">Home</a>
          <a href="/contact">Contact</a>
          <a href="/login">Login</a>
          <a href="/register">Register</a>
        </nav>
      </header>

      <section className="hero-section">
        <h1>Book Appointment with Trusted Doctors</h1>
        <p>Secure appointments with top city specialists.</p>
        <div className="hero-icons">
          {[...Array(6)].map((_, i) => (
            <div className="icon-box" key={i}>
            {/*  <img src={/assets/icon${i + 1}.png} alt={icon-${i + 1}} />*/}
            </div>
          ))}
        </div>
      </section>

      <section className="booking-platform">
        <h2>Health Appointment Booking Platform</h2>
        <div className="cards">
          {["Hospital & Clinics", "Find Doctors Nearby", "Book Convenient Appointment"].map((title, i) => (
            <div className="card" key={i}>
            {/*  <img src={/assets/feature${i + 1}.png} alt={title} />*/}
              <h3>{title}</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vel elit id orci.</p>
            </div>
          ))}
        </div>
      </section>

      <section className="why-choose">
        <h2>Why Choose MediMeet</h2>
        <div className="cards">
          <div className="card">
            <img src="/assets/simplified-booking.png" alt="Simplified Booking" />
            <h3>Super-Easy Scheduling</h3>
            <p>Use a modern, intuitive platform to schedule appointments easily and efficiently.</p>
          </div>
          <div className="card">
            <img src="/assets/data-analytics.png" alt="Data Analytics" />
            <h3>Powerful Personal Dashboards</h3>
            <p>Access powerful analytics, appointment history, and personalized health data.</p>
          </div>
        </div>
      </section>

      <section className="select-role">
        <h2>Select Your Role</h2>
        <p>Choose how you want to contribute – as a patient, a doctor, or a hospital admin.</p>
        <div className="roles">
          <div className="role-card" onClick={() => navigate("/register/patient")}> 
            <img src="/assets/role1.png" alt="Patient" />
            <h3>Patient</h3>
            <p>Search, book, and manage your appointments seamlessly.</p>
          </div>
          <div className="role-card" onClick={() => navigate("/register/hospital")}> 
            <img src="/assets/role2.png" alt="Hospital" />
            <h3>Hospital</h3>
            <p>Manage doctor availability and patient bookings easily.</p>
          </div>
          <div className="role-card" onClick={() => navigate("/register/doctor")}> 
            <img src="/assets/role3.png" alt="Doctor" />
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