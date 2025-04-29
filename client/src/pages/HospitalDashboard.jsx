import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// Import a CSS file for styling, similar to DoctorDashboard.jsx
import '../styles/HospitalDashboard.css'; // You will need to create this file

const HospitalDashboard = () => {
  const [hospital, setHospital] = useState(null);
  // dashboardDoctors now stores objects like { doctor: { ...doctorData }, availableSlots: [...] }
  const [dashboardDoctors, setDashboardDoctors] = useState([]);
  const [availableDoctors, setAvailableDoctors] = useState([]); // doctors to pick from dropdown
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  // State to hold slots being added for the currently selected doctor
  const [currentSlotsForDoctor, setCurrentSlotsForDoctor] = useState([]);
  // State for the input fields for a single new slot (including date)
  const [newSlotInput, setNewSlotInput] = useState({ date: '', from: '', to: '' });
  const [timings, setTimings] = useState([]);
  const [newTiming, setNewTiming] = useState({ from: '', to: '' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const hospitalId = localStorage.getItem('hospitalId');

  // Fetch Hospital Data
  useEffect(() => {
    if (!hospitalId) {
      setError('Hospital ID is missing. Please log in again.');
      return;
    }

    const fetchHospitalData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/hospital/dashboard/${hospitalId}`);
        setHospital(response.data);
        // The backend now sends dashboardDoctors with populated doctor details and specific slots
        setDashboardDoctors(response.data.dashboardDoctors || []);
        // The backend sends registeredDoctors for the dropdown
        setAvailableDoctors(response.data.registeredDoctors || []);
        setTimings(response.data.timings || []);
      } catch (err) {
        console.error(err);
        setError('Error fetching hospital data');
      }
    };

    fetchHospitalData();
  }, [hospitalId]);

  // Handle selection of a doctor from the dropdown
  const handleDoctorSelect = (e) => {
    setSelectedDoctorId(e.target.value);
    // Clear any previously added slots when a new doctor is selected
    setCurrentSlotsForDoctor([]);
    setNewSlotInput({ date: '', from: '', to: '' }); // Clear new slot input fields
    setError(null); // Clear previous errors
  };

  // Handle input changes for adding a new slot
  const handleNewSlotInputChange = (e) => {
    const { name, value } = e.target;
    setNewSlotInput({ ...newSlotInput, [name]: value });
  };

  // Add a slot to the temporary list for the current doctor
  const handleAddSlot = () => {
    if (!newSlotInput.date || !newSlotInput.from || !newSlotInput.to) {
      setError('Please provide date, from time, and to time for the slot.');
      return;
    }
    setCurrentSlotsForDoctor([...currentSlotsForDoctor, newSlotInput]);
    setNewSlotInput({ date: '', from: '', to: '' }); // Clear input fields after adding
    setError(null);
  };

  // Save the selected doctor and their added slots to the dashboard
  const handleSaveDoctorSlots = async () => {
    if (!selectedDoctorId) {
      setError('Please select a doctor before saving slots.');
      return;
    }
    if (currentSlotsForDoctor.length === 0) {
      setError('Please add at least one slot for the doctor.');
      return;
    }

    // Group slots by date and format them as per backend SlotSchema { date: String, slots: [String] }
    const formattedSlots = currentSlotsForDoctor.reduce((acc, slot) => {
      const existingDateEntry = acc.find(entry => entry.date === slot.date);
      const timeSlotString = `${slot.from} - ${slot.to}`;

      if (existingDateEntry) {
        // Add time slot to existing date entry, avoid duplicates
        if (!existingDateEntry.slots.includes(timeSlotString)) {
           existingDateEntry.slots.push(timeSlotString);
        }
      } else {
        // Create a new date entry
        acc.push({ date: slot.date, slots: [timeSlotString] });
      }
      return acc;
    }, []);


    try {
      // Post the doctorId and the hospital-specific slots to the backend
      const response = await axios.post(`http://localhost:5000/api/hospital/dashboard/${hospitalId}/doctor`, {
        doctorId: selectedDoctorId,
        availableSlots: formattedSlots, // Send the formatted slots
      });

      // The backend now returns the updated/added doctor entry
      // Update the dashboardDoctors state based on the response
      if (response.data && response.data.doctor) {
         const updatedOrAddedDoctorEntry = response.data.doctor;

         // Check if the doctor already exists in the current state
         const existingDoctorIndex = dashboardDoctors.findIndex(
             (docEntry) => docEntry.doctor && docEntry.doctor._id.toString() === updatedOrAddedDoctorEntry.doctor._id.toString()
         );

         if (existingDoctorIndex > -1) {
            // Doctor exists, update the entry in the state
            const updatedDashboard = [...dashboardDoctors];
            updatedDashboard[existingDoctorIndex] = updatedOrAddedDoctorEntry;
            setDashboardDoctors(updatedDashboard);
            alert('Doctor slots updated successfully!');
         } else {
            // Doctor was newly added, add the entry to the state
            setDashboardDoctors([...dashboardDoctors, updatedOrAddedDoctorEntry]);
            alert('Doctor added to dashboard successfully!');
         }

      } else {
         // Fallback: If backend response is unexpected, refetch dashboard
         const updatedDashboardResponse = await axios.get(`http://localhost:5000/api/hospital/dashboard/${hospitalId}`);
         setDashboardDoctors(updatedDashboardResponse.data.dashboardDoctors || []);
         alert('Dashboard updated.'); // Generic message
      }

      // Reset the form after successful save/update
      setSelectedDoctorId('');
      setCurrentSlotsForDoctor([]);
      setNewSlotInput({ date: '', from: '', to: '' });
      setError(null);

    } catch (err) {
      console.error(err);
      // Display error message from backend if available
      setError(err.response?.data?.message || 'Error saving doctor and slots');
    }
  };


  // Add Hospital Timing
  const handleAddTiming = () => {
    if (!newTiming.from || !newTiming.to) {
      setError('Please provide valid timing slots.');
      return;
    }
    setTimings([...timings, { from: newTiming.from, to: newTiming.to }]);
    setNewTiming({ from: '', to: '' });
    setError(null);
  };

  // Save Dashboard (This route currently saves timings and the array of doctor _ids.
  // If you need to update doctor-specific slots via this route, the backend PUT
  // route and the data sent here would need modification.)
  const handleSaveDashboard = async () => {
    try {
      // Prepare the data to send: timings and the array of doctor entries
      // The backend PUT route expects an array of embedded doctor objects
      await axios.put(`http://localhost:5000/api/hospital/dashboard/${hospitalId}`, {
        timings,
        // Send the current state of dashboardDoctors which includes doctor ref and slots
        doctors: dashboardDoctors.map(docEntry => ({
           // Ensure docEntry.doctor exists before accessing _id
           doctor: docEntry.doctor ? docEntry.doctor._id : null,
           availableSlots: docEntry.availableSlots
        })).filter(docEntry => docEntry.doctor !== null), // Filter out any entries without a valid doctor reference
      });
      setError(null);
      alert('Dashboard updated successfully!');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error saving dashboard');
    }
  };

  if (!hospital) {
    return <div>{error || 'Loading hospital data...'}</div>;
  }

  return (
    <div className="dashboard-container"> {/* Main container */}
      {/* Header */}
      <div className="header">
        <span className="header-title">Hospital Dashboard</span>
      </div>

     {/* Navigation */}
     <div className="nav-container">
        <div className="logo">MediMeet</div>
        <div className="nav-links">
          <div className="nav-item">
            <div className="nav-link">Home</div>
            <div className="nav-description">Let's Start</div>
          </div>
          <div className="nav-item">
            <div className="nav-link">Contact</div>
            <div className="nav-description">For Help?</div>
          </div>
          <div className="nav-item">
            <div className="nav-link">Logout</div>
            <div className="nav-description">Check Again</div>
          </div>
        </div>
      </div>



      {/* Banner */}
      <div className="banner">
        <h1>EXPAND YOUR REACH. ENHANCE YOUR CARE.</h1>
        <p>Grow with Us in the Digital Health Era.</p>
        
        <div className="icon-container">
          {[1, 2, 3, 4, 5, 6].map((icon, index) => (
            <div key={index} className="icon-box">
              {/* Replace with actual icons */}
              <div className="icon-placeholder"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content - Structured into two columns */}
      <div className="main-content">
        {/* Left Column: Hospital Part */}
        <div className="dashboard-panel left-panel"> {/* Added left-panel class */}
          <div className="panel-title">
            <h2>HOSPITAL OVERVIEW</h2>
            <p>Manage your hospital's information and timings.</p> {/* Adjusted description */}
          </div>

          {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}

          {/* Hospital Timings Section */}
          <div className="form-section"> {/* Use form-section for grouping related inputs/displays */}
            <h3>Hospital Timings</h3>
            <div>
              {timings.length > 0 ? (
                timings.map((timing, index) => (
                  <div key={index}>
                    {timing.from} - {timing.to}
                  </div>
                ))
              ) : (
                <p>No timings added yet.</p>
              )}
            </div>

            {/* Add New Timing */}
            <div className="form-group" style={{ marginTop: '10px' }}> {/* Use form-group for input rows */}
              <input
                type="text"
                placeholder="From (e.g., 9:00 AM)"
                value={newTiming.from}
                onChange={(e) => setNewTiming({ ...newTiming, from: e.target.value })}
                style={{ marginRight: '10px' }}
              />
              <input
                type="text"
                placeholder="To (e.g., 5:00 PM)"
                value={newTiming.to}
                onChange={(e) => setNewTiming({ ...newTiming, to: e.target.value })}
                style={{ marginRight: '10px' }}
              />
              <button className="action-button" onClick={handleAddTiming}>Add Timing</button> {/* Use action-button class */}
            </div>
             {/* Save Hospital Timings Button */}
             <button className="action-button" style={{ marginTop: '20px' }} onClick={handleSaveDashboard}>
                Save Hospital Timings
             </button>
          </div>

           {/* You can add other hospital-specific sections here if needed */}

        </div> {/* End of left-panel */}

        {/* Right Column: Doctor Part */}
        <div className="dashboard-panel right-panel"> {/* Added right-panel class */}
           <div className="panel-title">
             <h2>DOCTOR MANAGEMENT</h2>
             <p>Add and manage doctors and their available slots.</p> {/* Adjusted description */}
           </div>

           {/* Doctors List on Dashboard Section */}
           <div className="form-section"> {/* Use form-section for grouping related inputs/displays */}
             <h3>Doctors in Dashboard</h3>
             <div>
               {dashboardDoctors.length === 0 ? (
                 <p>No doctors added yet.</p>
               ) : (
                 // Iterate through the embedded doctor objects
                 dashboardDoctors.map((doctorEntry, index) => (
                   // Ensure doctorEntry and doctorEntry.doctor exist before accessing properties
                   doctorEntry && doctorEntry.doctor ? (
                     <div key={index} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                       <h4>Dr. {doctorEntry.doctor.name}</h4> {/* Access doctor name */}
                       <h5>Specialization: {doctorEntry.doctor.specialization}</h5> {/* Display specialization */}
                       <h6>Available Slots:</h6>
                       <ul>
                         {/* Iterate through the hospital-specific availableSlots */}
                         {doctorEntry.availableSlots?.map((slotEntry, i) => (
                           <li key={i}>
                             {/* Assuming slotEntry structure is { date: String, slots: [String] } */}
                             <strong>{slotEntry.date}:</strong> {slotEntry.slots.join(', ')} {/* Display date and joined slots */}
                           </li>
                         ))}
                       </ul>
                     </div>
                   ) : (
                     // Handle cases where doctor might not be populated or entry is malformed
                     <div key={index}>Error loading doctor details for this entry.</div>
                   )
                 ))
               )}
             </div>
           </div>


           {/* Add New Doctor to Dashboard Section */}
           <div className="form-section" style={{ marginTop: '30px' }}>
             <h3>Add Doctor to Dashboard</h3>
             <div className="form-group" style={{ marginBottom: '10px' }}>
               <label htmlFor="doctor-select" style={{ marginRight: '10px' }}>Select Doctor:</label>
               <select
                 id="doctor-select"
                 value={selectedDoctorId}
                 onChange={handleDoctorSelect}
                 style={{ marginRight: '10px' }}
               >
                 <option value="">-- Select Doctor --</option>
                 {/* Use availableDoctors for the dropdown */}
                 {availableDoctors.map((doctor) => (
                   <option key={doctor._id} value={doctor._id}>
                     {doctor.name} - {doctor.specialization}
                   </option>
                 ))}
               </select>
             </div>

             {/* Section to Add Slots for Selected Doctor */}
             {selectedDoctorId && (
               <div style={{ border: '1px dashed #ccc', padding: '15px', marginTop: '15px' }}>
                 <h4>Add Slots for {availableDoctors.find(doc => doc._id === selectedDoctorId)?.name}</h4>

                 {/* Display temporarily added slots */}
                 {currentSlotsForDoctor.length > 0 && (
                   <div style={{ marginBottom: '10px' }}>
                     <h5>Slots to be added:</h5>
                     <ul>
                       {currentSlotsForDoctor.map((slot, index) => (
                         <li key={index}>{slot.date}: {slot.from} - {slot.to}</li>
                       ))}
                     </ul>
                   </div>
                 )}

                 {/* Input fields for a new slot */}
                 {/* Using form-group for better structure and potential CSS styling */}
                 <div className="form-group" style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <input
                      type="date"
                      name="date"
                      value={newSlotInput.date}
                      onChange={handleNewSlotInputChange}
                    />
                    <input
                      type="text"
                      name="from"
                      placeholder="From (e.g., 10:00 AM)"
                      value={newSlotInput.from}
                      onChange={handleNewSlotInputChange}
                    />
                    <input
                      type="text"
                      name="to"
                      placeholder="To (e.g., 1:00 PM)"
                      value={newSlotInput.to}
                      onChange={handleNewSlotInputChange}
                    />
                    <button className="action-button" onClick={handleAddSlot}>Add Slot</button> {/* Use action-button class */}
                 </div>

                 {/* Button to Save the Doctor and their added Slots */}
                 <button className="action-button" onClick={handleSaveDoctorSlots} style={{ marginTop: '10px' }}>
                   Save Doctor Slots
                 </button>
               </div>
             )}
           </div> {/* End of Add New Doctor Section */}

        </div> {/* End of right-panel */}

      </div> {/* End of main-content */}
    </div> // End of dashboard-container
  );
};

export default HospitalDashboard;
