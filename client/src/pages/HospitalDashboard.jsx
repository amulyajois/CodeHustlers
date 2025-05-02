




import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/HospitalDashboard.css';

const HospitalDashboard = () => {
  const navigate = useNavigate();

  const [hospitalTimings, setHospitalTimings] = useState([{ from: '', to: '' }]);
  const [doctors, setDoctors] = useState([{ name: '', specialization: '', availableSlots: [{ date: '', slots: [''] }] }]);
  const [hospitalId, setHospitalId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem('hospitalId');
    if (id) {
      setHospitalId(id);
      fetchHospitalData(id);
    }
  }, []);

  const fetchHospitalData = async (id) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`http://localhost:5000/api/hospital/dashboard/${id}`);
      if (data.timings) setHospitalTimings(data.timings);
      if (data.doctors) setDoctors(data.doctors);
    } catch (error) {
      console.error('Error fetching hospital data:', error);
      alert('Error loading hospital data!');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('hospitalId');
    localStorage.removeItem('hospitalToken');
    navigate('/login/hospital');
  };

  const handleTimingChange = (index, field, value) => {
    const updated = hospitalTimings.map((timing, i) =>
      i === index ? { ...timing, [field]: value } : timing
    );
    setHospitalTimings(updated);
  };

  const handleDoctorChange = (index, field, value) => {
    const updated = doctors.map((doctor, i) =>
      i === index ? { ...doctor, [field]: value } : doctor
    );
    setDoctors(updated);
  };

  const handleSlotChange = (doctorIndex, slotIndex, field, value) => {
    const updatedDoctors = [...doctors];
    updatedDoctors[doctorIndex].availableSlots[slotIndex][field] = value;
    setDoctors(updatedDoctors);
  };

  const handleSlotTimeChange = (doctorIndex, slotIndex, timeIndex, value) => {
    const updatedDoctors = [...doctors];
    updatedDoctors[doctorIndex].availableSlots[slotIndex].slots[timeIndex] = value;
    setDoctors(updatedDoctors);
  };

  const addTiming = () => {
    setHospitalTimings(prev => [...prev, { from: '', to: '' }]);
  };

  const addDoctor = () => {
    setDoctors(prev => [...prev, { name: '', specialization: '', availableSlots: [{ date: '', slots: [''] }] }]);
  };

  const addDoctorSlot = (doctorIndex) => {
    const updatedDoctors = [...doctors];
    updatedDoctors[doctorIndex].availableSlots.push({ date: '', slots: [''] });
    setDoctors(updatedDoctors);
  };

  const addTimeSlot = (doctorIndex, slotIndex) => {
    const updatedDoctors = [...doctors];
    updatedDoctors[doctorIndex].availableSlots[slotIndex].slots.push('');
    setDoctors(updatedDoctors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hospitalId) {
      alert('Hospital ID is missing. Please login again.');
      navigate('/login/hospital');
      return;
    }
  
    setLoading(true);
    try {
      const { data } = await axios.put(`http://localhost:5000/api/hospital/dashboard/${hospitalId}`, {
        timings: hospitalTimings,
        doctors,
      });
  
      alert(data.message || 'Dashboard updated successfully!');
  
      // ✅ Clear inputs after successful submission
      setHospitalTimings([{ from: '', to: '' }]);
      setDoctors([{ name: '', specialization: '', availableSlots: [{ date: '', slots: [''] }] }]);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(error.response?.data?.message || 'Failed to update dashboard!');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="hospital-dashboard">
      {loading && <div className="loading-overlay">Loading...</div>}

      <div className="container">
        <header className="navbar">
          <div className="logo">MediMeet</div>
          <nav className="nav-links">
            <a href="/">Home<br /><span>Let's Start</span></a>
            <a href="/contact">Contact<br /><span>Need Help?</span></a>
            <button type="button" onClick={handleLogout} className="logout">
              Logout<br /><span>Manage Again</span>
            </button>
          </nav>
        </header>

        <section className="banner">
          <h2>Manage Your Hospital Appointments</h2>
          <p>Set schedules, manage doctors, and organize patient slots</p>
          <div className="icons-container">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="icon-hexagon">
                <img src={`/assets/icon${i + 1}.png`} alt={`Medical specialty icon ${i + 1}`} />
              </div>
            ))}
          </div>
        </section>

        <main className="booking-section">
          <div className="booking-header">
            <h3>Hospital Schedule Management Platform</h3>
            <p>Organize Your Schedule – Manage Your Patients Efficiently!</p>
          </div>

          <form onSubmit={handleSubmit} className="booking-form-container">
            <div className="form-left">
              <h4>Hospital Timings</h4>
              {hospitalTimings.map((timing, index) => (
                <div key={index} className="time-inputs">
                  <div>
                    <label>From:</label>
                    <input
                      type="time"
                      value={timing.from}
                      onChange={(e) => handleTimingChange(index, 'from', e.target.value)}
                    />
                  </div>
                  <div>
                    <label>To:</label>
                    <input
                      type="time"
                      value={timing.to}
                      onChange={(e) => handleTimingChange(index, 'to', e.target.value)}
                    />
                  </div>
                </div>
              ))}
              <button type="button" className="secondary-button" onClick={addTiming}>
                Add More Timings
              </button>
            </div>

            <div className="form-right">
              <h4>Doctors & Slots</h4>
              {doctors.map((doctor, doctorIndex) => (
                <div key={doctorIndex} className="doctor-row">
                  <div className="doctor-inputs">
                    <input
                      type="text"
                      placeholder="Doctor Name"
                      value={doctor.name}
                      onChange={(e) => handleDoctorChange(doctorIndex, 'name', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Specialization"
                      value={doctor.specialization}
                      onChange={(e) => handleDoctorChange(doctorIndex, 'specialization', e.target.value)}
                    />
                  </div>

                  <div className="slots-container">
                    <h5>Available Slots:</h5>
                    {doctor.availableSlots.map((slot, slotIndex) => (
                      <div key={slotIndex} className="slot-container">
                        <div className="slot-date">
                          <label>Date:</label>
                          <input
                            type="date"
                            value={slot.date}
                            onChange={(e) => handleSlotChange(doctorIndex, slotIndex, 'date', e.target.value)}
                          />
                        </div>

                        {slot.slots.map((time, timeIndex) => (
                          <div key={timeIndex} className="slot-time">
                            <label>Slot {timeIndex + 1}:</label>
                            <input
                              type="time"
                              value={time}
                              onChange={(e) => handleSlotTimeChange(doctorIndex, slotIndex, timeIndex, e.target.value)}
                            />
                          </div>
                        ))}

                        <button
                          type="button"
                          className="secondary-button"
                          onClick={() => addTimeSlot(doctorIndex, slotIndex)}
                        >
                          Add More Time Slots
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() => addDoctorSlot(doctorIndex)}
                    >
                      Add More Slots
                    </button>
                  </div>
                </div>
              ))}

              <button type="button" className="add-doctor" onClick={addDoctor}>
                Add More Doctors
              </button>

              <button type="submit" className="book-now-btn">Save Changes</button>
            </div>
          </form>
        </main>
      </div>
    </div>
    
  
  );
};

export default HospitalDashboard;