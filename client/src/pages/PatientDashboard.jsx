import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/PatientDashboard.css";

// Hardcoded list of states and districts for demonstration
// In a real app, you might fetch this from an API or a larger data file
const statesAndDistricts = {
 "Andhra Pradesh": ["Anantapur", "Chittoor", "Guntur", "Kadapa", "Krishna", "Nellore", "Prakasam", "Srikakulam", "Visakhapatnam", "Vizianagaram", "West Godavari", "East Godavari"],
  "Arunachal Pradesh": ["Tawang", "West Kameng", "East Kameng", "Papum Pare", "Kurung Kumey", "Lower Subansiri"],
  "Assam": ["Dibrugarh", "Kamrup", "Nagaon", "Sonitpur", "Tinsukia"],
  "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur"],
  "Chhattisgarh": ["Raipur", "Bilaspur", "Durg"],
  "Delhi": ["New Delhi", "North Delhi", "South Delhi", "East Delhi", "West Delhi"],
  "Goa": ["North Goa", "South Goa"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
  "Haryana": ["Gurgaon", "Faridabad", "Panipat", "Ambala"],
  "Himachal Pradesh": ["Shimla", "Kangra", "Mandi", "Solan"],
  "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad"],
  "Karnataka": ["Bangalore", "Mysore", "Udupi", "Mangalore", "Belgaum"],
  "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Gwalior", "Jabalpur"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik"],
  "Manipur": ["Imphal"],
  "Meghalaya": ["Shillong"],
  "Mizoram": ["Aizawl"],
  "Nagaland": ["Kohima", "Dimapur"],
  "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela"],
  "Punjab": ["Amritsar", "Ludhiana", "Patiala"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur"],
  "Sikkim": ["Gangtok"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai"],
  "Telangana": ["Hyderabad", "Warangal"],
  "Tripura": ["Agartala"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Agra", "Varanasi"],
  "Uttarakhand": ["Dehradun", "Haridwar"],
  "West Bengal": ["Kolkata", "Howrah", "Durgapur"]
};


const PatientDashboard = () => {
  const [patient, setPatient] = useState(null);
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [bookingMessage, setBookingMessage] = useState("");
  const [error, setError] = useState("");
  const [patientDetailsMessage, setPatientDetailsMessage] = useState("");


  // State for additional patient details
  const [patientDetails, setPatientDetails] = useState({
    name: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    bloodGroup: "",
    additionalDetails: "",
  });


  const navigate = useNavigate();
  const patientId = localStorage.getItem("patientId"); // Retrieve patientId from localStorage

  // Load patient data on component mount
  useEffect(() => {
    if (!patientId) {
      setError("Patient ID missing. Please log in again.");
      navigate("/login/patient");
      return;
    }

    const fetchPatient = async () => {
      try {
        // Fetch patient details using the ID from local storage
        const res = await axios.get(`http://localhost:5000/api/patient/${patientId}`);
        setPatient(res.data);
        // Pre-fill patient details form if data exists
        setPatientDetails({
            name: res.data.name || "",
            age: res.data.age || "",
            gender: res.data.gender || "",
            height: res.data.height || "",
            weight: res.data.weight || "",
            bloodGroup: res.data.bloodGroup || "",
            additionalDetails: res.data.additionalDetails || "",
        });
      } catch (err) {
        console.error(err);
        setError("Failed to fetch patient details.");
        // Handle error, e.g., redirect to login if token is invalid/expired
        // localStorage.removeItem("patientId");
        // navigate("/login/patient");
      }
    };

    fetchPatient();
  }, [navigate, patientId]); // Depend on navigate and patientId

  // Handle input changes for patient details form
  const handlePatientDetailsChange = (e) => {
    const { name, value } = e.target;
    setPatientDetails(prevDetails => ({
      ...prevDetails,
      [name]: value
    }));
  };

  // Handle saving patient details
  const handleSavePatientDetails = async () => {
      if (!patientId) {
          setError("Patient ID missing. Cannot save details.");
          return;
      }
      try {
          const res = await axios.put(`http://localhost:5000/api/patient/${patientId}`, patientDetails);
          setPatientDetailsMessage(res.data.message || "Details saved successfully!");
          // Optionally refresh patient data after saving
          // fetchPatient(); // You might want to call fetchPatient again here
      } catch (err) {
          console.error(err);
          setPatientDetailsMessage("Failed to save details.");
      }
  };


  // Handle search hospitals by state and district
  const handleSearchHospitals = async () => {
    if (!state || !district) {
      alert("Please select both state and district.");
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:5000/api/patient/hospitals?state=${state}&district=${district}`
      );
      setHospitals(res.data);
      // Reset selections when searching for new hospitals
      setSelectedHospital(null);
      setDoctors([]);
      setSelectedDoctor(null);
      setSelectedDate("");
      setSelectedSlot("");
      setBookingMessage("");
    } catch (err) {
      console.error(err);
      alert("Failed to fetch hospitals.");
    }
  };

  // Handle selecting a hospital from the dropdown
  const handleSelectHospital = async (hospitalId) => {
    const hospital = hospitals.find((h) => h._id === hospitalId);
    setSelectedHospital(hospital);
    // Reset doctor/slot selections when a new hospital is selected
    setSelectedDoctor(null);
    setSelectedDate("");
    setSelectedSlot("");
    setBookingMessage("");

    try {
      // Fetch doctors for the selected hospital
      const res = await axios.get(
        `http://localhost:5000/api/patient/hospitals/${hospitalId}/doctors`
      );
      setDoctors(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch doctors.");
    }
  };

  // Handle selecting a doctor from the dropdown
  const handleSelectDoctor = (doctorId) => {
    const doctor = doctors.find((d) => d._id === doctorId);
    setSelectedDoctor(doctor);
    // Reset date/slot selections when a new doctor is selected
    setSelectedDate("");
    setSelectedSlot("");
    setBookingMessage("");
  };

  // Handle selecting a date from the available slots
  const handleSelectDate = (date) => {
      setSelectedDate(date);
      setSelectedSlot(""); // Reset slot when date changes
  };

  // Handle selecting a slot from the available slots
  const handleSelectSlot = (slot) => {
      setSelectedSlot(slot);
  };


  // Handle booking the selected slot
   // Handle booking the selected slot
   const handleBookSlot = async () => {
    if (!patientId || !selectedDoctor || !selectedDate || !selectedSlot || !selectedHospital) {
      alert("Please select a hospital, doctor, date, and slot.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/patient/book-slot", {
        patientId, // Use the patientId from local storage
        doctorId: selectedDoctor._id,
        hospitalId: selectedHospital._id,
        date: selectedDate,
        slot: selectedSlot,
        // Include patientDetails in the booking request
        patientDetails: patientDetails
      });

      setBookingMessage(res.data.message || "Booking confirmed!");
      // Assuming the backend returns the new booking details including appointmentId
      const bookingDetails = res.data.booking;

      // Navigate to AppointmentConfirmation and pass booking details
      navigate('/appointment-confirmation', { state: { bookingDetails } });
      // Optionally refresh doctor slots after booking to show the slot is gone
      if (selectedHospital) {
         handleSelectHospital(selectedHospital._id);
      }

    } catch (err) {
      console.error(err);
      setBookingMessage("Failed to book slot.");
    }
  };

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem("patientId"); // Clear patient ID from local storage
    // localStorage.removeItem("patientToken"); // Clear token if stored
    navigate('/login/patient'); // Redirect back to login page on logout
  };

  return (
    <div className="patient-dashboard">
      <div className="container">
       

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
            {/* Use onClick for the logout link */}
            <a href="#" onClick={handleLogout} className="logout">
              Logout<br />
              <span>Book Again</span>
            </a>
          </nav>
        </header>

        {/* Banner Section */}
        <section className="banner">
          <h2>BOOK APPOINTMENT WITH TRUSTED DOCTORS</h2>
          <p>Search hospitals, find doctors by specialization</p>
          {/* Icons container - keep as is or update as needed */}
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

        {/* Booking Section */}
        <main className="booking-section">
          <div className="booking-header">
            <h3>HEALTH APPOINTMENT BOOKING PLATFORM</h3>
            <p>Skip the Wait – Book Your Doctor Instantly!</p>
          </div>

          {/* Booking Form */}
          <div className="booking-form-container">
            <div className="form-left">
              {/* Patient Details Inputs */}
              <input
                type="text"
                placeholder="Enter your name"
                name="name"
                value={patientDetails.name}
                onChange={handlePatientDetailsChange}
                // If name is pre-filled and should not be changed, add readOnly
                // readOnly={!!patientDetails.name} // Uncomment if name should not be editable after fetching
              />
              <input
                type="number"
                placeholder="Enter your age"
                name="age"
                value={patientDetails.age}
                onChange={handlePatientDetailsChange}
              />
              <input
                type="text"
                placeholder="Gender"
                name="gender"
                value={patientDetails.gender}
                onChange={handlePatientDetailsChange}
              />
              <input
                type="text"
                placeholder="Enter Your Height"
                name="height"
                value={patientDetails.height}
                onChange={handlePatientDetailsChange}
              />
              <input
                type="text"
                placeholder="Enter Your Weight"
                name="weight"
                value={patientDetails.weight}
                onChange={handlePatientDetailsChange}
              />
              <input
                type="text"
                placeholder="Enter Your Blood Group"
                name="bloodGroup"
                value={patientDetails.bloodGroup}
                onChange={handlePatientDetailsChange}
              />
              <textarea
                placeholder="Additional details regarding your health condition"
                name="additionalDetails"
                value={patientDetails.additionalDetails}
                onChange={handlePatientDetailsChange}
              ></textarea>
              {/* Button to save patient details */}
              <button onClick={handleSavePatientDetails} className="save-details-btn">Save Details</button>
              {patientDetailsMessage && <p className="message">{patientDetailsMessage}</p>}
            </div>

            <div className="form-right">
              {/* Location Filter Selects */}
              <div className="select-wrapper">
                 <select
                    value={state}
                    onChange={(e) => {
                        setState(e.target.value);
                        setDistrict(""); // Reset district when state changes
                        setHospitals([]); // Reset hospitals
                        setSelectedHospital(null);
                        setDoctors([]); // Reset doctors
                        setSelectedDoctor(null);
                        setSelectedDate("");
                        setSelectedSlot("");
                        setBookingMessage("");
                    }}
                 >
                    <option value="">Select your State</option>
                    {Object.keys(statesAndDistricts).map(stateName => (
                        <option key={stateName} value={stateName}>{stateName}</option>
                    ))}
                 </select>
              </div>
              <div className="select-wrapper">
                 <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    disabled={!state} // Disable district select until state is chosen
                 >
                    <option value="">Select your District</option>
                    {state && statesAndDistricts[state]?.map(districtName => (
                        <option key={districtName} value={districtName}>{districtName}</option>
                    ))}
                 </select>
              </div>
               {/* Search Button */}
               <button onClick={handleSearchHospitals} className="search-hospitals-btn" disabled={!state || !district}>Search Hospitals</button>


              {/* Hospital Select */}
              <div className="select-wrapper">
                <select
                  value={selectedHospital ? selectedHospital._id : ""}
                  onChange={(e) => handleSelectHospital(e.target.value)}
                  disabled={hospitals.length === 0} // Disable if no hospitals found
                >
                  <option value="">Select your Hospital</option>
                  {hospitals.map((hosp) => (
                    <option key={hosp._id} value={hosp._id}>
                      {hosp.hospitalName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Doctor Select */}
              <div className="select-wrapper">
                <select
                  value={selectedDoctor ? selectedDoctor._id : ""}
                  onChange={(e) => handleSelectDoctor(e.target.value)}
                  disabled={doctors.length === 0} // Disable if no doctors found for selected hospital
                >
                  <option value="">Search for Doctors/Specialization</option>
                   {doctors.map((doc) => (
                    <option key={doc._id} value={doc._id}>
                      Dr. {doc.name} ({doc.specialization})
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Select (based on selected doctor's available slots) */}
              <div className="select-wrapper">
                <select
                   value={selectedDate}
                   onChange={(e) => handleSelectDate(e.target.value)}
                   disabled={!selectedDoctor || (selectedDoctor.availableSlots?.length || 0) === 0} // Disable if no doctor selected or no slots
                >
                  <option value="">Choose Date</option>
                   {selectedDoctor?.availableSlots.map((entry) => (
                    <option key={entry.date} value={entry.date}>
                      {entry.date}
                    </option>
                  ))}
                </select>
              </div>

              {/* Slot Select (based on selected date) */}
              <div className="select-wrapper">
                <select
                   value={selectedSlot}
                   onChange={(e) => handleSelectSlot(e.target.value)}
                   disabled={!selectedDate || !(selectedDoctor?.availableSlots.find(d => d.date === selectedDate)?.slots.length)} // Disable if no date selected or no slots for date
                >
                  <option value="">Select your Slot</option>
                   {selectedDoctor?.availableSlots.find(d => d.date === selectedDate)?.slots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>

              {/* Book Now Button */}
              <button
                 type="button" // Use type="button" to prevent form submission
                 className="book-now-btn"
                 onClick={handleBookSlot}
                 disabled={!selectedHospital || !selectedDoctor || !selectedDate || !selectedSlot} // Disable if required fields are not selected
              >
                 Book Now
              </button>

               {/* Booking Message */}
               {bookingMessage && <p className="booking-message">{bookingMessage}</p>}
               {error && <p className="error">{error}</p>} {/* Display general errors */}

            </div>

            {/* Illustration */}
            <div className="illustration">
              {/* Ensure image path is correct */}
              <img
                src="/assets/icons/patient-illustration.png"
                alt="Patient Illustration"
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PatientDashboard;
