import React from 'react';
import '../styles/PatientRegister.css';

const PatientRegister = () => {
  return (
    <div className="register-container">
      <div className="register-box">
        <h1>MediMeet</h1>
        <h2>CREATE AN ACCOUNT</h2>
        <input type="text" placeholder="Enter your full name" />
        <input type="email" placeholder="Enter your email-address" />
        <input type="tel" placeholder="Enter your phone number" />
        <input type="password" placeholder="Create a password" />
        <input type="password" placeholder="Confirm your password" />
        <div className="checkbox-container">
          <input type="checkbox" /> I agree to the <a href="#">terms and privacy policy</a>
        </div>
        <button>Register</button>
        <p>Already have an account? <a href="/login/patient">Login</a></p>

      </div>
    </div>
  );
};

export default PatientRegister;
