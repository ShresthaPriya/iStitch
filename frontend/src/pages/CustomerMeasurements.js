import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from '../components/Footer';
import CartSidebar from '../components/CartSidebar';
import "../styles/CustomerMeasurements.css";

const CustomerMeasurements = () => {
  const [measurements, setMeasurements] = useState([]);
  const [userMeasurements, setUserMeasurements] = useState({});
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const userId = "64b8f8f8f8f8f8f8f8f8f8f8"; // Replace with actual user ID

  useEffect(() => {
    const fetchMeasurements = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/measurements');
        setMeasurements(response.data.measurements);
      } catch (err) {
        console.error("Error fetching measurements:", err);
        setError(`Error fetching measurements: ${err.response?.data?.error || err.message}`);
      }
    };

    fetchMeasurements();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserMeasurements({ ...userMeasurements, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/api/user-measurements', { userId, measurements: userMeasurements });
      setSuccessMessage("Measurements saved successfully!");
      setUserMeasurements({});
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err) {
      console.error("Error saving measurements:", err);
      setError(`Error saving measurements: ${err.response?.data?.error || err.message}`);
    }
  };

  return (
    <>
      <Navbar onCartClick={() => setIsCartOpen(true)} />
      <div className="measurements-container">
        <h2>Enter Your Measurements</h2>
        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}
        <form onSubmit={handleSubmit}>
          {measurements.map((measurement) => (
            <div key={measurement._id} className="measurement-field">
              <label>{measurement.title} ({measurement.unit}):</label>
              <input
                type="number"
                name={measurement.title}
                value={userMeasurements[measurement.title] || ""}
                onChange={handleChange}
                required
              />
            </div>
          ))}
          <button type="submit" className="submit-button">Save Measurements</button>
        </form>
        <h2>Size Matrix</h2>
        <table className="size-matrix">
          <thead>
            <tr>
              <th>Size</th>
              <th>Chest (in)</th>
              <th>Waist (in)</th>
              <th>Hip (in)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Small</td>
              <td>34-36</td>
              <td>28-30</td>
              <td>34-36</td>
            </tr>
            <tr>
              <td>Medium</td>
              <td>38-40</td>
              <td>32-34</td>
              <td>38-40</td>
            </tr>
            <tr>
              <td>Large</td>
              <td>42-44</td>
              <td>36-38</td>
              <td>42-44</td>
            </tr>
            <tr>
              <td>Extra Large</td>
              <td>46-48</td>
              <td>40-42</td>
              <td>46-48</td>
            </tr>
          </tbody>
        </table>
      </div>
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <Footer />
    </>
  );
};

export default CustomerMeasurements;
