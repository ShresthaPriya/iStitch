import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/FabricCollection.css';
import Navbar from './Navbar';

function FabricCollection() {
  const navigate = useNavigate();
  const [fabrics, setFabrics] = useState([]);
  const [error, setError] = useState("");
  const [sortOrder, setSortOrder] = useState("default");

  useEffect(() => {
    const fetchFabrics = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/fabrics');
        setFabrics(response.data.fabrics);
      } catch (err) {
        console.error("Error fetching fabrics:", err);
        setError(`Error fetching fabrics: ${err.response?.data?.error || err.message}`);
      }
    };

    fetchFabrics();
  }, []);

  const handleViewFabric = (id) => {
    navigate(`/fabric-details/${id}`);
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const sortedFabrics = [...fabrics].sort((a, b) => {
    if (sortOrder === "low-to-high") {
      return a.price - b.price;
    } else if (sortOrder === "high-to-low") {
      return b.price - a.price;
    } else {
      return 0;
    }
  });

  return (
    <>
      <Navbar />
      <div className="fabric-header">
        <h3 className="fabric-title">Fabrics</h3>
        <div className="sort-container">
          <label htmlFor="sort">Sort by price:</label>
          <select id="sort" value={sortOrder} onChange={handleSortChange}>
            <option value="default">Default</option>
            <option value="low-to-high">Low to High</option>
            <option value="high-to-low">High to Low</option>
          </select>
        </div>
      </div>
      <div className="view-all-container">
        <a href="#viewAll" className="view-all-link">View all <span>▾</span></a>
      </div>
      <div className="fabric-collection">
        {error && <div className="error-message">{error}</div>}
        {sortedFabrics.map((fabric) => (
          <div key={fabric._id} className="fabric-card">
            {fabric.images.map((image, index) => (
              <img key={index} src={`http://localhost:4000/images/${image}`} alt={`Fabric ${index}`} className="fabric-image" />
            ))}
            <div className="fabric-info">
              <h3>{fabric.name}</h3>
              <p>${fabric.price}</p>
            </div>
            <button onClick={() => handleViewFabric(fabric._id)}>View Fabric</button>
          </div>
        ))}
      </div>
    </>
  );
}

export default FabricCollection;
