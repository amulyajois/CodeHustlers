import React from "react";
import '../styles/HospitalRegister.css';


const RegisterHospital = () => {
  return (
    <div className="register-container">
      <form className="register-form">
        <h2 className="logo">MediMeet</h2>
        <h3>CREATE AN ACCOUNT</h3>
        
        <input type="text" placeholder="Enter hospital name" />
        <input type="email" placeholder="Enter email-address" />
        
        <select>
          <option>Select State</option>
          <option>Maharashtra</option>
          <option>Delhi</option>
          <option>Karnataka</option>
        </select>

        <select>
          <option>Select District</option>
          <option>Pune</option>
          <option>Bangalore</option>
          <option>South Delhi</option>
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
        <p>Already have an account? <a href="/login/hospital">Login</a></p>
      </form>
    </div>
  );
};

export default RegisterHospital;
