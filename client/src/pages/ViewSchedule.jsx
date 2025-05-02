import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/ViewSchedule.css';

const ViewSchedule = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [scheduleData, setScheduleData] = useState([]);
  const [loading, setLoading] = useState(true);
  const date = location.state?.date || '';
  const doctorId = localStorage.getItem('doctorId');

  useEffect(() => {
    const fetchSchedule = async () => {
      if (!date || !doctorId) return;

      try {
        const response = await fetch(
          `http://localhost:5000/api/schedule?doctorId=${doctorId}&date=${date}`
        );
        const data = await response.json();

        const allSlots = data.hospitalSlots.map((slot) => {
          const booked = data.appointments.find((app) => app.timeSlot === slot);
          return {
            time: slot,
            status: booked ? 'BOOKED' : 'AVAILABLE',
            patientId: booked ? booked.patientId : '-',
          };
        });

        setScheduleData(allSlots);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching schedule:', err);
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [date, doctorId]);

  return (
    <div className="view-schedule-container">
      <div className="header">
        <h1>MediMeet</h1>
        <div className="header-links">
          <span>Contact<br />For Help?</span>
          <button onClick={() => navigate('/doctor/dashboard')}>Get Back</button>
        </div>
      </div>

      <div className="banner">
        <h2>EXPAND YOUR REACH. ENHANCE YOUR CARE.</h2>
        <p>Grow with Us in the Digital Health Era.</p>
        <div className="icons-row">
          {[...Array(6)].map((_, i) => (
            <img src={`/assets/hex-${i + 1}.png`} alt={`icon-${i}`} key={i} />
          ))}
        </div>
      </div>

      <div className="schedule-section">
        <h4>FROM APPOINTMENTS TO ACTION</h4>
        <p>Schedule for: <strong>{date}</strong></p>

        {loading ? (
          <p>Loading schedule...</p>
        ) : (
          <table className="schedule-table">
            <thead>
              <tr>
                <th>TIME SLOT</th>
                <th>STATUS</th>
                <th>PATIENT ID</th>
              </tr>
            </thead>
            <tbody>
              {scheduleData.map((slot, idx) => (
                <tr key={idx}>
                  <td>{slot.time}</td>
                  <td>{slot.status}</td>
                  <td>{slot.patientId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ViewSchedule;
