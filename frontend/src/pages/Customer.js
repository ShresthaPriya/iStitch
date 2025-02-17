import { useState, useEffect } from "react";
import { FaUser, FaCog, FaEdit, FaTrash, FaEye, FaPlus } from "react-icons/fa";
import "../styles/Customer.css";
import Sidebar from "../components/Sidebar";

const Customer = () => {
  const [username] = useState("Admin");
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [newCustomer, setNewCustomer] = useState({ name: "", email: "", address: "", phone: "", order: [] });
  const [viewingCustomer, setViewingCustomer] = useState(null);
  const [showMeasurements, setShowMeasurements] = useState(false);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/customers', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        const data = await response.json();
        if (data.success) {
          setCustomers(data.customers);
        } else {
          console.error(data.error);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchCustomers();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer({ ...newCustomer, [name]: value });
  };

  // Add or Edit customer
  const handleAddCustomer = async () => {
    try {
      if (editMode) {
        const response = await fetch(`http://localhost:3000/api/customers/${selectedCustomerId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newCustomer)
        });
        const data = await response.json();
        if (data.success) {
          setCustomers(
            customers.map((customer) =>
              customer._id === selectedCustomerId ? { ...customer, ...newCustomer } : customer
            )
          );
          setEditMode(false);
          setSelectedCustomerId(null);
        } else {
          console.error(data.error);
        }
      } else {
        const response = await fetch('http://localhost:3000/api/customers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newCustomer)
        });
        const data = await response.json();
        if (data.success) {
          setCustomers([...customers, data.customer]);
        } else {
          console.error(data.error);
        }
      }
      setShowModal(false);
      setNewCustomer({ name: "", email: "", address: "", phone: "", order: [] });
    } catch (err) {
      console.error('Error adding/updating customer:', err);
    }
  };

  // Delete customer
  const handleDeleteCustomer = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/customers/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const data = await response.json();
      if (data.success) {
        setCustomers(customers.filter((customer) => customer._id !== id));
      } else {
        console.error(data.error);
      }
    } catch (err) {
      console.error('Error deleting customer:', err);
    }
  };

  // Edit customer
  const handleEditCustomer = (customer) => {
    setNewCustomer(customer);
    setSelectedCustomerId(customer._id);
    setEditMode(true);
    setShowModal(true);
  };

  // View customer profile and measurements
  const handleViewCustomer = (customer) => {
    setViewingCustomer(customer);
    setShowMeasurements(false); // Reset to hide measurements initially
  };

  // Toggle Measurements View
  const handleViewMeasurements = () => {
    setShowMeasurements(!showMeasurements);
  };

  return (
    <div className="customer-container">
      <Sidebar />

      {/* Main Content */}
      <div className="main-content">
        {/* Top Bar */}
        <div className="top-bar">
          <h2 className="title">Customers</h2>
          <div className="user-info">
            <span>{username}</span>
            <FaCog className="icon" />
            <FaUser className="icon" />
          </div>
        </div>

        {/* Add Customer Button */}
        <div className="add-category-container">
          <button className="add-category-btn" onClick={() => { setShowModal(true); setEditMode(false); }}>
            <FaPlus className="add-icon" /> Add Customer
          </button>
        </div>

        {/* Customers Table */}
        <div className="customers-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Address</th>
                <th>Phone</th>
                <th>Order Item</th>
                <th>Operations</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer._id}>
                  <td>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.address}</td>
                  <td>{customer.phone}</td>
                  <td>{customer.order.join(", ")}</td>
                  <td className="operations">
                    <FaEdit className="edit-icon" onClick={() => handleEditCustomer(customer)} />
                    <FaTrash className="delete-icon" onClick={() => handleDeleteCustomer(customer._id)} />
                    <FaEye className="view-icon" onClick={() => handleViewCustomer(customer)} />
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
            <h3>{editMode ? "Edit Customer" : "Add New Customer"}</h3>
            <label>Name:</label>
            <input type="text" name="name" value={newCustomer.name} onChange={handleChange} required />
            <label>Email:</label>
            <input type="email" name="email" value={newCustomer.email} onChange={handleChange} required />
            <label>Address:</label>
            <input type="text" name="address" value={newCustomer.address} onChange={handleChange} required />
            <label>Phone:</label>
            <input type="text" name="phone" value={newCustomer.phone} onChange={handleChange} required />
            <label>Order:</label>
            <input type="text" name="order" value={newCustomer.order} onChange={handleChange} required />
            <div className="modal-actions">
              <button className="add-btn" onClick={handleAddCustomer}>
                {editMode ? "Update" : "Add"}
              </button>
              <button className="close-btn" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* View Customer Details Modal */}
      {viewingCustomer && (
        <div className="modal">
          <div className="modal-content">
            <h3>{viewingCustomer.name}'s Profile</h3>
            <img src={viewingCustomer.profilePicture} alt="Profile" className="profile-picture" />
            <h4>Details</h4>
            <p><strong>Email:</strong> {viewingCustomer.email}</p>
            <p><strong>Address:</strong> {viewingCustomer.address}</p>
            <p><strong>Phone:</strong> {viewingCustomer.phone}</p>
            
            {/* View Measurements Button */}
            <button className="view-measurements-btn" onClick={handleViewMeasurements}>
              {showMeasurements ? "Hide Measurements" : "View Measurements"}
            </button>

            {/* Show Measurements */}
            {showMeasurements && (
              <div className="measurements">
                <h4>Measurements</h4>
                <ul>
                  <li><strong>Chest:</strong> {viewingCustomer.measurements.chest} inches</li>
                  <li><strong>Waist:</strong> {viewingCustomer.measurements.waist} inches</li>
                  <li><strong>Hip:</strong> {viewingCustomer.measurements.hip} inches</li>
                  <li><strong>Inseam:</strong> {viewingCustomer.measurements.inseam} inches</li>
                </ul>
              </div>
            )}
            <button className="close-btn" onClick={() => setViewingCustomer(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customer;
