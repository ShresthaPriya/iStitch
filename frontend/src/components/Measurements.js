import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Measurements.css'; // Import custom CSS

const Measurements = () => {
  const navigate = useNavigate();

  const navigateToMeasurement = (type) => {
    navigate(`/measurements/${type}`);
  };

  return (
    <div className="measurements-container">
      <h2 className="measurements-title">Your Measurements</h2>
      <div className="measurements-form">
        <div className="dropdown">
          <button onClick={() => navigateToMeasurement('shirt')}>Shirt</button>
        </div>
        <div className="dropdown">
          <button onClick={() => navigateToMeasurement('pant')}>Pant</button>
        </div>
        <div className="dropdown">
          <button onClick={() => navigateToMeasurement('blazer')}>Blazer</button>
        </div>
        <div className="dropdown">
          <button onClick={() => navigateToMeasurement('blouse')}>Blouse</button>
        </div>
        <div className="dropdown">
          <button onClick={() => navigateToMeasurement('kurta')}>Kurta</button>
        </div>
       
      </div>
    </div>
  );
};

export default Measurements;
