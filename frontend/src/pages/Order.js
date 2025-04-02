import { useState, useEffect } from "react";
import { FaUser, FaCog, FaEdit, FaTrash, FaEye, FaPlus } from "react-icons/fa";
import axios from "axios";
import "../styles/Order.css";
import Sidebar from "../components/Sidebar";

const Order = () => {
  const [username] = useState("Admin");
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [newOrder, setNewOrder] = useState({ customer: "", items: [], totalAmount: 0, status: "Pending" });
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState(""); // Define the error state

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/orders');
        setOrders(response.data.orders);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    const fetchCustomers = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/customers');
        setCustomers(response.data.customers);
      } catch (err) {
        console.error("Error fetching customers:", err);
      }
    };

    fetchOrders();
    fetchCustomers();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewOrder({ ...newOrder, [name]: value });
  };

  // Add or Edit order
  const handleAddOrder = async () => {
    try {
      if (editMode) {
        const response = await axios.put(`http://localhost:4000/api/orders/${selectedOrderId}`, newOrder);
        setOrders(
          orders.map((order) =>
            order._id === selectedOrderId ? { ...order, ...response.data.order } : order
          )
        );
        setEditMode(false);
        setSelectedOrderId(null);
      } else {
        const response = await axios.post('http://localhost:4000/api/orders', newOrder);
        setOrders([...orders, response.data.order]);
      }
      setShowModal(false);
      setNewOrder({ customer: "", items: [], totalAmount: 0, status: "Pending" });
    } catch (err) {
      console.error('Error adding/updating order:', err);
      setError(`Error adding/updating order: ${err.response?.data?.error || err.message}`);
    }
  };

  // Delete order
  const handleDeleteOrder = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/orders/${id}`);
      setOrders(orders.filter((order) => order._id !== id));
    } catch (err) {
      console.error('Error deleting order:', err);
      setError(`Error deleting order: ${err.response?.data?.error || err.message}`);
    }
  };

  // Edit order
  const handleEditOrder = (order) => {
    setNewOrder(order);
    setSelectedOrderId(order._id);
    setEditMode(true);
    setShowModal(true);
  };

  // View order
  const handleViewOrder = (order) => {
    // Implement the logic to view order details
    console.log(order);
  };

  return (
    <div className="order-container">
      <Sidebar />

      {/* Main Content */}
      <div className="main-content">
        {/* Top Bar */}
        <div className="top-bar">
          <h2 className="title">Orders</h2>
          <div className="user-info">
            <span>{username}</span>
            <FaCog className="icon" />
            <FaUser className="icon" />
          </div>
        </div>

        {/* Add Order Button */}
        <div className="add-category-container">
          <button className="add-category-btn" onClick={() => { setShowModal(true); setEditMode(false); }}>
            <FaPlus className="add-icon" /> Add Order
          </button>
        </div>

        {/* Orders Table */}
        <div className="orders-table">
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Items</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Operations</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order.customer.name}</td>
                  <td>{order.items.join(", ")}</td>
                  <td>{order.totalAmount}</td>
                  <td>{order.status}</td>
                  <td className="operations">
                    <FaEdit className="edit-icon" onClick={() => handleEditOrder(order)} />
                    <FaTrash className="delete-icon" onClick={() => handleDeleteOrder(order._id)} />
                    <FaEye className="view-icon" onClick={() => handleViewOrder(order)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Order Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editMode ? "Edit Order" : "Add New Order"}</h3>
            {error && <p className="error">{error}</p>}
            <label>Customer:</label>
            <select name="customer" value={newOrder.customer} onChange={handleChange} required>
              <option value="">Select Customer</option>
              {customers.map(customer => (
                <option key={customer._id} value={customer._id}>{customer.name}</option>
              ))}
            </select>
            <label>Items:</label>
            <input type="text" name="items" value={newOrder.items.join(", ")} onChange={(e) => setNewOrder({ ...newOrder, items: e.target.value.split(", ") })} required />
            <label>Total Amount:</label>
            <input type="number" name="totalAmount" value={newOrder.totalAmount} onChange={handleChange} required />
            <label>Status:</label>
            <select name="status" value={newOrder.status} onChange={handleChange} required>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <div className="modal-actions">
              <button className="add-btn" onClick={handleAddOrder}>
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
