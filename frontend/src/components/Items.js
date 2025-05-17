import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Items.css';
import Navbar from './Navbar';

function Items() {
    const { category, subcategory } = useParams();
    const decodedCategory = decodeURIComponent(category);
    const decodedSubcategory = decodeURIComponent(subcategory);
    const [items, setItems] = useState([]);
    const [filters, setFilters] = useState({
        price: '',
        fabric: '',
        category: '',
    });
    const [filtersVisible, setFiltersVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/api/items?category=${decodedCategory}&subcategory=${decodedSubcategory}`);
                setItems(response.data.items);
            } catch (err) {
                console.error(err);
            }
        };

        fetchItems();
    }, [decodedCategory, decodedSubcategory]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    const toggleFilters = () => {
        setFiltersVisible(!filtersVisible);
    };

    const viewItem = (id) => {
        navigate(`/product/${id}`);
    };

    return (
        <>
            <Navbar />
            <div className="items-page">
                <button className="filter-button" onClick={toggleFilters}>
                    <i className="fa fa-filter"></i>
                </button>

                {filtersVisible && (
                    <div className="filters">
                        <h3>Filters</h3>
                        <div className="form-group">
                            <label htmlFor="price">Price</label>
                            <input
                                type="text"
                                id="price"
                                name="price"
                                value={filters.price}
                                onChange={handleFilterChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="fabric">Fabric</label>
                            <input
                                type="text"
                                id="fabric"
                                name="fabric"
                                value={filters.fabric}
                                onChange={handleFilterChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="category">Category</label>
                            <input
                                type="text"
                                id="category"
                                name="category"
                                value={filters.category}
                                onChange={handleFilterChange}
                            />
                        </div>
                    </div>
                )}

                <h2>{decodedSubcategory} Items</h2>
                <div className="explore-items">
                    {items.length === 0 ? (
                        <p>No items found.</p>
                    ) : (
                        items.map(item => (
                            <div className="item-grid" key={item._id}>
                                <img src={`http://localhost:4000/uploads/${item.images[0]}`} alt={item.name} className="item-image" />
                                <h2>{item.name}</h2>
                                <div className='info'>
                                    <p>{item.description}</p>
                                </div>
                                <div className="sub-info">
                                    <p>{item.rating} ★★★★</p>
                                </div>
                                <button onClick={() => viewItem(item._id)}>View Item</button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}

export default Items;
