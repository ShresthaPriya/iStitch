import React from "react";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CategoryGrid from "../components/CategoryGrid";
// import FabricCollection from "../components/FabricCollection";
import  "../styles/Home.css"
import SliderBanner from "../components/SliderBanner";

const Home = () => {
  return (
    <>
      <Navbar />
      {/* <CategoryGrid /> */}
      <SliderBanner/>
  
      <section>
        <Footer />
      </section>
    </>
  );
};

export default Home;
