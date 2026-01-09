import { useState, useEffect } from "react";
import { FaUser, FaEdit, FaTrash, FaEye, FaPlus, FaBook, FaTimes } from "react-icons/fa";
import axios from "axios";
import "../styles/Customer.css";
import Sidebar from "../components/Sidebar";

const Measurement = () => {
  const [measurements, setMeasurements] = useState([]);
  const [guides, setGuides] = useState([]);
  const [showMeasurementModal, setShowMeasurementModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedMeasurementId, setSelectedMeasurementId] = useState(null);
  const [selectedGuideId, setSelectedGuideId] = useState(null);
  const [newMeasurement, setNewMeasurement] = useState({ title: "", unit: "" });
  const [newGuide, setNewGuide] = useState({ title: "", video: null, guideFile: null, description: "" });
  const [viewingMeasurement, setViewingMeasurement] = useState(null);
  const [viewingGuide, setViewingGuide] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // Success message state
  const [showDeleteModal, setShowDeleteModal] = useState(false); // State for delete confirmation modal
  const [measurementToDelete, setMeasurementToDelete] = useState(null); // Measurement to delete
  const [guideToDelete, setGuideToDelete] = useState(null); // Guide to delete

  useEffect(() => {
    fetchMeasurements();
    fetchGuides();
  }, []);

  const fetchMeasurements = async () => {
    try {
      const response = await axios.get('/api/measurements');
      setMeasurements(response.data.measurements);
    } catch (err) {
      console.error("Error fetching measurements:", err);
    }
  };

  const fetchGuides = async () => {
    try {
      const response = await axios.get('/api/guides');
      setGuides(response.data.guides);
    } catch (err) {
      console.error("Error fetching guides:", err);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewMeasurement({ ...newMeasurement, [name]: value });
    setNewGuide({ ...newGuide, [name]: value });
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setNewGuide({ ...newGuide, [name]: files[0] });
  };

  // Add or Edit measurement
  const handleAddMeasurement = async () => {
    const formData = new FormData();
    formData.append("title", newMeasurement.title);
    formData.append("unit", newMeasurement.unit);

    try {
      if (editMode) {
        const response = await axios.put(`/api/measurements/${selectedMeasurementId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });
        setMeasurements(
          measurements.map((measurement) =>
            measurement._id === selectedMeasurementId ? { ...measurement, ...response.data.measurement } : measurement
          )
        );
        setSuccessMessage("Measurement updated successfully!");
        setEditMode(false);
        setSelectedMeasurementId(null);
      } else {
        const response = await axios.post('/api/measurements', formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });
        setMeasurements([...measurements, response.data.measurement]);
        setSuccessMessage("Measurement added successfully!");
      }
      setShowMeasurementModal(false);
      setNewMeasurement({ title: "", unit: "" });
    } catch (err) {
      console.error('Error adding/updating measurement:', err);
      setError(`Error adding/updating measurement: ${err.response?.data?.error || err.message}`);
    }
  };

  // Add or Edit guide
  const handleAddGuide = async () => {
    const formData = new FormData();
    formData.append("title", newGuide.title);
    formData.append("description", newGuide.description);
    if (newGuide.video) {
      formData.append("video", newGuide.video);
    }
    if (newGuide.guideFile) {
      formData.append("guideFile", newGuide.guideFile);
    }

    try {
      if (editMode) {
        const response = await axios.put(`/api/guides/${selectedGuideId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });
        setGuides(
          guides.map((guide) =>
            guide._id === selectedGuideId ? { ...guide, ...response.data.guide } : guide
          )
        );
        setSuccessMessage("Guide updated successfully!");
        setEditMode(false);
        setSelectedGuideId(null);
      } else {
        const response = await axios.post('/api/guides', formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });
        setGuides([...guides, response.data.guide]);
        setSuccessMessage("Guide added successfully!");
      }
      setShowGuideModal(false);
      setNewGuide({ title: "", video: null, guideFile: null, description: "" });
    } catch (err) {
      console.error('Error adding/updating guide:', err);
      setError(`Error adding/updating guide: ${err.response?.data?.error || err.message}`);
    }
  };

  // Open delete confirmation modal for measurement
  const confirmDeleteMeasurement = (id) => {
    setMeasurementToDelete(id);
    setShowDeleteModal(true);
  };

  // Open delete confirmation modal for guide
  const confirmDeleteGuide = (id) => {
    setGuideToDelete(id);
    setShowDeleteModal(true);
  };

  // Delete measurement
  const handleDeleteMeasurement = async () => {
    try {
      await axios.delete(`/api/measurements/${measurementToDelete}`);
      setMeasurements(measurements.filter((measurement) => measurement._id !== measurementToDelete));
      setSuccessMessage("Measurement deleted successfully!");
      setShowDeleteModal(false);
      setMeasurementToDelete(null);
    } catch (err) {
      console.error('Error deleting measurement:', err);
      setError(`Error deleting measurement: ${err.response?.data?.error || err.message}`);
    }
  };

  // Delete guide
  const handleDeleteGuide = async () => {
    try {
      await axios.delete(`/api/guides/${guideToDelete}`);
      setGuides(guides.filter((guide) => guide._id !== guideToDelete));
      setSuccessMessage("Guide deleted successfully!");
      setShowDeleteModal(false);
      setGuideToDelete(null);
    } catch (err) {
      console.error('Error deleting guide:', err);
      setError(`Error deleting guide: ${err.response?.data?.error || err.message}`);
    }
  };

  // Close success message
  const closeSuccessMessage = () => {
    setSuccessMessage("");
  };

  // Edit measurement
  const handleEditMeasurement = (measurement) => {
    setNewMeasurement(measurement);
    setSelectedMeasurementId(measurement._id);
    setEditMode(true);
    setShowMeasurementModal(true);
  };

  // Edit guide
  const handleEditGuide = (guide) => {
    setNewGuide(guide);
    setSelectedGuideId(guide._id);
    setEditMode(true);
    setShowGuideModal(true);
  };

  // View measurement details
  const handleViewMeasurement = (measurement) => {
    setViewingMeasurement(measurement);
  };

  // View guide details
  const handleViewGuide = (guide) => {
    setViewingGuide(guide);
  };

  return (
    <div className="customer-container">
      <Sidebar />

      {/* Main Content */}
      <div className="main-content">
        {/* Top Bar */}
        <div className="top-bar">
          <h2 className="title">Measurements</h2>
          <div className="user-info">
            <span>Admin</span>
            <FaUser className="icon" />
          </div>
        </div>

        {/*Measurement Section  */}
        <div className="add-category-container">
          <button className="add-category-btn" onClick={() => { setShowMeasurementModal(true); setEditMode(false); }}>
            <FaPlus className="add-icon" /> Add Measurement
          </button>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="success-message">
            {successMessage}
            <FaTimes className="close-icon" onClick={closeSuccessMessage} />
          </div>
        )}

        {/* Measurements Table */}
        <div className="customers-table">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Unit</th>
                <th>Operations</th>
              </tr>
            </thead>
            <tbody>
              {measurements.map((measurement) => (
                <tr key={measurement._id}>
                  <td>{measurement.title}</td>
                  <td>{measurement.unit}</td>
                  <td className="operations">
                    <FaEdit className="edit-icon" onClick={() => handleEditMeasurement(measurement)} />
                    <FaTrash className="delete-icon" onClick={() => confirmDeleteMeasurement(measurement._id)} />
                    <FaEye className="view-icon" onClick={() => handleViewMeasurement(measurement)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add gap between measurement and guide section */}
        <div style={{ height: "2.5rem" }}></div>

        {/* Guide  Section*/}
        <div className="add-guide-container">
          <button className="add-category-btn" onClick={() => { setShowGuideModal(true); setEditMode(false); }}>
            <FaBook className="add-icon" /> Add Guide
          </button>
        </div>
        

        {/* Guides Table */}
        <div className="customers-table">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Video</th>
                <th>Guide File</th>
                <th>Description</th>
                <th>Operations</th>
              </tr>
            </thead>
            <tbody>
              {guides.map((guide) => (
                <tr key={guide._id}>
                  <td>{guide.title}</td>
                  <td>{guide.video ? <a href={`https://istitch-backend.onrender.com/${guide.video}`} target="_blank" rel="noopener noreferrer">View Video</a> : "N/A"}</td>
                  <td>{guide.guideFile ? <a href={`https://istitch-backend.onrender.com/${guide.guideFile}`} target="_blank" rel="noopener noreferrer">View Guide</a> : "N/A"}</td>
                  <td>{guide.description}</td>
                  <td className="operations">
                    <FaEdit className="edit-icon" onClick={() => handleEditGuide(guide)} />
                    <FaTrash className="delete-icon" onClick={() => confirmDeleteGuide(guide._id)} />
                    <FaEye className="view-icon" onClick={() => handleViewGuide(guide)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Measurement Modal */}
      {showMeasurementModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editMode ? "Edit Measurement" : "Add New Measurement"}</h3>
            {error && <p className="error">{error}</p>}
            <label>Title:</label>
            <input type="text" name="title" value={newMeasurement.title} onChange={handleChange} required />
            <label>Unit:</label>
            <input type="text" name="unit" value={newMeasurement.unit} onChange={handleChange} required />
            <div className="modal-actions">
              <button className="add-btn" onClick={handleAddMeasurement}>
                {editMode ? "Update" : "Add"}
              </button>
              <button className="cancel-btn" onClick={() => setShowMeasurementModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Guide Modal */}
      {showGuideModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editMode ? "Edit Guide" : "Add New Guide"}</h3>
            {error && <p className="error">{error}</p>}
            <label>Title:</label>
            <input type="text" name="title" value={newGuide.title} onChange={handleChange} required />
            <label>Video:</label>
            <input type="file" name="video" onChange={handleFileChange} accept="video/*" />
            <label>Guide File:</label>
            <input type="file" name="guideFile" onChange={handleFileChange} accept=".pdf,.doc,.docx" />
            <label>Description:</label>
            <textarea name="description" value={newGuide.description} onChange={handleChange} />
            <div className="modal-actions">
              <button className="add-btn" onClick={handleAddGuide}>
                {editMode ? "Update" : "Add"}
              </button>
              <button className="cancel-btn" onClick={() => setShowGuideModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this item? This action cannot be undone.</p>
            <div className="modal-actions">
              {measurementToDelete && (
                <button className="delete-btn" onClick={handleDeleteMeasurement}>Delete Measurement</button>
              )}
              {guideToDelete && (
                <button className="delete-btn" onClick={handleDeleteGuide}>Delete Guide</button>
              )}
              <button className="cancel-btn" onClick={() => setShowDeleteModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* View Measurement Details Modal */}
      {viewingMeasurement && (
        <div className="modal">
          <div className="modal-content">
            <h3>{viewingMeasurement.title} Details</h3>
            <p><strong>Unit:</strong> {viewingMeasurement.unit}</p>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setViewingMeasurement(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* View Guide Details Modal */}
      {viewingGuide && (
        <div className="modal">
          <div className="modal-content">
            <h3>{viewingGuide.title} Details</h3>
            <p><strong>Video:</strong> {viewingGuide.video ? <a href={`https://istitch-backend.onrender.com/${viewingGuide.video}`} target="_blank" rel="noopener noreferrer">View Video</a> : "N/A"}</p>
            <p><strong>Guide File:</strong> {viewingGuide.guideFile ? <a href={`https://istitch-backend.onrender.com/${viewingGuide.guideFile}`} target="_blank" rel="noopener noreferrer">View Guide</a> : "N/A"}</p>
            <p><strong>Description:</strong> {viewingGuide.description}</p>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setViewingGuide(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Measurement;
