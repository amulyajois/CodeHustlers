import React from "react";
import '../styles/DoctorRegister.css'; 

const RegisterDoctor = () => {
  return (
    <div className="register-container">
      <form className="register-form">
        <h2 className="logo">MediMeet</h2>
        <h3>CREATE AN ACCOUNT</h3>
        
        <input type="text" placeholder="Enter your name" />
        <input type="email" placeholder="Enter your email-address" />
        <input type="text" placeholder="Hospital name" />
        
        <select>
          <option>Select Specialization</option>
          <option>Cardiology</option>
          <option>Dermatology</option>
          <option>Pediatrics</option>
          <option>Neurology</option>
        </select>

        <input type="password" placeholder="Create a password" />
        <input type="password" placeholder="Confirm your password" />
        
        <div className="terms">
          <input type="checkbox" id="terms" />
          <label htmlFor="terms">
            I agree to the <a href="#">terms and privacy policy</a>
          </label>
        </div>

        <button type="submit">Register</button>
        <p>Already have an account? <a href="/login/doctor">Login</a></p>
      </form>
    </div>
  );
};

export default RegisterDoctor;
