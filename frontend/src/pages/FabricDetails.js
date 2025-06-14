import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from '../components/Footer';
import "../styles/FabricDetails.css";

const FabricDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [fabric, setFabric] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
    const [selectedFabric, setSelectedFabric] = useState(null); // Define selectedFabric
  

  useEffect(() => {
    const fetchFabric = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/fabrics/${id}`);
        setFabric(response.data.fabric);
      } catch (err) {
        console.error("Error fetching fabric:", err);
        setError(`Error fetching fabric: ${err.response?.data?.error || err.message}`);
      }
    };

    fetchFabric();
  }, [id]);
  const handleSelectFabric = (fabric) => {
    setSelectedFabric(fabric);
    navigate('/customize-dress', { state: { fabric } });
  };
  const addToFavourite = (fabricId) => {
    // Add to favourite logic here
    console.log(`Fabric ${fabricId} added to favourite`);
    setSuccessMessage("Fabric added to favourites successfully!");
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  return (
    <>
      <Navbar />
      <div className="fabric-details-container">
        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}
        {fabric && (
          <div className="fabric-card">
            <div className="fabric-image-container">
              {fabric.images.map((image, index) => (
                <img key={index} src={`http://localhost:4000/images/${image}`} alt={`Fabric ${index}`} className="fabric-image" />
              ))}
            </div>
            <div className="fabric-info">
              <h3>{fabric.name}</h3>
              <p>{fabric.description}</p>
              <p className="price">Rs.{fabric.price}</p>
              <button className="select-btn" onClick={() => handleSelectFabric(fabric)}>Select for Customization</button>
              {/* <button className="favourite-button" onClick={() => addToFavourite(fabric._id)}>Add to Favourite</button> */}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default FabricDetails;
