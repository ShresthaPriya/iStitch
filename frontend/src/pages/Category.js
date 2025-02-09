import { useState } from "react";
import { FaUser, FaCog, FaEdit, FaTrash, FaEye, FaPlus } from "react-icons/fa";
import "../styles/Customer.css";
import Sidebar from "../components/Sidebar";

const Category = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: "Men", totalItems: 20 },
    { id: 2, name: "Women", totalItems: 15 },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer({ ...newCustomer, [name]: value });
  };

  const handleAddCustomer = () => {
    if (editMode) {
      // Update customer logic
    } else {
      // Add customer logic
    }
    setShowModal(false);
  };

  return (
    <div className="customer-container">
      <Sidebar />

      {/* Main Content */}
      <div className="main-content">
        {/* Top Bar */}
        <div className="top-bar">
          <h2 className="title">Categories</h2>
          <div className="user-info">
            <span>Admin</span>
            <FaCog className="icon" />
            <FaUser className="icon" />
          </div>
        </div>

        {/* Add Category Button */}
        <div className="add-category-container">
          <button className="add-category-btn" onClick={() => setShowModal(true)}>
            <FaPlus className="add-icon" /> Add Category
          </button>
        </div>

        {/* Categories Table */}
        <div className="customers-table">
          <table>
            <thead>
              <tr>
                <th>Category Id</th>
                <th>Category Name</th>
                <th>Total Items</th>
                <th>Operations</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td>{category.id}</td>
                  <td>{category.name}</td>
                  <td>{category.totalItems}</td>
                  <td className="operations">
                    <FaEdit className="edit-icon" onClick={() => {
                      setEditMode(true);
                      setShowModal(true);
                      // Load category data into form (you may need to adjust this)
                    }} />
                    <FaTrash className="delete-icon" />
                    <FaEye className="view-icon" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Customer Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editMode ? "Edit Category" : "Add New Category"}</h3>
            <label>Category:</label>
            <input type="text" name="name" value={newCustomer.name} onChange={handleChange} required />

            <label>Items:</label>
            <input type="email" name="email" value={newCustomer.email} onChange={handleChange} required />

            <label>Total Items:</label>
            <input type="number" name="address" value={newCustomer.address} onChange={handleChange} required />


            <div className="modal-actions">
              <button className="add-btn" onClick={handleAddCustomer}>
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

export default Category;
