import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import '../styles/CategoryPage.css';

const CategoryPage = () => {
  const { categoryId } = useParams();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(`/api/items/category/${categoryId}`);
        setItems(response.data.items);
      } catch (err) {
        console.error("Error fetching items:", err);
      }
    };

    fetchItems();
  }, [categoryId]);

  return (
    <>
      <Navbar />
      <div className="category-page">
        <h2>Category Items</h2>
        <div className="items-grid">
          {items.map(item => (
            <div key={item._id} className="item-card">
              <img src={`/uploads/${item.images[0]}`} alt={item.name} className="item-image" />
              <h3>{item.name}</h3>
              <p>{item.price}</p>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CategoryPage;
