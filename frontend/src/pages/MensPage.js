import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import '../styles/CategoryPage.css';

const MensPage = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/items?category=men');
        setItems(response.data.items);
      } catch (err) {
        console.error("Error fetching items:", err);
      }
    };

    fetchItems();
  }, []);

  return (
    <>
      <Navbar />
      <div className="category-page">
        <h2>Men's Items</h2>
        <div className="items-grid">
          {items.length === 0 ? (
            <p>No items found.</p>
          ) : (
            items.map(item => (
              <div key={item._id} className="item-card">
                <img src={`http://localhost:4000/public/images/${item.images[0]}`} alt={item.name} className="item-image" />
                <h3>{item.name}</h3>
                <p>{item.price}</p>
                <p>{item.description}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default MensPage;
