import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import "../styles/FabricDetails.css";

const FabricDetails = () => {
  const { id } = useParams();
  const [fabric, setFabric] = useState(null);
  const [error, setError] = useState("");

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

  const addToFavourite = (fabricId) => {
    // Add to favourite logic here
    console.log(`Fabric ${fabricId} added to favourite`);
  };

  return (
    <>
      <Navbar />
      <div className="fabric-details-container">
        <h2>Fabric Details</h2>
        {error && <div className="error-message">{error}</div>}
        {fabric && (
          <div className="fabric-card">
            {fabric.images.map((image, index) => (
              <img key={index} src={`http://localhost:4000/images/${image}`} alt={`Fabric ${index}`} className="fabric-image" />
            ))}
            <h3>{fabric.name}</h3>
            <p><strong>Price:</strong> ${fabric.price}</p>
            <p>{fabric.description}</p>
            <button className="favourite-button" onClick={() => addToFavourite(fabric._id)}>Add to Favourite</button>
          </div>
        )}
      </div>
    </>
  );
};

export default FabricDetails;
