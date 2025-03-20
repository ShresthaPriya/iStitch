import React from 'react';
import Navbar from '../components/Navbar';

const HomePage = () => {
  return (
    <>
      <Navbar />
      <div className="home-page">
        <h1>Welcome to iStitch</h1>
        <p>Your one-stop shop for custom clothing.</p>
      </div>
    </>
  );
};

export default HomePage;
