import React from "react";
import SplashNavbar from '../components/SplashNavbar';
import Footer from '../components/Footer';
import "../styles/Home.css";

// Correct image imports
import heroBg from '../assets/img/hero/h1_hero.png';
import offers1 from '../assets/img/gallery/offers1.png';
import offers2 from '../assets/img/gallery/offers2.png';
import offers3 from '../assets/img/gallery/satin.webp';
import visitBg from '../assets/img/gallery/visit_bg.png';
import services1 from '../assets/img/icon/services1.svg';
import services2 from '../assets/img/icon/services2.svg';
import services3 from '../assets/img/icon/services3.svg';
import services4 from '../assets/img/icon/services4.svg';

const redirectToLogin = () => {
  window.location.href = "/login"; // Reusable function to redirect to login
};

const Splash = () => {
  return (
    <div className="main-wrapper">
      <SplashNavbar/>
      
      {/* Hero Slider Section */}
      <div className="slider-area position-relative">
        <div className="slider-active">
          <div className="single-slider position-relative hero-overly slider-height d-flex align-items-center" 
               style={{backgroundImage: `url(${heroBg})`}}>
            <div className="container">
              <div className="row">
                <div className="col-xl-6 col-lg-6">
                  <div className="hero-caption">
                    <h1>Perfect Fit, Seamless Experience</h1>
                    <p>Experience the ease of digital tailoring with iStitch. Select your design, provide measurements, and get your custom outfit delivered hassle-free.</p>
                    <button className="btn" onClick={redirectToLogin}>Explore Now</button> {/* Call reusable function */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

 {/* Services Offers Section */}
<div className="clients-area section-padding40">
  <div className="container">
    <div className="row">
      {/* Custom Tailoring */}
      <div className="col-lg-4 col-md-6 col-sm-6">
        <div className="single-offers mb-50 text-center">
          <div className="offers-img" style={{ height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img 
              src={offers1} 
              alt="Tailor Sewing" 
              style={{ 
                maxHeight: '100%', 
                maxWidth: '100%',
                objectFit: 'contain'
              }} 
            />
          </div>
          <div className="offers-cap">
            <span className="service-number">1</span>
            <h3>Custom Tailoring</h3>
            <p>Get your clothes tailored with precision, ensuring the perfect fit and quality craftsmanship.</p>
          </div>
        </div>
      </div>

      {/* Accurate Measurement */}
      <div className="col-lg-4 col-md-6 col-sm-6">
        <div className="single-offers mb-50 text-center">
          <div className="offers-img" style={{ height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img 
              src={offers2} 
              alt="Measurement" 
              style={{ 
                maxHeight: '100%', 
                maxWidth: '100%',
                objectFit: 'contain'
              }} 
            />
          </div>
          <div className="offers-cap">
            <span className="service-number">2</span>
            <h3>Accurate Measurement</h3>
            <p>Use our guided measurement tool to ensure accuracy and avoid size mismatches.</p>
          </div>
        </div>
      </div>

      {/* Premium Fabric Choices */}
      <div className="col-lg-4 col-md-6 col-sm-6">
        <div className="single-offers mb-50 text-center">
          <div className="offers-img" style={{ height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img 
              src={offers3} 
              alt="Fabric Selection" 
              style={{ 
                maxHeight: '100%', 
                maxWidth: '100%',
                objectFit: 'contain'
              }} 
            />
          </div>
          <div className="offers-cap">
            <span className="service-number">3</span>
            <h3>Premium Fabric Choices</h3>
            <p>Explore a wide range of high-quality fabrics and customize your outfit to your preference.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

      {/* About Tailor Section */}
      <section className="visit-tailor-area fix">
        <div className="tailor-offers" style={{backgroundImage: `url(${visitBg})`}}></div>
        <div className="tailor-details">
          <h2>About iStitch</h2>
          <p>iStitch is your digital tailoring solution, ensuring convenience, precision, and quality for all your clothing needs.</p>
          <a href="/services" className="btn">More About Us</a>
        </div>
      </section>

{/* Services Section */}
<section className="categories-area section-padding40">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-6 col-lg-6 col-md-7 col-sm-9">
              <div className="section-tittle text-center mb-60">
                <h2>Why use our service?</h2>
                <p>iStitch offers a seamless online tailoring experience, ensuring precision, convenience, and high-quality craftsmanship.</p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-3 col-md-6 col-sm-6">
              <div className="single-cat mb-50 wow fadeInUp" data-wow-duration="1s" data-wow-delay=".2s">
                <div className="cat-icon">
                  <img src={services1} alt="Tailor Sewing" />
                </div>
                <div className="cat-cap">
                  <h5>Tailor Sewing</h5>
                  <p>Our skilled tailors bring your designs to life with precision stitching and top-notch craftsmanship.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-6">
              <div className="single-cat mb-50 wow fadeInUp" data-wow-duration="1s" data-wow-delay=".2s">
                <div className="cat-icon">
                  <img src={services2} alt="Custom Design" />
                </div>
                <div className="cat-cap">
                  <h5>Custom Design</h5>
                  <p>Personalize your outfits with unique designs, perfect fittings, and styles that match your preferences.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-6">
              <div className="single-cat mb-50 wow fadeInUp" data-wow-duration="1s" data-wow-delay=".4s">
                <div className="cat-icon">
                  <img src={services3} alt="Quality Fabric" />
                </div>
                <div className="cat-cap">
                  <h5>Quality Fabric</h5>
                  <p>Choose from a wide range of high-quality fabrics to ensure comfort, durability, and elegance.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-6">
              <div className="single-cat mb-50 wow fadeInUp" data-wow-duration="1s" data-wow-delay=".5s">
                <div className="cat-icon">
                  <img src={services4} alt="Perfect Fit" />
                </div>
                <div className="cat-cap">
                  <h5>Perfect Fit</h5>
                  <p>Enjoy a flawless fit with our precise measurements and expert tailoring techniques.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Splash;
