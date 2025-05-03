import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/HospitalDashboard.css';

const HospitalDashboard = () => {
  const [hospital, setHospital] = useState(null);
  const [dashboardDoctors, setDashboardDoctors] = useState([]);
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [currentSlotsForDoctor, setCurrentSlotsForDoctor] = useState([]);
  const [newSlotInput, setNewSlotInput] = useState({ date: '', from: '', to: '', ampmFrom: 'AM', ampmTo: 'AM' });
  const [timings, setTimings] = useState([]);
  const [newTiming, setNewTiming] = useState({ from: '', to: '' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const hospitalId = localStorage.getItem('hospitalId');

  useEffect(() => {
    if (!hospitalId) {
      setError('Hospital ID is missing. Please log in again.');
      return;
    }

    const fetchHospitalData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/hospital/dashboard/${hospitalId}`);
        setHospital(response.data);
        setDashboardDoctors(response.data.dashboardDoctors || []);
        setAvailableDoctors(response.data.registeredDoctors || []);
        setTimings(response.data.timings || []);
      } catch (err) {
        console.error(err);
        setError('Error fetching hospital data');
      }
    };

    fetchHospitalData();
  }, [hospitalId]);

  const handleDoctorSelect = (e) => {
    setSelectedDoctorId(e.target.value);
    setCurrentSlotsForDoctor([]);
    setNewSlotInput({ date: '', from: '', to: '', ampmFrom: 'AM', ampmTo: 'AM' });
    setError(null);
  };

  const autoFormatTime = (value) => {
    const cleaned = value.replace(/[^\d]/g, '');
    if (cleaned.length >= 3) {
      return cleaned.slice(0, 2) + ':' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const handleNewSlotInputChange = (e) => {
    const { name, value } = e.target;
    const updatedValue = (name === 'from' || name === 'to') ? autoFormatTime(value) : value;
    setNewSlotInput({ ...newSlotInput, [name]: updatedValue });
  };

  const handleAddSlot = () => {
    const timeRegex = /^\d{2}:\d{2}$/;

    if (!newSlotInput.date || !newSlotInput.from || !newSlotInput.to) {
      setError('Please provide date, from time, and to time for the slot.');
      return;
    }

    if (!timeRegex.test(newSlotInput.from) || !timeRegex.test(newSlotInput.to)) {
      setError('Time must be in "hh:mm" format (e.g., 09:30, 17:45).');
      return;
    }

    const formattedFrom = `${newSlotInput.from} ${newSlotInput.ampmFrom}`;
    const formattedTo = `${newSlotInput.to} ${newSlotInput.ampmTo}`;
    setCurrentSlotsForDoctor([...currentSlotsForDoctor, { date: newSlotInput.date, from: formattedFrom, to: formattedTo }]);
    setNewSlotInput({ date: '', from: '', to: '', ampmFrom: 'AM', ampmTo: 'AM' });
    setError(null);
  };

  const handleSaveDoctorSlots = async () => {
    if (!selectedDoctorId) {
      setError('Please select a doctor before saving slots.');
      return;
    }
    if (currentSlotsForDoctor.length === 0) {
      setError('Please add at least one slot for the doctor.');
      return;
    }

    const formattedSlots = currentSlotsForDoctor.reduce((acc, slot) => {
      const existingDateEntry = acc.find(entry => entry.date === slot.date);
      const timeSlotString = `${slot.from} - ${slot.to}`;

      if (existingDateEntry) {
        if (!existingDateEntry.slots.includes(timeSlotString)) {
          existingDateEntry.slots.push(timeSlotString);
        }
      } else {
        acc.push({ date: slot.date, slots: [timeSlotString] });
      }
      return acc;
    }, []);

    try {
      const response = await axios.post(`http://localhost:5000/api/hospital/dashboard/${hospitalId}/doctor`, {
        doctorId: selectedDoctorId,
        availableSlots: formattedSlots,
      });

      if (response.data && response.data.doctor) {
        const updatedOrAddedDoctorEntry = response.data.doctor;
        const existingDoctorIndex = dashboardDoctors.findIndex(
          (docEntry) => docEntry.doctor && docEntry.doctor._id.toString() === updatedOrAddedDoctorEntry.doctor._id.toString()
        );

        if (existingDoctorIndex > -1) {
          const updatedDashboard = [...dashboardDoctors];
          updatedDashboard[existingDoctorIndex] = updatedOrAddedDoctorEntry;
          setDashboardDoctors(updatedDashboard);
          alert('Doctor slots updated successfully!');
        } else {
          setDashboardDoctors([...dashboardDoctors, updatedOrAddedDoctorEntry]);
          alert('Doctor added to dashboard successfully!');
        }
      } else {
        const updatedDashboardResponse = await axios.get(`http://localhost:5000/api/hospital/dashboard/${hospitalId}`);
        setDashboardDoctors(updatedDashboardResponse.data.dashboardDoctors || []);
        alert('Dashboard updated.');
      }

      setSelectedDoctorId('');
      setCurrentSlotsForDoctor([]);
      setNewSlotInput({ date: '', from: '', to: '', ampmFrom: 'AM', ampmTo: 'AM' });
      setError(null);

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error saving doctor and slots');
    }
  };

  const handleAddTiming = () => {
    if (!newTiming.from || !newTiming.to) {
      setError('Please provide valid timing slots.');
      return;
    }
    setTimings([...timings, { from: newTiming.from, to: newTiming.to }]);
    setNewTiming({ from: '', to: '' });
    setError(null);
  };

  const handleSaveDashboard = async () => {
    try {
      await axios.put(`http://localhost:5000/api/hospital/dashboard/${hospitalId}`, {
        timings,
        doctors: dashboardDoctors.map(docEntry => ({
          doctor: docEntry.doctor ? docEntry.doctor._id : null,
          availableSlots: docEntry.availableSlots
        })).filter(docEntry => docEntry.doctor !== null),
      });
      setError(null);
      alert('Dashboard updated successfully!');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error saving dashboard');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("hospitalId");
    navigate('/login/hospital');
  };

  if (!hospital) {
    return <div>{error || 'Loading hospital data...'}</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="navbar">
        <div className="logo">MediMeet</div>
        <nav className="nav-links">
          <a href="/">Home<br /><span>Let's Start</span></a>
          <a href="/contact">Contact<br /><span>For Help?</span></a>
          <a href="#" onClick={handleLogout} className="logout">
            Logout<br /><span>Book Again</span>
          </a>
        </nav>
      </header>

      <div className="banner">
        <h1>EXPAND YOUR REACH. ENHANCE YOUR CARE.</h1>
        <p>Grow with Us in the Digital Health Era.</p>
        <div className="icon-container">
          {[1, 2, 3, 4, 5, 6].map((icon, index) => (
            <div key={index} className="icon-box">
              <img src={`/assets/icons/icon${icon}.png`} alt={`icon-${icon}`} className="banner-icon" />
            </div>
          ))}
        </div>
      </div>

      <div className="main-content doctor-management-grid">
        <div className="doctor-form-box">
          <div className="panel-title">
            <h2>DOCTOR MANAGEMENT</h2>
            <p>Add and manage doctors and their available slots.</p>
          </div>

          <div className="form-section">
            <h3>Add Doctor to Dashboard</h3>
            <div className="form-group">
              <label htmlFor="doctor-select">Select Doctor:</label>
              <select
                id="doctor-select"
                value={selectedDoctorId}
                onChange={handleDoctorSelect}
              >
                <option value="">-- Select Doctor --</option>
                {availableDoctors.map((doctor) => (
                  <option key={doctor._id} value={doctor._id}>
                    {doctor.name} - {doctor.specialization}
                  </option>
                ))}
              </select>
            </div>

            {selectedDoctorId && (
              <div className="slot-entry-box">
                <h4>Add Available Slots</h4>

                <div className="slot-inputs">
                  <div>
                    <label>Date:</label>
                    <input 
                      type="date" 
                      name="date" 
                      value={newSlotInput.date} 
                      onChange={handleNewSlotInputChange} 
                    />
                  </div>
                  
                  <div className="time-input-group">
                    <label>From:</label>
                    <div className="time-input-wrapper">
                      <input
                        type="text"
                        name="from"
                        value={newSlotInput.from}
                        onChange={handleNewSlotInputChange}
                        placeholder="hh:mm"
                        pattern="\d{2}:\d{2}"
                        maxLength={5}
                      />
                      <select 
                        name="ampmFrom" 
                        value={newSlotInput.ampmFrom} 
                        onChange={handleNewSlotInputChange}
                      >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="time-input-group">
                    <label>To:</label>
                    <div className="time-input-wrapper">
                      <input
                        type="text"
                        name="to"
                        value={newSlotInput.to}
                        onChange={handleNewSlotInputChange}
                        placeholder="hh:mm"
                        pattern="\d{2}:\d{2}"
                        maxLength={5}
                      />
                      <select 
                        name="ampmTo" 
                        value={newSlotInput.ampmTo} 
                        onChange={handleNewSlotInputChange}
                      >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button className="action-button" onClick={handleAddSlot}>Add Slot</button>

                {currentSlotsForDoctor.length > 0 && (
                  <div className="slot-display-area">
                    <ul>
                      {currentSlotsForDoctor.map((slot, index) => (
                        <li key={index}>{slot.date}: {slot.from} - {slot.to}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <button className="action-button" onClick={handleSaveDoctorSlots}>Save Doctor Slots</button>
              </div>
            )}
          </div>
        </div>

        <div className="doctor-list-box">
          <h3>Doctors in Dashboard</h3>
          {dashboardDoctors.length === 0 ? (
            <p>No doctors added yet.</p>
          ) : (
            dashboardDoctors.map((doctorEntry, index) => (
              doctorEntry && doctorEntry.doctor ? (
                <div key={index} className="doctor-card">
                  <h4>Dr. {doctorEntry.doctor.name}</h4>
                  <h5>Specialization: {doctorEntry.doctor.specialization}</h5>
                  <h6>Available Slots:</h6>
                  <ul>
                    {doctorEntry.availableSlots?.map((slotEntry, i) => (
                      <li key={i}>
                        <strong>{slotEntry.date}:</strong> {slotEntry.slots.join(', ')}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div key={index}>Error loading doctor details for this entry.</div>
              )
            ))
          )}
        </div>
      </div>

      <div className="illustration">
        <img src="/assets/icons/hospital-illustration.png" alt="Hospital Illustration" />
      </div>
    </div>
  );
};

export default HospitalDashboard;