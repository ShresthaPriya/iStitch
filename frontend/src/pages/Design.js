import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaEye, FaPlus, FaTimes } from "react-icons/fa";
import axios from 'axios';
import "../styles/Design.css";
import Sidebar from "../components/Sidebar";

const Design = () => {
  const [designs, setDesigns] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedDesignId, setSelectedDesignId] = useState(null);
  const [newDesign, setNewDesign] = useState({ name: "", subcategory: "", fullSleeve: null, halfSleeve: null, sleeve: null });
  const [viewingDesign, setViewingDesign] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchDesigns = async () => {
      try {
        const response = await axios.get('/api/designs');
        setDesigns(response.data);
      } catch (error) {
        console.error("Failed to fetch designs", error);
      }
    };

    const fetchSubcategories = async () => {
      try {
        const response = await axios.get('/api/subcategories');
        setSubcategories(response.data.subcategories);
      } catch (err) {
        console.error("Error fetching subcategories:", err);
      }
    };

    fetchDesigns();
    fetchSubcategories();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewDesign({ ...newDesign, [name]: value });
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setNewDesign({ ...newDesign, [name]: files[0] });
  };

  // Add or Edit design
  const handleAddDesign = async () => {
    const formData = new FormData();
    formData.append("name", newDesign.name);
    formData.append("subcategory", newDesign.subcategory);
    if (newDesign.fullSleeve) formData.append("fullSleeve", newDesign.fullSleeve);
    if (newDesign.halfSleeve) formData.append("halfSleeve", newDesign.halfSleeve);
    if (newDesign.sleeve) formData.append("sleeve", newDesign.sleeve);

    try {
      if (editMode) {
        const response = await axios.put(`/api/designs/${selectedDesignId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });
        setDesigns(
          designs.map((design) =>
            design._id === selectedDesignId ? { ...design, ...response.data.design } : design
          )
        );
        setEditMode(false);
        setSelectedDesignId(null);
        setSuccessMessage("Design updated successfully!");
      } else {
        const response = await axios.post('/api/designs', formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });
        setDesigns([...designs, response.data.design]);
        setSuccessMessage("Design added successfully!");
      }
      setShowModal(false);
      setNewDesign({ name: "", subcategory: "", fullSleeve: null, halfSleeve: null, sleeve: null });
    } catch (err) {
      console.error('Error adding/updating design:', err);
      setError(`Error adding/updating design: ${err.response?.data?.error || err.message}`);
    }
  };

  // Delete design
  const handleDeleteDesign = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this design?");
    if (!confirmed) {
      return;
    }

    try {
      await axios.delete(`/api/designs/${id}`);
      setDesigns(designs.filter((design) => design._id !== id));
      setSuccessMessage("Design deleted successfully!");
    } catch (err) {
      console.error('Error deleting design:', err);
      setError(`Error deleting design: ${err.response?.data?.error || err.message}`);
    }
  };

  // Edit design
  const handleEditDesign = (design) => {
    setNewDesign(design);
    setSelectedDesignId(design._id);
    setEditMode(true);
    setShowModal(true);
  };

  // View design details
  const handleViewDesign = (design) => {
    setViewingDesign(design);
  };

  // Close success message
  const closeSuccessMessage = () => {
    setSuccessMessage("");
  };

  return (
    <div className="design-container">
      <Sidebar />

      {/* Main Content */}
      <div className="main-content">
        {/* Top Bar */}
        <div className="top-bar">
          <h2 className="title">Designs</h2>
        </div>

        {/* Add Design Button */}
        <div className="add-design-container">
          <button className="add-design-btn" onClick={() => { setShowModal(true); setEditMode(false); }}>
            <FaPlus className="add-icon" /> Add Design
          </button>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="success-message">
            {successMessage}
            <FaTimes className="close-icon" onClick={closeSuccessMessage} />
          </div>
        )}

        {/* Designs Table */}
        <div className="designs-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Subcategory</th>
                <th>Photos</th>
                <th>Operations</th>
              </tr>
            </thead>
            <tbody>
              {designs.map((design) => (
                <tr key={design._id}>
                  <td>{design.name}</td>
                  <td>{design.subcategory.name}</td>
                  <td>
                    {design.designPhotos.fullSleeve && <img src={`/${design.designPhotos.fullSleeve}`} alt="Full Sleeve" className="design-photo" />}
                    {design.designPhotos.halfSleeve && <img src={`/${design.designPhotos.halfSleeve}`} alt="Half Sleeve" className="design-photo" />}
                    {design.designPhotos.sleeve && <img src={`/${design.designPhotos.sleeve}`} alt="Sleeve" className="design-photo" />}
                  </td>
                  <td className="operations">
                    <FaEdit className="edit-icon" onClick={() => handleEditDesign(design)} />
                    <FaTrash className="delete-icon" onClick={() => handleDeleteDesign(design._id)} />
                    <FaEye className="view-icon" onClick={() => handleViewDesign(design)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Design Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editMode ? "Edit Design" : "Add New Design"}</h3>
            {error && <p className="error">{error}</p>}
            <label>Name:</label>
            <input type="text" name="name" value={newDesign.name} onChange={handleChange} required />
            <label>Subcategory:</label>
            <select name="subcategory" value={newDesign.subcategory} onChange={handleChange} required>
              <option value="">Select Subcategory</option>
              {subcategories.map(subcategory => (
                <option key={subcategory._id} value={subcategory._id}>{subcategory.name}</option>
              ))}
            </select>
            <label>Full Sleeve Photo:</label>
            <input type="file" name="fullSleeve" onChange={handleFileChange} accept="image/*" />
            <label>Half Sleeve Photo:</label>
            <input type="file" name="halfSleeve" onChange={handleFileChange} accept="image/*" />
            <label>Sleeve Photo:</label>
            <input type="file" name="sleeve" onChange={handleFileChange} accept="image/*" />
            <div className="modal-actions">
              <button className="add-btn" onClick={handleAddDesign}>
                {editMode ? "Update" : "Add"}
              </button>
              <button className="close-btn" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* View Design Details Modal */}
      {viewingDesign && (
        <div className="modal">
          <div className="modal-content">
            <h3>{viewingDesign.name} Details</h3>
            <p><strong>Subcategory:</strong> {viewingDesign.subcategory.name}</p>
            <div>
              <strong>Photos:</strong>
              <div className="images-container">
                {viewingDesign.designPhotos.fullSleeve && <img src={`/${viewingDesign.designPhotos.fullSleeve}`} alt="Full Sleeve" width="100" />}
                {viewingDesign.designPhotos.halfSleeve && <img src={`/${viewingDesign.designPhotos.halfSleeve}`} alt="Half Sleeve" width="100" />}
                {viewingDesign.designPhotos.sleeve && <img src={`/${viewingDesign.designPhotos.sleeve}`} alt="Sleeve" width="100" />}
              </div>
            </div>
            <button className="close-btn" onClick={() => setViewingDesign(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Design;
