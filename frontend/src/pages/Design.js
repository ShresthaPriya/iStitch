import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaEye, FaPlus, FaTimes } from "react-icons/fa";
import axios from 'axios';
import "../styles/Design.css";
import Sidebar from "../components/Sidebar";

const Design = () => {
  const [designs, setDesigns] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedDesignId, setSelectedDesignId] = useState(null);
  const [newDesign, setNewDesign] = useState({ name: "", category: "", price: "", description: "", fullSleeve: [], halfSleeve: [], sleeve: [] });
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

    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/categories');
        setCategories(response.data.categories);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchDesigns();
    fetchCategories();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewDesign({ ...newDesign, [name]: value });
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setNewDesign({ ...newDesign, [name]: Array.from(files) });
  };

  // Add or Edit design
  const handleAddDesign = async () => {
    const formData = new FormData();
    formData.append("name", newDesign.name);
    formData.append("category", newDesign.category);
    formData.append("price", newDesign.price);
    formData.append("description", newDesign.description);
    newDesign.fullSleeve.forEach(file => formData.append("fullSleeve", file));
    newDesign.halfSleeve.forEach(file => formData.append("halfSleeve", file));
    newDesign.sleeve.forEach(file => formData.append("sleeve", file));

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
      setNewDesign({ name: "", category: "", price: "", description: "", fullSleeve: [], halfSleeve: [], sleeve: [] });
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
                <th>Category</th>
                <th>Price</th>
                <th>Description</th>
                <th>Photos</th>
                <th>Operations</th>
              </tr>
            </thead>
            <tbody>
              {designs.map((design) => (
                <tr key={design._id}>
                  <td>{design.name}</td>
                  <td>{design.category.name}</td>
                  <td>{design.price}</td>
                  <td>{design.description}</td>
                  <td>
                    {design.designPhotos.fullSleeve.map((photo, index) => (
                      <img key={index} src={`/${photo}`} alt="Full Sleeve" className="design-photo" />
                    ))}
                    {design.designPhotos.halfSleeve.map((photo, index) => (
                      <img key={index} src={`/${photo}`} alt="Half Sleeve" className="design-photo" />
                    ))}
                    {design.designPhotos.sleeve.map((photo, index) => (
                      <img key={index} src={`/${photo}`} alt="Sleeve" className="design-photo" />
                    ))}
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
            <label>Category:</label>
            <select name="category" value={newDesign.category} onChange={handleChange} required>
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category._id} value={category._id}>{category.name}</option>
              ))}
            </select>
            <label>Price:</label>
            <input type="number" name="price" value={newDesign.price} onChange={handleChange} required />
            <label>Description:</label>
            <textarea name="description" value={newDesign.description} onChange={handleChange} required />
            <label>Full Sleeve Photos:</label>
            <input type="file" name="fullSleeve" onChange={handleFileChange} multiple accept="image/*" />
            <label>Half Sleeve Photos:</label>
            <input type="file" name="halfSleeve" onChange={handleFileChange} multiple accept="image/*" />
            <label>Sleeve Photos:</label>
            <input type="file" name="sleeve" onChange={handleFileChange} multiple accept="image/*" />
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
            <p><strong>Category:</strong> {viewingDesign.category.name}</p>
            <p><strong>Price:</strong> {viewingDesign.price}</p>
            <p><strong>Description:</strong> {viewingDesign.description}</p>
            <div>
              <strong>Photos:</strong>
              <div className="images-container">
                {viewingDesign.designPhotos.fullSleeve.map((photo, index) => (
                  <img key={index} src={`/${photo}`} alt="Full Sleeve" width="100" />
                ))}
                {viewingDesign.designPhotos.halfSleeve.map((photo, index) => (
                  <img key={index} src={`/${photo}`} alt="Half Sleeve" width="100" />
                ))}
                {viewingDesign.designPhotos.sleeve.map((photo, index) => (
                  <img key={index} src={`/${photo}`} alt="Sleeve" width="100" />
                ))}
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
