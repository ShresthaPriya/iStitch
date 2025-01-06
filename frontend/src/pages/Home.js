import React from "react";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CategoryGrid from "../components/CategoryGrid";
import  "../styles/Home.css"

const Home = () => {
  return (
    <>
      <Navbar />
      <section className="hero">
        <div className="hero-content">
          <h1>LOOK YOUR BEST</h1>
          <p>FOR YOUR SPECIAL DAY</p>
          <button className="new-articles">New Arrivals</button>
        </div>
      </section>
      <CategoryGrid />
      <section>
        <Footer />
      </section>
    </>
  );
};

export default Home;
