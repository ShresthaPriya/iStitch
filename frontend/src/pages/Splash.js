import React from "react";
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CategoryGrid from "../components/CategoryGrid";
import  "../styles/Home.css"

const Splash = () => {
  const navigate = useNavigate();

  const handleExploreClick = () => {
    navigate('/Login');
  };

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <h1>LOOK YOUR BEST</h1>
          <p>FOR YOUR SPECIAL DAY</p>
          <button className="new-articles" onClick={handleExploreClick}>Explore</button>
        </div>
      </section>
      
      <section>
        <Footer />
      </section>
    </>
  );
};

export default Splash;
