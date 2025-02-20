import { useState, useEffect } from "react";
import { FaUser, FaCog, FaEdit, FaTrash, FaEye, FaPlus } from "react-icons/fa";
import axios from "axios";
import "../styles/Customer.css";
import Sidebar from "../components/Sidebar";

const Item = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [newItem, setNewItem] = useState({ name: "", category: "", subcategory: "", price: "", description: "", images: [] });
  const [viewingItem, setViewingItem] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/items');
        setItems(response.data.items);
      } catch (err) {
        console.error("Error fetching items:", err);
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

    fetchItems();
    fetchCategories();
    fetchSubcategories();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  // Handle image input changes
  const handleImageChange = (e) => {
    setNewItem({ ...newItem, images: Array.from(e.target.files) });
  };

  // Add or Edit item
  const handleAddItem = async () => {
    const formData = new FormData();
    formData.append("name", newItem.name);
    formData.append("category", newItem.category);
    formData.append("subcategory", newItem.subcategory);
    formData.append("price", newItem.price);
    formData.append("description", newItem.description);
    newItem.images.forEach((image, index) => {
      formData.append("images", image);
    });

    try {
      if (editMode) {
        const response = await axios.put(`http://localhost:4000/api/items/${selectedItemId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });
        setItems(
          items.map((item) =>
            item._id === selectedItemId ? { ...item, ...response.data.item } : item
          )
        );
        setEditMode(false);
        setSelectedItemId(null);
      } else {
        const response = await axios.post('http://localhost:4000/api/items', formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });
        setItems([...items, response.data.item]);
      }
      setShowModal(false);
      setNewItem({ name: "", category: "", subcategory: "", price: "", description: "", images: [] });
    } catch (err) {
      console.error('Error adding/updating item:', err);
      setError(`Error adding/updating item: ${err.response?.data?.error || err.message}`);
    }
  };

  // Delete item
  const handleDeleteItem = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/items/${id}`);
      setItems(items.filter((item) => item._id !== id));
    } catch (err) {
      console.error('Error deleting item:', err);
      setError(`Error deleting item: ${err.response?.data?.error || err.message}`);
    }
  };

  // Edit item
  const handleEditItem = (item) => {
    setNewItem(item);
    setSelectedItemId(item._id);
    setEditMode(true);
    setShowModal(true);
  };

  // View item details
  const handleViewItem = (item) => {
    setViewingItem(item);
  };

  return (
    <div className="customer-container">
      <Sidebar />

      {/* Main Content */}
      <div className="main-content">
        {/* Top Bar */}
        <div className="top-bar">
          <h2 className="title">Items</h2>
          <div className="user-info">
            <span>Admin</span>
            <FaCog className="icon" />
            <FaUser className="icon" />
          </div>
        </div>

        {/* Add Item Button */}
        <div className="add-category-container">
          <button className="add-category-btn" onClick={() => { setShowModal(true); setEditMode(false); }}>
            <FaPlus className="add-icon" /> Add Item
          </button>
        </div>

        {/* Items Table */}
        <div className="customers-table">
          <table>
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Category</th>
                <th>Subcategory</th>
                <th>Price</th>
                <th>Description</th>
                <th>Images</th>
                <th>Operations</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{item.category ? item.category.name : "N/A"}</td>
                  <td>{item.subcategory ? item.subcategory.name : "N/A"}</td>
                  <td>{item.price}</td>
                  <td>{item.description}</td>
                  <td>
                    {item.images.map((image, index) => (
                      <img key={index} src={`http://localhost:4000/public/images/${image}`} alt={`Item ${index}`} width="50" />
                    ))}
                  </td>
                  <td className="operations">
                    <FaEdit className="edit-icon" onClick={() => handleEditItem(item)} />
                    <FaTrash className="delete-icon" onClick={() => handleDeleteItem(item._id)} />
                    <FaEye className="view-icon" onClick={() => handleViewItem(item)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Item Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editMode ? "Edit Item" : "Add New Item"}</h3>
            {error && <p className="error">{error}</p>}
            <label>Name:</label>
            <input type="text" name="name" value={newItem.name} onChange={handleChange} required />
            <label>Category:</label>
            <select name="category" value={newItem.category} onChange={handleChange} required>
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category._id} value={category._id}>{category.name}</option>
              ))}
            </select>
            <label>Subcategory:</label>
            <select name="subcategory" value={newItem.subcategory} onChange={handleChange} required>
              <option value="">Select Subcategory</option>
              {subcategories.map(subcategory => (
                <option key={subcategory._id} value={subcategory._id}>{subcategory.name}</option>
              ))}
            </select>
            <label>Price:</label>
            <input type="number" name="price" value={newItem.price} onChange={handleChange} required />
            <label>Description:</label>
            <textarea name="description" value={newItem.description} onChange={handleChange} required />
            <label>Images:</label>
            <input type="file" name="images" onChange={handleImageChange} multiple accept="image/*" required />
            <div className="modal-actions">
              <button className="add-btn" onClick={handleAddItem}>
                {editMode ? "Update" : "Add"}
              </button>
              <button className="close-btn" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* View Item Details Modal */}
      {viewingItem && (
        <div className="modal">
          <div className="modal-content">
            <h3>{viewingItem.name} Details</h3>
            <p><strong>Category:</strong> {viewingItem.category ? viewingItem.category.name : "N/A"}</p>
            <p><strong>Subcategory:</strong> {viewingItem.subcategory ? viewingItem.subcategory.name : "N/A"}</p>
            <p><strong>Price:</strong> {viewingItem.price}</p>
            <p><strong>Description:</strong> {viewingItem.description}</p>
            <div>
              <strong>Images:</strong>
              <div className="images-container">
                {viewingItem.images.map((image, index) => (
                  <img key={index} src={`http://localhost:4000/uploads/${image}`} alt={`Item ${index}`} width="100" />
                ))}
              </div>
            </div>
            <button className="close-btn" onClick={() => setViewingItem(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Item;
