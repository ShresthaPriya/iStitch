import { useState, useEffect } from "react";
import {
  FaUser,
  FaUsersCog,
  FaListAlt,
  FaClipboardList,
  FaShoppingBag,
  FaBox,
  FaCalendar,
} from "react-icons/fa";
import axios from "axios";
import "../styles/Dashboard.css";
import Sidebar from "../components/Sidebar";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LineChart,
  XAxis,
  YAxis,
  Line,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A020F0"];

const AdminHome = () => {
  const [username] = useState("Admin");
  const [dateRange, setDateRange] = useState("all");
  const [metrics, setMetrics] = useState({
    customerCount: 0,
    pendingOrderCount: 0,
    totalOrderCount: 0,
    totalSales: 0,
    totalItemCount: 0,
    orderStatusCounts: [],
    ordersByDate: [],
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/metrics?range=${dateRange}`);
        setMetrics(response.data.metrics);
      } catch (err) {
        console.error("Error fetching metrics:", err);
      }
    };

    fetchMetrics();
  }, [dateRange]);

  // Handle date range change
  const handleDateRangeChange = (e) => {
    setDateRange(e.target.value);
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <div className="top-bar">
          <h2 className="title">Dashboard</h2>
          <div className="user-info">
            <span>{username}</span>
            <FaUser className="icon" />
          </div>
        </div>

        <div className="metrics-grid">
          <div className="metric-card customers">
            <FaUsersCog className="metric-icon" />
            <span className="metric-title">Customers</span>
            <span className="metric-value">{metrics.customerCount}</span>
          </div>
          {/* <div className="metric-card pending-orders">
            <FaListAlt className="metric-icon" />
            <span className="metric-title">Pending Orders</span>
            <span className="metric-value">{metrics.pendingOrderCount}</span>
          </div> */}
          <div className="metric-card total-orders">
            <FaClipboardList className="metric-icon" />
            <span className="metric-title">Total Orders</span>
            <span className="metric-value">{metrics.totalOrderCount}</span>
          </div>
          <div className="metric-card total-sales">
            <FaShoppingBag className="metric-icon" />
            <span className="metric-title">Total Sales</span>
            <span className="metric-value">
              ${metrics.totalSales.toFixed(2)}
            </span>
          </div>
          <div className="metric-card total-items">
            <FaBox className="metric-icon" />
            <span className="metric-title">Total Items</span>
            <span className="metric-value">{metrics.totalItemCount}</span>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-section">
          <div className="charts-header">
            <h3 className="section-title">Data Analytics</h3>
            <div className="filter-container">
              <FaCalendar className="filter-icon" />
              <select 
                value={dateRange} 
                onChange={handleDateRangeChange}
                className="date-filter"
              >
                <option value="all">All Time</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
            </div>
          </div>
          
          <div className="chart-row">
            <div className="chart-container">
              <h3 className="section-title">Order Status Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={metrics.orderStatusCounts}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="name"
                  >
                    {metrics.orderStatusCounts.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} orders`, 'Count']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="chart-container">
              <h3 className="section-title">Sales Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={metrics.ordersByDate}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} orders`, 'Orders']} />
                  <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    name="Orders" 
                    stroke="#8884d8" 
                    activeDot={{ r: 8 }} 
                  />
                  <Legend />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;