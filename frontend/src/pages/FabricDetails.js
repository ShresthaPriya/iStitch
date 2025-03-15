import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "../styles/FabricDetails.css";

const FabricDetails = () => {
  const [fabrics, setFabrics] = useState([]);
  const [newFabric, setNewFabric] = useState({ name: "", description: "", image: "" });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewFabric({ ...newFabric, [name]: value });
  };

  const addToFavourite = (fabricId) => {
    // Add to favourite logic here
    console.log(`Fabric ${fabricId} added to favourite`);
  };

  const handleAddFabric = async () => {
    try {
      const response = await axios.post('http://localhost:4000/api/fabrics', newFabric);
      setFabrics([...fabrics, response.data.fabric]);
      setSuccessMessage("Fabric added successfully!");
      setNewFabric({ name: "", description: "", image: "" });
    } catch (err) {
      console.error('Error adding fabric:', err);
      setError(`Error adding fabric: ${err.response?.data?.error || err.message}`);
    }
  };

  return (
    <>
      <Navbar />
      <div className="fabric-details-container">
        <h2>Fabrics</h2>
        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}
        <div className="fabrics-grid">
          {fabrics.map((fabric) => (
            <div className="fabric-card" key={fabric._id}>
              <img src={`http://localhost:4000/uploads/${fabric.image}`} alt={fabric.name} className="fabric-image" />
              <h3>{fabric.name}</h3>
              <p>{fabric.description}</p>
              <button className="favourite-button" onClick={() => addToFavourite(fabric._id)}>Add to Favourite</button>
            </div>
          ))}
        </div>
        {/* <div className="add-fabric-form">
          <h3>Add New Fabric</h3>
          <label>Name:</label>
          <input type="text" name="name" value={newFabric.name} onChange={handleChange} required />
          <label>Description:</label>
          <textarea name="description" value={newFabric.description} onChange={handleChange} required />
          <label>Image:</label>
          <input type="text" name="image" value={newFabric.image} onChange={handleChange} required />
          <button className="add-fabric-button" onClick={handleAddFabric}>Add Fabric</button>
        </div> */}
      </div>
    </>
  );
};

export default FabricDetails;
