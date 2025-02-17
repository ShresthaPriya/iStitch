import { useState, useEffect } from "react";
import { FaUser, FaCog, FaEdit, FaTrash, FaEye, FaPlus } from "react-icons/fa";
import axios from "axios";
import "../styles/Customer.css";
import Sidebar from "../components/Sidebar";

const Fabric = () => {
  const [fabrics, setFabrics] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedFabricId, setSelectedFabricId] = useState(null);
  const [newFabric, setNewFabric] = useState({ name: "", category: "", subcategory: "", price: "", description: "", images: [] });
  const [viewingFabric, setViewingFabric] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFabrics = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/fabrics');
        setFabrics(response.data.fabrics);
      } catch (err) {
        console.error("Error fetching fabrics:", err);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/categories');
        setCategories(response.data.categories);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    const fetchSubcategories = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/subcategories');
        setSubcategories(response.data.subcategories);
      } catch (err) {
        console.error("Error fetching subcategories:", err);
      }
    };

    fetchFabrics();
    fetchCategories();
    fetchSubcategories();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewFabric({ ...newFabric, [name]: value });
  };

  // Handle image input changes
  const handleImageChange = (e) => {
    setNewFabric({ ...newFabric, images: Array.from(e.target.files) });
  };

  // Add or Edit fabric
  const handleAddFabric = async () => {
    const formData = new FormData();
    formData.append("name", newFabric.name);
    formData.append("category", newFabric.category);
    formData.append("subcategory", newFabric.subcategory);
    formData.append("price", newFabric.price);
    formData.append("description", newFabric.description);
    newFabric.images.forEach((image, index) => {
      formData.append("images", image);
    });

    try {
      if (editMode) {
        const response = await axios.put(`http://localhost:4000/api/fabrics/${selectedFabricId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });
        setFabrics(
          fabrics.map((fabric) =>
            fabric._id === selectedFabricId ? { ...fabric, ...response.data.fabric } : fabric
          )
        );
        setEditMode(false);
        setSelectedFabricId(null);
      } else {
        const response = await axios.post('http://localhost:4000/api/fabrics', formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });
        setFabrics([...fabrics, response.data.fabric]);
      }
      setShowModal(false);
      setNewFabric({ name: "", category: "", subcategory: "", price: "", description: "", images: [] });
    } catch (err) {
      console.error('Error adding/updating fabric:', err);
      setError(`Error adding/updating fabric: ${err.response?.data?.error || err.message}`);
    }
  };

  // Delete fabric
  const handleDeleteFabric = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/fabrics/${id}`);
      setFabrics(fabrics.filter((fabric) => fabric._id !== id));
    } catch (err) {
      console.error('Error deleting fabric:', err);
      setError(`Error deleting fabric: ${err.response?.data?.error || err.message}`);
    }
  };

  // Edit fabric
  const handleEditFabric = (fabric) => {
    setNewFabric(fabric);
    setSelectedFabricId(fabric._id);
    setEditMode(true);
    setShowModal(true);
  };

  // View fabric details
  const handleViewFabric = (fabric) => {
    setViewingFabric(fabric);
  };

  return (
    <div className="customer-container">
      <Sidebar />

      {/* Main Content */}
      <div className="main-content">
        {/* Top Bar */}
        <div className="top-bar">
          <h2 className="title">Fabrics</h2>
          <div className="user-info">
            <span>Admin</span>
            <FaCog className="icon" />
            <FaUser className="icon" />
          </div>
        </div>

        {/* Add Fabric Button */}
        <div className="add-category-container">
          <button className="add-category-btn" onClick={() => { setShowModal(true); setEditMode(false); }}>
            <FaPlus className="add-icon" /> Add Fabric
          </button>
        </div>

        {/* Fabrics Table */}
        <div className="customers-table">
          <table>
            <thead>
              <tr>
                <th>Fabric Name</th>
                <th>Category</th>
                <th>Subcategory</th>
                <th>Price</th>
                <th>Description</th>
                <th>Images</th>
                <th>Operations</th>
              </tr>
            </thead>
            <tbody>
              {fabrics.map((fabric) => (
                <tr key={fabric._id}>
                  <td>{fabric.name}</td>
                  <td>{fabric.category ? fabric.category.name : "N/A"}</td>
                  <td>{fabric.subcategory ? fabric.subcategory.name : "N/A"}</td>
                  <td>{fabric.price}</td>
                  <td>{fabric.description}</td>
                  <td>
                    {fabric.images.map((image, index) => (
                      <img key={index} src={`http://localhost:4000/uploads/${image}`} alt={`Fabric ${index}`} width="50" />
                    ))}
                  </td>
                  <td className="operations">
                    <FaEdit className="edit-icon" onClick={() => handleEditFabric(fabric)} />
                    <FaTrash className="delete-icon" onClick={() => handleDeleteFabric(fabric._id)} />
                    <FaEye className="view-icon" onClick={() => handleViewFabric(fabric)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Fabric Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editMode ? "Edit Fabric" : "Add New Fabric"}</h3>
            {error && <p className="error">{error}</p>}
            <label>Name:</label>
            <input type="text" name="name" value={newFabric.name} onChange={handleChange} required />
            <label>Category:</label>
            <select name="category" value={newFabric.category} onChange={handleChange} required>
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category._id} value={category._id}>{category.name}</option>
              ))}
            </select>
            <label>Subcategory:</label>
            <select name="subcategory" value={newFabric.subcategory} onChange={handleChange} required>
              <option value="">Select Subcategory</option>
              {subcategories.map(subcategory => (
                <option key={subcategory._id} value={subcategory._id}>{subcategory.name}</option>
              ))}
            </select>
            <label>Price:</label>
            <input type="number" name="price" value={newFabric.price} onChange={handleChange} required />
            <label>Description:</label>
            <textarea name="description" value={newFabric.description} onChange={handleChange} required />
            <label>Images:</label>
            <input type="file" name="images" onChange={handleImageChange} multiple accept="image/*" required />
            <div className="modal-actions">
              <button className="add-btn" onClick={handleAddFabric}>
                {editMode ? "Update" : "Add"}
              </button>
              <button className="close-btn" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* View Fabric Details Modal */}
      {viewingFabric && (
        <div className="modal">
          <div className="modal-content">
            <h3>{viewingFabric.name} Details</h3>
            <p><strong>Category:</strong> {viewingFabric.category ? viewingFabric.category.name : "N/A"}</p>
            <p><strong>Subcategory:</strong> {viewingFabric.subcategory ? viewingFabric.subcategory.name : "N/A"}</p>
            <p><strong>Price:</strong> {viewingFabric.price}</p>
            <p><strong>Description:</strong> {viewingFabric.description}</p>
            <div>
              <strong>Images:</strong>
              <div className="images-container">
                {viewingFabric.images.map((image, index) => (
                  <img key={index} src={`http://localhost:4000/uploads/${image}`} alt={`Fabric ${index}`} width="100" />
                ))}
              </div>
            </div>
            <button className="close-btn" onClick={() => setViewingFabric(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Fabric;
