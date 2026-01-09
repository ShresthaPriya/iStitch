import { useState, useEffect } from "react";
import { FaUser, FaEdit, FaTrash, FaEye, FaPlus, FaTimes, FaPlusCircle } from "react-icons/fa";
import axios from "axios";
import "../styles/Customer.css";
import Sidebar from "../components/Sidebar";

const Fabric = () => {
  const [fabrics, setFabrics] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedFabricId, setSelectedFabricId] = useState(null);
  const [newFabric, setNewFabric] = useState({ name: "", price: "", description: "", images: [], products: [""] });
  const [viewingFabric, setViewingFabric] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // Success message state
  const [showDeleteModal, setShowDeleteModal] = useState(false); // State for delete confirmation modal
  const [fabricToDelete, setFabricToDelete] = useState(null); // Fabric to delete

  useEffect(() => {
    fetchFabrics();
  }, []);

  const fetchFabrics = async () => {
    try {
      const response = await axios.get('https://istitch-backend.onrender.com/api/fabrics');
      setFabrics(response.data.fabrics);
    } catch (err) {
      console.error("Error fetching fabrics:", err);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewFabric({ ...newFabric, [name]: value });
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    const { files } = e.target;
    setNewFabric({ ...newFabric, images: files });
  };

  // Handle product input changes
  const handleProductChange = (index, value) => {
    const updatedProducts = [...newFabric.products];
    updatedProducts[index] = value;
    setNewFabric({ ...newFabric, products: updatedProducts });
  };

  // Add a new product input field
  const handleAddProductField = () => {
    setNewFabric({ ...newFabric, products: [...newFabric.products, ""] });
  };

  // Remove a product input field
  const handleRemoveProductField = (index) => {
    const updatedProducts = [...newFabric.products];
    updatedProducts.splice(index, 1);
    setNewFabric({ ...newFabric, products: updatedProducts });
  };

  // Add or Edit fabric
  const handleAddFabric = async () => {
    const formData = new FormData();
    formData.append("name", newFabric.name);
    formData.append("price", newFabric.price);
    formData.append("description", newFabric.description);
    newFabric.products.forEach((product) => formData.append("products", product));
    for (let i = 0; i < newFabric.images.length; i++) {
      formData.append("images", newFabric.images[i]);
    }

    try {
      if (editMode) {
        const response = await axios.put(`https://istitch-backend.onrender.com/api/fabrics/${selectedFabricId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });
        setFabrics(
          fabrics.map((fabric) =>
            fabric._id === selectedFabricId ? { ...fabric, ...response.data.fabric } : fabric
          )
        );
        setSuccessMessage("Fabric updated successfully!");
        setEditMode(false);
        setSelectedFabricId(null);
        setTimeout(() => {
    setError("");
  }, 3000);
      } else {
        const response = await axios.post('/api/fabrics', formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });
        setFabrics([...fabrics, response.data.fabric]);
        setSuccessMessage("Fabric added successfully!");
      }
      setShowModal(false);
      setNewFabric({ name: "", price: "", description: "", images: [], products: [""] });
    } catch (err) {
      console.error('Error adding/updating fabric:', err);
      setError(`Error adding/updating fabric: ${err.response?.data?.error || err.message}`);
      setTimeout(() => {
    setError("");
  }, 3000);
    }
  };

  // Open delete confirmation modal
  const confirmDeleteFabric = (id) => {
    setFabricToDelete(id);
    setShowDeleteModal(true);
  };

  // Delete fabric
  const handleDeleteFabric = async () => {
    try {
      await axios.delete(`/api/fabrics/${fabricToDelete}`);
      setFabrics(fabrics.filter((fabric) => fabric._id !== fabricToDelete));
      setSuccessMessage("Fabric deleted successfully!");
      setShowDeleteModal(false);
      setFabricToDelete(null);
      setTimeout(() => {
    setError("");
  }, 3000);
    } catch (err) {
      console.error('Error deleting fabric:', err);
      setError(`Error deleting fabric: ${err.response?.data?.error || err.message}`);
      setTimeout(() => {
    setError("");
  }, 3000);
    }
  };

  // Close success message
  const closeSuccessMessage = () => {
    setSuccessMessage("");
  };

  // Edit fabric
  const handleEditFabric = (fabric) => {
    setNewFabric({
      ...fabric,
      products: fabric.products || [],
    });
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
            <FaUser className="icon" />
          </div>
        </div>

        {/* Add Fabric Button */}
        <div className="add-category-container">
          <button className="add-category-btn" onClick={() => { setShowModal(true); setEditMode(false); }}>
            <FaPlus className="add-icon" /> Add Fabric
          </button>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="success-message">
            {successMessage}
            <FaTimes className="close-icon" onClick={closeSuccessMessage} />
          </div>
        )}

        {/* Fabrics Table */}
        <div className="customers-table">
          <table>
            <thead>
              <tr>
                <th>Fabric Name</th>
                <th>Price</th>
                <th>Description</th>
                {/* <th>Products</th> */}
                <th>Images</th>
                <th>Operations</th>
              </tr>
            </thead>
            <tbody>
              {fabrics.map((fabric) => (
                <tr key={fabric._id}>
                  <td>{fabric.name}</td>
                  <td>{fabric.price}</td>
                  <td>{fabric.description}</td>
                  {/* <td>{fabric.products.length > 0 ? fabric.products.join(", ") : "No Products"}</td> */}
                  <td>
                    {fabric.images.map((image, index) => (
                      <img key={index} src={`/images/${image}`} alt={`Fabric ${index}`} width="50" />
                    ))}
                  </td>
                  <td className="operations">
                    <FaEdit className="edit-icon" onClick={() => handleEditFabric(fabric)} />
                    <FaTrash className="delete-icon" onClick={() => confirmDeleteFabric(fabric._id)} />
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
            <label>Price:</label>
            <input type="number" name="price" value={newFabric.price} onChange={handleChange} required />
            <label>Description:</label>
            <textarea name="description" value={newFabric.description} onChange={handleChange} required />
            {/* <label>Products:</label> */}
            {newFabric.products.map((product, index) => (
              <div key={index} className="product-input-group">
                {/* <input
                  type="text"
                  value={product}
                  onChange={(e) => handleProductChange(index, e.target.value)}
                  placeholder="Enter product name"
                  required
                /> */}
                <button
                  type="button"
                  className="remove-product-btn"
                  onClick={() => handleRemoveProductField(index)}
                >
                  <FaTimes />
                </button>
              </div>
            ))}
            {/* <div className="add-product-container" onClick={handleAddProductField}>
              <FaPlusCircle className="add-product-icon" />
              <span>Add Product</span>
            </div> */}
            <label>Images:</label>
            <input type="file" name="images" onChange={handleFileChange} multiple accept="image/*" required />
            <div className="modal-actions">
              <button className="add-btn" onClick={handleAddFabric}>
                {editMode ? "Update" : "Add"}
              </button>
              <button className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this fabric? This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="delete-btn" onClick={handleDeleteFabric}>Delete</button>
              <button className="cancel-btn" onClick={() => setShowDeleteModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* View Fabric Details Modal */}
      {viewingFabric && (
        <div className="modal">
          <div className="modal-content">
            <h3>{viewingFabric.name} Details</h3>
            <p><strong>Price:</strong> {viewingFabric.price}</p>
            <p><strong>Description:</strong> {viewingFabric.description}</p>
            <p><strong>Products:</strong> {viewingFabric.products.length > 0 ? viewingFabric.products.join(", ") : "No Products"}</p>
            <div>
              <strong>Images:</strong>
              <div className="images-container">
                {viewingFabric.images.map((image, index) => (
                  <img key={index} src={`/images/${image}`} alt={`Fabric ${index}`} width="100" />
                ))}
              </div>
            </div>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setViewingFabric(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Fabric;
