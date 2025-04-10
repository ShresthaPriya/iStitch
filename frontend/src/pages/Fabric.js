import { useState, useEffect } from "react";
import { FaUser, FaCog, FaEdit, FaTrash, FaEye, FaPlus } from "react-icons/fa";
import axios from "axios";
import "../styles/Customer.css";
import Sidebar from "../components/Sidebar";

const Fabric = () => {
  const [fabrics, setFabrics] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedFabricId, setSelectedFabricId] = useState(null);
  const [newFabric, setNewFabric] = useState({ name: "", price: "", description: "", images: [], products: [] });
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

    fetchFabrics();
  }, []);

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

  // Handle products input changes
  const handleProductsChange = (e) => {
    const { value } = e.target;
    setNewFabric({ ...newFabric, products: value.split(",").map(product => product.trim()) });
  };

  // Add or Edit fabric
  const handleAddFabric = async () => {
    const formData = new FormData();
    formData.append("name", newFabric.name);
    formData.append("price", newFabric.price);
    formData.append("description", newFabric.description);
    formData.append("products", newFabric.products.join(","));
    for (let i = 0; i < newFabric.images.length; i++) {
      formData.append("images", newFabric.images[i]);
    }

    try {
      if (editMode) {
        const response = await axios.put(`http://localhost:4000/api/fabrics/${selectedFabricId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });
        alert("Fabric uploaded successfully");

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
      setNewFabric({ name: "", price: "", description: "", images: [], products: [] });
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
                <th>Price</th>
                <th>Description</th>
                <th>Products</th> {/* Added Products Column */}
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
                  <td>{fabric.products.length > 0 ? fabric.products.join(", ") : "No Products"}</td> {/* Display Products as a String */}
                  <td>
                    {fabric.images.map((image, index) => (
                      <img key={index} src={`http://localhost:4000/images/${image}`} alt={`Fabric ${index}`} width="50" />
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
            <label>Price:</label>
            <input type="number" name="price" value={newFabric.price} onChange={handleChange} required />
            <label>Description:</label>
            <textarea name="description" value={newFabric.description} onChange={handleChange} required />
            <label>Products (comma-separated):</label>
            <input type="text" name="products" value={newFabric.products.join(", ")} onChange={handleProductsChange} />
            <label>Images:</label>
            <input type="file" name="images" onChange={handleFileChange} multiple accept="image/*" required />
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
            <p><strong>Price:</strong> {viewingFabric.price}</p>
            <p><strong>Description:</strong> {viewingFabric.description}</p>
            <p><strong>Products:</strong> {viewingFabric.products.length > 0 ? viewingFabric.products.join(", ") : "No Products"}</p> {/* Display Products */}
            <div>
              <strong>Images:</strong>
              <div className="images-container">
                {viewingFabric.images.map((image, index) => (
                  <img key={index} src={`http://localhost:4000/images/${image}`} alt={`Fabric ${index}`} width="100" />
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
