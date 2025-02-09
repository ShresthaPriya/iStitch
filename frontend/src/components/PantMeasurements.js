import React, { useState } from 'react';
import '../styles/Measurements.css'; // Import custom CSS
import Navbar from './Navbar';

const PantMeasurements = () => {
  const [measurements, setMeasurements] = useState({
    waist: '',
    hips: '',
    thigh: '',
    legOpening: '',
    inseam: '',
    fit: 'Slim',
    frontStyle: 'Flat Front',
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMeasurements({ ...measurements, [name]: value });
  };

  const handleSave = () => {
    setIsEditing(false);
    // Save measurements logic here
    console.log('Measurements saved:', measurements);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <>
      <Navbar />
    <div className="measurements-container">
      <h2 className="measurements-title">Pant Measurements</h2>
      <div className="measurements-form">
        {Object.keys(measurements).map((key) => (
          <div key={key} className="form-group">
            <label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}</label>
            {key === 'fit' || key === 'frontStyle' ? (
              <select
                id={key}
                name={key}
                value={measurements[key]}
                onChange={handleChange}
                disabled={!isEditing}
              >
                {key === 'fit' ? (
                  <>
                    <option value="Athletic">Athletic</option>
                    <option value="Slim">Slim</option>
                  </>
                ) : (
                  <>
                    <option value="Flat Front">Flat Front</option>
                    <option value="Pleated">Pleated</option>
                  </>
                )}
              </select>
            ) : (
              <input
                type="text"
                id={key}
                name={key}
                value={measurements[key]}
                onChange={handleChange}
                disabled={!isEditing}
              />
            )}
          </div>
        ))}
        {isEditing ? (
          <button className="save-button" onClick={handleSave}>Save</button>
        ) : (
          <button className="edit-button" onClick={handleEdit}>Edit</button>
        )}
      </div>
      <div className="resources">
        <h3>Resources</h3>
        <ul>
          <li><a href="#howToMeasure">How to Measure Videos</a></li>
          <li><a href="#guideBook">Measurement Guide Book</a></li>
        </ul>
      </div>
    </div>
    </>
  );
};

export default PantMeasurements;
