import { useState } from "react";
import { FaUser, FaCog, FaEdit, FaTrash, FaEye, FaPlus } from "react-icons/fa";
import "../styles/Customer.css"; 
import Sidebar from "../components/Sidebar";

const Order = () => {
  const [items, setItems] = useState([
    { id: 1, name: "Dresses", phone: 981728728, item: "Pants", measurement: "xxx", deliveryDate: "Feb 12, 2025", note: "if any", paymentStatus: "Done", orderStatus: "In Process", price: "Rs.2200" },
    // Add more items as needed
  ]);
  
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [newItem, setNewItem] = useState({ name: "", price: "", item: "", measurement: "", deliveryDate: "", paymentStatus: "", orderStatus: "In Process" });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
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
    setNewItem({ name: "", price: "", item: "", measurement: "", deliveryDate: "", paymentStatus: "", orderStatus: "In Process" });
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

  // Handle Order Status change
  const handleStatusChange = (id, newStatus) => {
    setItems(items.map((item) => 
      item.id === id ? { ...item, orderStatus: newStatus } : item
    ));
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
            <FaPlus className="add-icon" /> Add Orders
          </button>
        </div>

        {/* Items Table */}
        <div className="customers-table">
          <table>
            <thead>
              <tr>
                <th>Item Id</th>
                <th>Item Name</th>
                <th>Price</th>
                <th>Item</th>
                <th>Measurement</th>
                <th>Delivery Date</th>
                <th>Payment Status</th>
                <th>Order Status</th>
                <th>Operations</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.price}</td>
                  <td>{item.item}</td>
                  <td>{item.measurement}</td>
                  <td>{item.deliveryDate}</td>
                  <td>{item.paymentStatus}</td>
                  <td>
                    <select
                      value={item.orderStatus}
                      onChange={(e) => handleStatusChange(item.id, e.target.value)}
                    >
                      <option value="In Process">In Process</option>
                      <option value="Dispatched">Dispatched</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                  <td className="operations">
                    <FaEdit className="edit-icon" onClick={() => handleEditItem(item)} />
                    <FaTrash className="delete-icon" onClick={() => handleDeleteItem(item.id)} />
                    <FaEye className="view-icon" />
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
            <h3>{editMode ? "Edit Orders" : "Add New Orders"}</h3>
            <label>Item Name:</label>
            <input type="text" name="name" value={newItem.name} onChange={handleChange} required />

            <label>Price:</label>
            <input type="number" name="price" value={newItem.price} onChange={handleChange} required />

            <label>Item:</label>
            <input type="text" name="item" value={newItem.item} onChange={handleChange} required />

            <label>Measurement:</label>
            <input type="text" name="measurement" value={newItem.measurement} onChange={handleChange} required />

            <label>Delivery Date:</label>
            <input type="date" name="deliveryDate" value={newItem.deliveryDate} onChange={handleChange} required />

            <label>Payment Status:</label>
            <input type="text" name="paymentStatus" value={newItem.paymentStatus} onChange={handleChange} required />

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

export default Order;
