import React from 'react';
import './Measurements.css'; // Import your CSS file for styling

const Measurements = () => {
  // ...existing state and functions for measurements

  // Add this component inside your measurements page component, before or after your measurements form
  const MeasurementGuide = () => {
    return (
      <div className="measurement-guide-container">
        <h3>Measurement Guide</h3>
        <p>Watch this video to learn how to take accurate measurements:</p>
        <div className="video-container">
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/jvGEVbgIXPU"
            title="Measurement Guide"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        <p className="guide-note">Follow these instructions carefully to ensure your custom clothing fits perfectly.</p>
      </div>
    );
  };

  return (
    <div className="measurements-page">
      <h1>Your Measurements</h1>
      
      {/* Add the measurement guide component here */}
      <MeasurementGuide />
      
      {/* Your existing measurements form/content */}
      {/* ...existing code... */}
    </div>
  );
};

export default Measurements;