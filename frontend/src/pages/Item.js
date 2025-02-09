import { useState } from "react";
import { FaUser, FaCog, FaEdit, FaTrash, FaEye, FaPlus } from "react-icons/fa";
import "../styles/Customer.css"; 
import Sidebar from "../components/Sidebar";

const Item = () => {
  const [items, setItems] = useState([
    { id: 1, name: "Dresses", price: 2000, fabric: "Cotton", category: "Casual Wear", image: null },
    { id: 2, name: "Suits", price: 5000, fabric: "Wool", category: "Formal Wear", image: null },
  ]);
  
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [newItem, setNewItem] = useState({ name: "", price: "", fabric: "", category: "", image: null });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setNewItem({ ...newItem, image: file });
  };

  // Add new item
  const handleAddItem = () => {
    if (editMode) {
      setItems(
        items.map((item) =>
          item.id === selectedItemId ? { ...item, ...newItem } : item
        )
      );
      setEditMode(false);
      setSelectedItemId(null);
    } else {
      setItems([...items, { id: items.length + 1, ...newItem }]);
    }
    setShowModal(false);
    setNewItem({ name: "", price: "", fabric: "", category: "", image: null });
  };

  // Delete item
  const handleDeleteItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  // Edit item
  const handleEditItem = (item) => {
    setNewItem(item);
    setSelectedItemId(item.id);
    setEditMode(true);
    setShowModal(true);
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
                <th>Item Id</th>
                <th>Item Name</th>
                <th>Total Price</th>
                <th>Fabric</th>
                <th>Category</th>
                <th>Operations</th>
                <th>Upload Picture</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>Rs. {item.price}</td>
                  <td>{item.fabric}</td>
                  <td>{item.category}</td>
                  <td className="operations">
                    <FaEdit className="edit-icon" onClick={() => handleEditItem(item)} />
                    <FaTrash className="delete-icon" onClick={() => handleDeleteItem(item.id)} />
                    <FaEye className="view-icon" />
                  </td>
                  <td>
                    {item.image ? (
                      <img src={URL.createObjectURL(item.image)} alt="Uploaded" className="uploaded-img" />
                    ) : (
                      <span>No Image</span>
                    )}
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
            <label>Item Name:</label>
            <input type="text" name="name" value={newItem.name} onChange={handleChange} required />

            <label>Total Price:</label>
            <input type="number" name="price" value={newItem.price} onChange={handleChange} required />

            <label>Fabric:</label>
            <input type="text" name="fabric" value={newItem.fabric} onChange={handleChange} required />

            <label>Category:</label>
            <input type="text" name="category" value={newItem.category} onChange={handleChange} required />

            <label>Upload Picture:</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            
            <div className="modal-actions">
              <button className="add-btn" onClick={handleAddItem}>
                {editMode ? "Update" : "Add"}
              </button>
              <button className="close-btn" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Item;
