import React from 'react';
import SplashNavbar from '../components/SplashNavbar';
import '../styles/Splash.css';

const Splash = () => {
  return (
    <div className="splash-container">
      <SplashNavbar />
      <div className="splash-content">
        <h1>Welcome to iStitch</h1>
        <p>Your one-stop solution for custom tailoring and fabrics.</p>
        <button className="explore-button">Explore Now</button>
      </div>
    </div>
  );
};

export default Splash;
