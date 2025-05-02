import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/Login.css';

const PatientLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/patient/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        alert("Login Successful!");

        // ✅ Store patient object with only name and email (if that's what the backend sends)
        localStorage.setItem("patient", JSON.stringify({
          name: data.patient.name,
          email: data.patient.email
        }));

        if (remember) {
          localStorage.setItem("authToken", data.token);
        }

        navigate("/dashboard/patient");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>

        {error && <p className="error">{error}</p>}

        <label>Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="remember-me">
          <input
            type="checkbox"
            id="remember"
            checked={remember}
            onChange={() => setRemember(!remember)}
          />
          <label htmlFor="remember">Remember Me</label>
        </div>

        <button type="submit">Login</button>

        <div className="login-links">
          <a href="#">Forgot Password?</a>
          <a href="/register/patient">New to MediMeet? Register Here</a>
        </div>
      </form>
    </div>
  );
};

export default PatientLogin;
