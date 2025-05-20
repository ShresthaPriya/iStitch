import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from '../components/Footer';
import CartSidebar from '../components/CartSidebar';
import "../styles/CustomerMeasurements.css";

const CustomerMeasurements = () => {
  const [measurements, setMeasurements] = useState([]);
  const [userMeasurements, setUserMeasurements] = useState({});
  const [savedMeasurements, setSavedMeasurements] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("edit"); // "edit" or "view"
  
  // Get the actual user ID from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  useEffect(() => {
    // Fetch measurement categories
    const fetchMeasurements = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/measurements');
        setMeasurements(response.data.measurements);
      } catch (err) {
        console.error("Error fetching measurements:", err);
        setError(`Error fetching measurements: ${err.response?.data?.error || err.message}`);
      }
    };

    // Fetch user's existing measurements if available
    const fetchUserMeasurements = async () => {
      if (!userId) return;
      
      try {
        const response = await axios.get(`http://localhost:4000/api/user-measurements/${userId}`);
        if (response.data.success && response.data.measurements.length > 0) {
          // Save the raw measurements array
          setSavedMeasurements(response.data.measurements);
          
          // Convert array of measurements to object format for form
          const measurementsObj = {};
          response.data.measurements.forEach(m => {
            measurementsObj[m.title] = m.value;
          });
          setUserMeasurements(measurementsObj);
        }
      } catch (err) {
        console.error("Error fetching user measurements:", err);
        // Don't show error for this as the user might not have measurements yet
      }
    };

    fetchMeasurements();
    fetchUserMeasurements();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserMeasurements({ ...userMeasurements, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!userId) {
      setError("You must be logged in to save measurements");
      return;
    }

    try {
      // Convert userMeasurements object into an array of measurement objects
      const formattedMeasurements = Object.entries(userMeasurements).map(([title, value]) => ({
          title,
          value: parseFloat(value), // Ensure value is a number
          unit: "inches" // Add a default unit
      }));

      console.log("Submitting measurements payload:", { userId, measurements: formattedMeasurements });

      const response = await axios.post('http://localhost:4000/api/user-measurements', {
        userId,
        measurements: formattedMeasurements
      });

      console.log("Measurements save response:", response.data);
      
      if (response.data.success) {
        setSuccessMessage("Measurements saved successfully!");
        setSavedMeasurements(formattedMeasurements); // Update saved measurements
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      } else {
        setError("Failed to save measurements. Please try again.");
      }
    } catch (err) {
      console.error("Error saving measurements:", err);
      setError(`Error saving measurements: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <>
      <Navbar onCartClick={() => setIsCartOpen(true)} />
      <div className="measurements-container">
        <h2>Your Body Measurements</h2>
        
        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}
        
        {!userId && (
          <div className="login-prompt">
            <p>Please <a href="/login">log in</a> to save measurements.</p>
          </div>
        )}

        {userId && (
          <div className="measurements-tabs">
            <button 
              className={`tab-btn ${activeTab === 'view' ? 'active' : ''}`}
              onClick={() => setActiveTab('view')}
            >
              View Measurements
            </button>
            <button 
              className={`tab-btn ${activeTab === 'edit' ? 'active' : ''}`}
              onClick={() => setActiveTab('edit')}
            >
              Add/Edit Measurements
            </button>
          </div>
        )}
        
        {activeTab === 'view' && savedMeasurements.length > 0 ? (
          <div className="saved-measurements">
            <h3>Your Saved Measurements</h3>
            <div className="measurements-card">
              <div className="measurements-grid">
                {savedMeasurements.map((measurement, index) => (
                  <div key={index} className="measurement-display">
                    <span className="measurement-title">{measurement.title}</span>
                    <span className="measurement-value">{measurement.value} {measurement.unit}</span>
                  </div>
                ))}
              </div>
              <button 
                className="edit-measurements-btn"
                onClick={() => setActiveTab('edit')}
              >
                Edit Measurements
              </button>
            </div>
          </div>
        ) : activeTab === 'view' ? (
          <div className="no-measurements">
            <p>You don't have any saved measurements yet. Please add your measurements.</p>
            <button 
              className="start-measuring-btn"
              onClick={() => setActiveTab('edit')}
            >
              Start Measuring
            </button>
          </div>
        ) : null}
        
        {activeTab === 'edit' && (
          <form onSubmit={handleSubmit} className="measurements-form">
            <div className="form-instructions">
              <p>Please enter your measurements accurately for the best fit.</p>
              <p><strong>Note:</strong> All measurements should be in inches.</p>
            </div>
            
            <div className="measurements-form-grid">
              {measurements.map((measurement) => (
                <div key={measurement._id} className="measurement-field">
                  <label>{measurement.title} ({measurement.unit}):</label>
                  <input
                    type="number"
                    name={measurement.title}
                    value={userMeasurements[measurement.title] || ""}
                    onChange={handleChange}
                    step="0.1"
                    placeholder="0.0"
                    required
                  />
                </div>
              ))}
            </div>
            
            <button type="submit" className="submit-button" disabled={!userId}>
              Save Measurements
            </button>
          </form>
        )}
        
        <h3>Size Reference Chart</h3>
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
