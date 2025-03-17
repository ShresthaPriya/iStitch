// import { useState, useEffect } from "react";
// import { FaUser, FaCog, FaEdit, FaTrash, FaEye, FaPlus } from "react-icons/fa";
// import axios from "axios";
// import "../styles/Customer.css";
// import Sidebar from "../components/Sidebar";

// const Subcategory = () => {
//   const [subcategories, setSubcategories] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [editMode, setEditMode] = useState(false);
//   const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(null);
//   const [newSubcategory, setNewSubcategory] = useState({ name: "", category: "" });

//   useEffect(() => {
//     const fetchSubcategories = async () => {
//       try {
//         const response = await axios.get('http://localhost:4000/api/subcategories');
//         setSubcategories(response.data.subcategories);
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     const fetchCategories = async () => {
//       try {
//         const response = await axios.get('http://localhost:4000/api/categories');
//         setCategories(response.data.categories);
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     fetchSubcategories();
//     fetchCategories();
//   }, []);

//   // Handle form input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setNewSubcategory({ ...newSubcategory, [name]: value });
//   };

//   // Add or Edit subcategory
//   const handleAddSubcategory = async () => {
//     try {
//       if (editMode) {
//         const response = await axios.put(`http://localhost:4000/api/subcategories/${selectedSubcategoryId}`, newSubcategory);
//         setSubcategories(
//           subcategories.map((subcategory) =>
//             subcategory._id === selectedSubcategoryId ? { ...subcategory, ...newSubcategory } : subcategory
//           )
//         );
//         setEditMode(false);
//         setSelectedSubcategoryId(null);
//       } else {
//         const response = await axios.post('http://localhost:4000/api/subcategories', newSubcategory);
//         setSubcategories([...subcategories, response.data.subcategory]);
//       }
//       setShowModal(false);
//       setNewSubcategory({ name: "", category: "" });
//     } catch (err) {
//       console.error('Error adding/updating subcategory:', err);
//     }
//   };

//   // Delete subcategory
//   const handleDeleteSubcategory = async (id) => {
//     try {
//       await axios.delete(`http://localhost:4000/api/subcategories/${id}`);
//       setSubcategories(subcategories.filter((subcategory) => subcategory._id !== id));
//     } catch (err) {
//       console.error('Error deleting subcategory:', err);
//     }
//   };

//   // Edit subcategory
//   const handleEditSubcategory = (subcategory) => {
//     setNewSubcategory(subcategory);
//     setSelectedSubcategoryId(subcategory._id);
//     setEditMode(true);
//     setShowModal(true);
//   };

//   return (
//     <div className="customer-container">
//       <Sidebar />

//       {/* Main Content */}
//       <div className="main-content">
//         {/* Top Bar */}
//         <div className="top-bar">
//           <h2 className="title">Subcategories</h2>
//           <div className="user-info">
//             <span>Admin</span>
//             <FaCog className="icon" />
//             <FaUser className="icon" />
//           </div>
//         </div>

//         {/* Add Subcategory Button */}
//         <div className="add-category-container">
//           <button className="add-category-btn" onClick={() => { setShowModal(true); setEditMode(false); }}>
//             <FaPlus className="add-icon" /> Add Subcategory
//           </button>
//         </div>

//         {/* Subcategories Table */}
//         <div className="customers-table">
//           <table>
//             <thead>
//               <tr>
//                 <th>Subcategory Name</th>
//                 <th>Category</th>
//                 <th>Operations</th>
//               </tr>
//             </thead>
//             <tbody>
//               {subcategories.map((subcategory) => (
//                 <tr key={subcategory._id}>
//                   <td>{subcategory.name}</td>
//                   <td>{subcategory.category ? subcategory.category.name : "N/A"}</td>
//                   <td className="operations">
//                     <FaEdit className="edit-icon" onClick={() => handleEditSubcategory(subcategory)} />
//                     <FaTrash className="delete-icon" onClick={() => handleDeleteSubcategory(subcategory._id)} />
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Add/Edit Subcategory Modal */}
//       {showModal && (
//         <div className="modal">
//           <div className="modal-content">
//             <h3>{editMode ? "Edit Subcategory" : "Add New Subcategory"}</h3>
//             <label>Name:</label>
//             <input type="text" name="name" value={newSubcategory.name} onChange={handleChange} required />
//             <label>Category:</label>
//             <select name="category" value={newSubcategory.category} onChange={handleChange} required>
//               <option value="">Select Category</option>
//               {categories.map(category => (
//                 <option key={category._id} value={category._id}>{category.name}</option>
//               ))}
//             </select>
//             <div className="modal-actions">
//               <button className="add-btn" onClick={handleAddSubcategory}>
//                 {editMode ? "Update" : "Add"}
//               </button>
//               <button className="close-btn" onClick={() => setShowModal(false)}>Cancel</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Subcategory;
