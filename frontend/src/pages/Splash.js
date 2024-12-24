import React from "react";
import "../styles/SplashScreen.css";

const SplashScreen = () => (
  <div className="splash-screen">
    <section className="what-we-have">
      <h2>What we have</h2>
      <div className="cards">
        <div className="card">Shirts</div>
        <div className="card">Pants</div>
        <div className="card">Kurta</div>
        <div className="card">Blouse</div>
      </div>
    </section>
    <section className="fabric-collection">
      <h2>Fabric Collection</h2>
      <div className="carousel">
        <div className="fabric">Oxford</div>
        <div className="fabric">Broadcloth</div>
        <div className="fabric">Chiffon</div>
      </div>
    </section>
  </div>
);

export default SplashScreen;
