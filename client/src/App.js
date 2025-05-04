import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import PatientRegister from './pages/PatientRegister';
import DoctorRegister from './pages/DoctorRegister';
import HospitalRegister from './pages/HospitalRegister';
import PatientLogin from './pages/PatientLogin';
import HospitalLogin from './pages/HospitalLogin';
import DoctorLogin from './pages/DoctorLogin';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import HospitalDashboard from './pages/HospitalDashboard';
import AppointmentConfirmation from './pages/AppointmentConfirmation';
import ContactForm from './pages/ContactForm'; 



const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/contact" element={<ContactForm />} />
      <Route path="/register/patient" element={<PatientRegister />} />
      <Route path="/register/doctor" element={<DoctorRegister />} />
      <Route path="/register/hospital" element={<HospitalRegister />} />
       {/* Login routes */}
      <Route path="/login/patient" element={<PatientLogin />} />
      <Route path="/login/hospital" element={<HospitalLogin />} />
      <Route path="/login/doctor" element={<DoctorLogin />} />
      {/* Dashboard routes */}
      <Route path="/dashboard/patient" element={<PatientDashboard />} />
        <Route path="/dashboard/hospital" element={<HospitalDashboard />} />
        <Route path="/dashboard/doctor" element={<DoctorDashboard />} />
{/* Appointment confirmation route */}
<Route path="/appointment-confirmation" element={<AppointmentConfirmation />} />

      {/* Add more routes as needed */}
    </Routes>
  );
};

export default App;
