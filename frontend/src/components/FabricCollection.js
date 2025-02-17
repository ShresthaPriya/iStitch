import React from 'react';
import '../styles/FabricCollection.css';
import Navbar from './Navbar';

function FabricCollection() {
  const fabrics = [
    {
      name: "Wool",
      image: require('../images/fabrics/wool.jpg'),
      reviews: 120,
      rating: 4.8,
    },
    {
      name: "Cotton",
      image: require('../images/fabrics/cotton.webp'),
      reviews: 180,
      rating: 4.7,
    },
    {
      name: "Linen",
      image: require('../images/fabrics/lenin.jpg'),
      reviews: 85,
      rating: 4.6,
    },
    {
      name: "Silk",
      image: require('../images/fabrics/silk.jpg'),
      rating: 4.8,
    },
    {
      name: "Cotton Denim",
      image: require('../images/fabrics/denim.jpg'),
      rating: 4.7,
    },
    {
      name: "Satin",
      image: require('../images/fabrics/satin.webp'),
      rating: 4.6,
    },
  ];

  return (
    <>
      {/* <Navbar /> */}
      <div className="fabric-header">
        <h3 className="fabric-title">Trending Fabrics</h3>
      </div>
      <div className="view-all-container">
        <a href="#viewAll" className="view-all-link">View all <span>▾</span></a>
      </div>
      <div className="fabric-collection">
        {fabrics.map((fabric, index) => (
          <div key={index} className="fabric-card">
            <img src={fabric.image} alt={fabric.name} className="fabric-image" />
            <div className="fabric-info">
              <h3>{fabric.name}</h3>
              <p>{fabric.rating} ★</p>
            </div>
            <button>View Fabric</button>
          </div>
        ))}
      </div>
    
    </>
  );
}

export default FabricCollection;
