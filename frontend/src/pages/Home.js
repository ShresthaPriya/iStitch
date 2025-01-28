import React from "react";
// import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CategoryGrid from "../components/CategoryGrid";
import FabricCollection from "../components/FabricCollection";
import  "../styles/Home.css"

const Home = () => {
  return (
    <>
      {/* <Navbar /> */}
    
      <CategoryGrid />
      <FabricCollection/>
      <section>
        <Footer />
      </section>
    </>
  );
};

export default Home;
