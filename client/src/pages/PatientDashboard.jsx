import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/PatientDashboard.css';  // Your custom CSS

export default function PatientDashboard() {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    bloodGroup: '',
    healthCondition: '',
    state: '',
    district: '',
    hospital: '',
    doctor: '',
    date: '',
    slot: ''
  });

  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [slots, setSlots] = useState([]);

  // Load patient info from localStorage
  useEffect(() => {
    const patient = JSON.parse(localStorage.getItem("patient"));
    if (patient) {
      setFormData(prev => ({
        ...prev,
        name: patient.name || '',
        email: patient.email || ''
      }));
    }
  }, []);

  // Fetch states on component mount
  useEffect(() => {
    axios.get('/api/states')
  .then(res => {
    console.log(res.data);  // ✅ This should log: ["Himachal Pradesh"]
    setStates(res.data);
  })

      .catch(err => console.error('Error fetching states:', err));
  }, []);

  // Fetch districts when state changes
  useEffect(() => {
    if (formData.state) {
      axios.get(`/api/districts/${formData.state}`)
        .then(res => setDistricts(res.data))
        .catch(err => console.error('Error fetching districts:', err));
    }
  }, [formData.state]);

  // Fetch hospitals when district changes
  useEffect(() => {
    if (formData.state && formData.district) {
      axios.get(`/api/hospitals?state=${formData.state}&district=${formData.district}`)
        .then(res => setHospitals(res.data))
        .catch(err => console.error('Error fetching hospitals:', err));
    }
  }, [formData.district]);

  // Fetch doctors when hospital changes
  useEffect(() => {
    if (formData.hospital) {
      axios.get(`/api/hospitals/${formData.hospital}/doctors`)
        .then(res => setDoctors(res.data))
        .catch(err => console.error('Error fetching doctors:', err));
    }
  }, [formData.hospital]);

  // Fetch slots when doctor or date changes
  useEffect(() => {
    if (formData.doctor && formData.date) {
      axios.get(`/api/slots/${formData.doctor}?date=${formData.date}`)
        .then(res => setSlots(res.data))
        .catch(err => console.error('Error fetching slots:', err));
    }
  }, [formData.doctor, formData.date]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/submit-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (res.ok) {
        alert("Booking Successful!");
      } else {
        alert(data.message || "Booking failed");
      }
    } catch (err) {
      alert("Something went wrong. Please try again.");
    }
  };
  console.log("Form State:", formData.state);
console.log("States List:", states);

  return (
    <div className="container">
      <div className="top-border"></div>

      <header className="navbar">
        <div className="logo">MediMeet</div>
        <div className="nav-items">
          <div><span>Home</span><small>Let's Start</small></div>
          <div><span>Contact</span><small>For Help?</small></div>
          <div><span>Logout</span><small>Book Again</small></div>
        </div>
      </header>

      <div className="icon-banner">
        <h2>BOOK APPOINTMENT WITH TRUSTED DOCTORS</h2>
        <p>Search hospitals, find doctors by specialization.</p>
        <div className="icon-row">
          {[...Array(7)].map((_, i) => (
            <img key={i} src={`/icons/icon${i + 1}.png`} alt={`Icon ${i + 1}`} />
          ))}
        </div>
      </div>

      <div className="booking-header">
        <h3>HEALTH APPOINTMENT BOOKING PLATFORM</h3>
        <p>Skip the Wait – Book Your Doctor Instantly!</p>
      </div>

      <main className="main-content">
        <form onSubmit={handleSubmit}>
          <div className="form two-column">
            <div className="form-left">
              <input type="text" placeholder="Enter your name" value={formData.name} readOnly />
              <input name="age" placeholder="Enter your age" value={formData.age} onChange={handleChange} />

              {/* Gender Dropdown */}
              <div className="dropdown">
                <span>Select Gender</span>
                <select name="gender" value={formData.gender} onChange={handleChange}>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              <input name="height" placeholder="Enter Your Height (in cm)" value={formData.height} onChange={handleChange} />
              <input name="weight" placeholder="Enter Your Weight (in kg)" value={formData.weight} onChange={handleChange} />

              {/* Blood Group Dropdown */}
              <div className="dropdown">
                <span>Select Blood Group</span>
                <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange}>
                  <option value="">Select Blood Group</option>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((group) => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-right">
              <div className="dropdown">
                <span>Select your State</span>
                <select name="state" value={formData.state} onChange={handleChange}>
  <option value="">Select State</option>
  {states.map(state => (
    <option key={state._id} value={state._id}>{state.name}</option>
  ))}
</select>


              </div>

              <div className="dropdown">
                <span>Select your District</span>
                <select name="district" value={formData.district} onChange={handleChange}>
                  <option value="">Select District</option>
                  {districts.map(district => (
                    <option key={district._id} value={district._id}>{district.name}</option>
                  ))}
                </select>
              </div>

              <div className="dropdown">
                <span>Search for hospitals</span>
                <select name="hospital" value={formData.hospital} onChange={handleChange}>
                  <option value="">Select Hospital</option>
                  {hospitals.map(h => (
                    <option key={h._id} value={h._id}>{h.name}</option>
                  ))}
                </select>
              </div>

              <div className="dropdown">
                <span>Search for Doctors/Specialization</span>
                <select name="doctor" value={formData.doctor} onChange={handleChange}>
                  <option value="">Select Doctor</option>
                  {doctors.map(doc => (
                    <option key={doc._id} value={doc._id}>{doc.name} ({doc.specialization})</option>
                  ))}
                </select>
              </div>

              <div className="dropdown">
                <span>Choose Date</span>
                <input type="date" name="date" value={formData.date} onChange={handleChange} />
              </div>

              <div className="dropdown">
                <span>Select your Slot</span>
                <select name="slot" value={formData.slot} onChange={handleChange}>
                  <option value="">Select Slot</option>
                  {slots.map((slot, idx) => (
                    <option key={idx} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <textarea
            name="healthCondition"
            placeholder="Additional details regarding your health condition"
            value={formData.healthCondition}
            onChange={handleChange}
            style={{ width: '100%' }}
          />

          <button
            style={{
              width: '100%',
              backgroundColor: 'blue',
              color: 'white',
              padding: '10px',
              border: 'none',
              borderRadius: '5px',
              marginTop: '10px'
            }}
            type="submit"
          >
            Book Now
          </button>
        </form>
      </main>
    </div>
  );
}
