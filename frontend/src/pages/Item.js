import { useState, useEffect } from "react";
import { FaUser, FaCog, FaEdit, FaTrash, FaEye, FaPlus, FaTimes, FaPlusCircle } from "react-icons/fa"; // Import icons
import axios from "axios";
import "../styles/Customer.css";
import Sidebar from "../components/Sidebar";

const Item = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [newItem, setNewItem] = useState({ name: "", category: "", price: "", description: "", images: [] });
  const [viewingItem, setViewingItem] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // Success message state
  const [showDeleteModal, setShowDeleteModal] = useState(false); // State for delete confirmation modal
  const [itemToDelete, setItemToDelete] = useState(null); // Item to delete

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('/api/items');
        setItems(response.data.items);
      } catch (err) {
        console.error("Error fetching items:", err);
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

    fetchItems();
    fetchCategories();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  // Handle image input changes
  const handleImageChange = (e, index) => {
    const files = Array.from(e.target.files);
    const updatedImages = [...newItem.images];
    updatedImages[index] = files[0]; // Replace the image at the given index
    setNewItem({ ...newItem, images: updatedImages });
  };

  // Add a new image input field
  const handleAddImageField = () => {
    setNewItem({ ...newItem, images: [...newItem.images, null] });
  };

  // Remove an image input field
  const handleRemoveImageField = (index) => {
    const updatedImages = [...newItem.images];
    updatedImages.splice(index, 1); // Remove the image at the given index
    setNewItem({ ...newItem, images: updatedImages });
  };

  // Add or Edit item
  const handleAddItem = async () => {
    const formData = new FormData();
    formData.append("name", newItem.name);
    formData.append("category", newItem.category);
    formData.append("price", newItem.price);
    formData.append("description", newItem.description);
    newItem.images.forEach((image) => {
      if (image) formData.append("images", image);
    });
    

    try {
      if (editMode) {
        const response = await axios.put(`/api/items/${selectedItemId}`, formData, {
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
        setSuccessMessage("Product updated successfully!");
      } else {
        const response = await axios.post('/api/items', formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });
        setItems([...items, response.data.item]);
        setSuccessMessage("Product added successfully!");
      }
      setShowModal(false);
      setNewItem({ name: "", category: "", price: "", description: "", images: [] });
    } catch (err) {
      console.error('Error adding/updating product:', err);
      setError(`Error adding/updating product: ${err.response?.data?.error || err.message}`);
    }
  };

  // Open delete confirmation modal
  const confirmDeleteItem = (id) => {
    setItemToDelete(id);
    setShowDeleteModal(true);
  };

  // Delete item
  const handleDeleteItem = async () => {
    try {
      await axios.delete(`/api/items/${itemToDelete}`);
      setItems(items.filter((item) => item._id !== itemToDelete));
      setSuccessMessage("Product deleted successfully!");
      setShowDeleteModal(false);
      setItemToDelete(null);
    } catch (err) {
      console.error('Error deleting item:', err);
      setError(`Error deleting item: ${err.response?.data?.error || err.message}`);
    }
  };

  // Edit item
  const handleEditItem = (item) => {
    setNewItem({
      ...item,
      category: item.category ? item.category._id : ""
    });
    setSelectedItemId(item._id);
    setEditMode(true);
    setShowModal(true);
  };

  // View item details
  const handleViewItem = (item) => {
    setViewingItem(item);
  };

  // Close success message
  const closeSuccessMessage = () => {
    setSuccessMessage("");
  };

  return (
    <div className="customer-container">
      <Sidebar />

      {/* Main Content */}
      <div className="main-content">
        {/* Top Bar */}
        <div className="top-bar">
          <h2 className="title">Products</h2>
          <div className="user-info">
            <span>Admin</span>
            {/* <FaCog className="icon" /> */}
            <FaUser className="icon" />
          </div>
        </div>

        {/* Add Item Button */}
        <div className="add-category-container">
          <button className="add-category-btn" onClick={() => { setShowModal(true); setEditMode(false); }}>
            <FaPlus className="add-icon" /> Add Product
          </button>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="success-message">
            {successMessage}
            <FaTimes className="close-icon" onClick={closeSuccessMessage} />
          </div>
        )}

        {/* Items Table */}
        <div className="customers-table">
          <table>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Description</th>
                <th>Operations</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{item.category ? item.category.name : "N/A"}</td>
                  <td>{item.price}</td>
                  <td>{item.description}</td>
                  <td className="operations">
                    <FaEdit className="edit-icon" onClick={() => handleEditItem(item)} />
                    <FaTrash className="delete-icon" onClick={() => confirmDeleteItem(item._id)} />
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
            <h3>{editMode ? "Edit Product" : "Add New Product"}</h3>
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
            <label>Price:</label>
            <input type="number" name="price" value={newItem.price} onChange={handleChange} required />
            <label>Description:</label>
            <textarea name="description" value={newItem.description} onChange={handleChange} required />
  
            <label>Images:</label>
            {newItem.images.map((image, index) => (
              <div key={index} className="image-input-group">
                <input
                  type="file"
                  onChange={(e) => handleImageChange(e, index)}
                  accept="image/*"
                />
                <button
                  type="button"
                  className="remove-image-btn"
                  onClick={() => handleRemoveImageField(index)}
                >
                  <FaTimes />
                </button>
              </div>
            ))}
            <div className="add-image-container" onClick={handleAddImageField}>
              <FaPlusCircle className="add-image-icon" />
              <span>Add Image</span>
            </div>
            <div className="modal-actions">
              <button className="add-btn" onClick={handleAddItem}>
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
            <p>Are you sure you want to delete this product? This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="delete-btn" onClick={handleDeleteItem}>Delete</button>
              <button className="cancel-btn" onClick={() => setShowDeleteModal(false)}>Cancel</button>
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
            <p><strong>Price:</strong> {viewingItem.price}</p>
            <p><strong>Description:</strong> {viewingItem.description}</p>
            <div>
              <strong>Images:</strong>
              <div className="images-container">
                {viewingItem.images.map((image, index) => (
                  <img 
                    key={index} 
                    src={`/images/${image}`} 
                    alt={`Item ${index}`} 
                    width="50" 
                  />
                ))}
              </div>
            </div>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setViewingItem(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Item;
