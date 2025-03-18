import { useState, useEffect } from "react";
import { FaUser, FaCog, FaEdit, FaTrash, FaEye, FaPlus } from "react-icons/fa";
import axios from "axios";
import "../styles/Customer.css";
import Sidebar from "../components/Sidebar";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [newCategory, setNewCategory] = useState({ name: "", gender: "" });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/categories');
      setCategories(response.data.categories);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCategory({ ...newCategory, [name]: value });
  };

  // Add or Edit category
  const handleAddCategory = async () => {
    try {
      if (editMode) {
        const response = await axios.put(`http://localhost:4000/api/categories/${selectedCategoryId}`, newCategory);
        setCategories(
          categories.map((category) =>
            category._id === selectedCategoryId ? { ...category, ...response.data.category } : category
          )
        );
        setEditMode(false);
        setSelectedCategoryId(null);
      } else {
        const response = await axios.post('http://localhost:4000/api/categories', newCategory);
        setCategories([...categories, response.data.category]);
      }
      setShowModal(false);
      setNewCategory({ name: "", gender: "" });
    } catch (err) {
      console.error('Error adding/updating category:', err);
    }
  };

  // Delete category
  const handleDeleteCategory = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/categories/${id}`);
      setCategories(categories.filter((category) => category._id !== id));
    } catch (err) {
      console.error('Error deleting category:', err);
    }
  };

  // Edit category
  const handleEditCategory = (category) => {
    setNewCategory(category);
    setSelectedCategoryId(category._id);
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
          <h2 className="title">Categories</h2>
          <div className="user-info">
            <span>Admin</span>
            <FaCog className="icon" />
            <FaUser className="icon" />
          </div>
        </div>

        {/* Add Category Button */}
        <div className="add-category-container">
          <button className="add-category-btn" onClick={() => { setShowModal(true); setEditMode(false); }}>
            <FaPlus className="add-icon" /> Add Category
          </button>
        </div>

        {/* Categories Table */}
        <div className="customers-table">
          <table>
            <thead>
              <tr>
                <th>Category Name</th>
                <th>Gender</th>
                <th>Operations</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category._id}>
                  <td>{category.name}</td>
                  <td>{category.gender}</td>
                  <td className="operations">
                    <FaEdit className="edit-icon" onClick={() => handleEditCategory(category)} />
                    <FaTrash className="delete-icon" onClick={() => handleDeleteCategory(category._id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Category Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editMode ? "Edit Category" : "Add New Category"}</h3>
            <label>Name:</label>
            <input type="text" name="name" value={newCategory.name} onChange={handleChange} required />
            <label>Gender:</label>
            <select name="gender" value={newCategory.gender} onChange={handleChange} required>
              <option value="">Select Gender</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
            </select>
            <div className="modal-actions">
              <button className="add-btn" onClick={handleAddCategory}>
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
