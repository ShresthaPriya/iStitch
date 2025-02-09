import React, { useState } from 'react';
import '../styles/Items.css';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

function Items() {
    const navigate = useNavigate();

    const [filters, setFilters] = useState({
        price: '',
        fabric: '',
        category: '',
    });

    const [filtersVisible, setFiltersVisible] = useState(false);

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
            {/* Filter Icon */}
            <button className="filter-button" onClick={toggleFilters}>
                <i className="fa fa-filter"></i>
            </button>

            {/* Filters Section */}
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
            {/* Filters Section will be visible here when filtersVisible is true */}
            <>
                <h2>Shirts</h2>
                <p><span className="create-your-own"><i className="fa fa-plus"></i>Create your own</span></p>
                <div className="view-all-container">
                    <a href="#viewAll" className="view-all-link">View all <span>▾</span></a>
                </div>
                <div className="explore-items">
                    <div className="item-grid">
                        <img src={require('../images/items/shirts/shirt4.jpg')} alt="Shirt" className="item-image" />
                        <h2>Casual Shirt</h2>
                        <div className='info'>
                            <p>Comfortable and stylish casual shirt for everyday wear.</p>

                        </div>
                        <div className="sub-info">
                            <p>4.5 ★★★★</p>

                        </div>
                        <button onClick={() => viewItem('item-id-1')}>View Item</button>
                    </div>
                    <div className="item-grid">
                        <img src={require('../images/items/shirts/shirt5.jpg')} alt="Shirt" className="item-image" />
                        <h2>Formal Shirt</h2>
                        <div className='info'>
                            <p>Elegant formal shirt perfect for office and events.</p>

                        </div>
                        <div className="sub-info">
                            <p>4.5 ★★★★</p>

                        </div>
                        <button onClick={() => viewItem('item-id-2')}>View Item</button>
                    </div>
                    <div className="item-grid">
                        <img src={require('../images/items/shirts/shirt6.jpg')} alt="Shirt" className="item-image" />
                        <h2>Party Shirt</h2>
                        <div className='info'>
                            <p>Stylish party shirt to make you stand out in any event.</p>
                        </div>
                        <div className="sub-info">
                            <p>4.5 ★★★★</p>

                        </div>
                        <button onClick={() => viewItem('item-id-3')}>View Item</button>
                    </div>
                    <div className="item-grid">
                        <img src={require('../images/items/shirts/shirt3.jpg')} alt="Shirt" className="item-image" />
                        <h2>Non-Iron Stretch Shirt</h2>
                        <div className='info'>
                            <p>This beautiful blend of 100s two-ply Supima cotton and premium performance elastane is soft and super comfortable.</p>

                        </div>
                        <div className="sub-info">
                            <p>4.5 ★★★★</p>

                        </div>
                        <button onClick={() => viewItem('item-id-4')}>View Item</button>
                    </div>
                    <div className="item-grid">
                        <img src={require('../images/items/shirts/shirt5.jpg')} alt="Shirt" className="item-image" />
                        <h2>Plain White Shirt</h2>
                        <div className='info'>
                            <p>Elegant formal shirt perfect for office and events.</p>

                        </div>
                        <div className="sub-info">
                            <p>4.5 ★★★★</p>

                        </div>
                        <button onClick={() => viewItem('item-id-5')}>View Item</button>
                    </div>
                    <div className="item-grid">
                        <img src={require('../images/items/shirts/shirt7.jpg')} alt="Shirt" className="item-image" />
                        <h2>Wrinkle-Resistant Shirt</h2>
                        <div className='info'>
                            <p>A staple lavender houndstooth in our popular Mayfair quality.</p>

                        </div>
                        <div className="sub-info">
                            <p>4.5 ★★★★</p>

                        </div>
                        <button onClick={() => viewItem('item-id-6')}>View Item</button>
                    </div>
                </div>
            </>
        </div> </>
    );
}

export default Items;
