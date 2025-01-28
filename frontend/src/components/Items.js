import React from 'react';
import '../styles/Items.css';
import { useNavigate } from 'react-router-dom';

function Items() {
    const navigate = useNavigate();

    const viewItem = (id) => {
      navigate(`/product/${id}`);
      
    };

    return (
        <>
        <h2>Shirts</h2>
        <p><span className="create-your-own"><i className="fa fa-plus"></i>Create your own</span></p>
        <div className="view-all-container">
        <a href="#viewAll" className="view-all-link">View all <span>▾</span></a>
      </div>
        <div className="explore-items">
            <div className="item-grid">
                <img src={require('../images/items/shirts/shirt4.jpg')} alt="Shirt" className="item-image"/>
                <h2>Casual Shirt</h2>
                <div className='info'>
                    <p>Comfortable and stylish casual shirt for everyday wear.</p>
                    
                </div>
                <div className="sub-info">
                        <p>4.5 ★★★★</p>
                       
                    </div>
                <button onClick={()=>viewItem('item-id-1')}>View Item</button>
            </div>
            <div className="item-grid">
                <img src={require('../images/items/shirts/shirt5.jpg')} alt="Shirt" className="item-image"/>
                <h2>Formal Shirt</h2>
                <div className='info'>
                    <p>Elegant formal shirt perfect for office and events.</p>
                 
                </div>
                <div className="sub-info">
                        <p>4.5 ★★★★</p>
                       
                    </div>
                <button onClick={()=>viewItem('item-id-2')}>View Item</button>
            </div>
            <div className="item-grid">
                <img src={require('../images/items/shirts/shirt6.jpg')} alt="Shirt" className="item-image"/>
                <h2>Party Shirt</h2>
                <div className='info'>
                    <p>Stylish party shirt to make you stand out in any event.</p>
                </div>
                <div className="sub-info">
                        <p>4.5 ★★★★</p>
                       
                    </div>
                <button onClick={()=>viewItem('item-id-3')}>View Item</button>
            </div>
            <div className="item-grid">
                <img src={require('../images/items/shirts/shirt3.jpg')} alt="Shirt" className="item-image"/>
                <h2>Non-Iron Stretch Shirt</h2>
                <div className='info'>
                    <p>This beautiful blend of 100s two-ply Supima cotton and premium performance elastane is soft and super comfortable.</p>
                    
                </div>
                <div className="sub-info">
                        <p>4.5 ★★★★</p>
                       
                    </div>
                <button onClick={()=>viewItem('item-id-4')}>View Item</button>
            </div>
            <div className="item-grid">
                <img src={require('../images/items/shirts/shirt5.jpg')} alt="Shirt" className="item-image"/>
                <h2>Plain White Shirt</h2>
                <div className='info'>
                    <p>Elegant formal shirt perfect for office and events.</p>
                 
                </div>
                <div className="sub-info">
                        <p>4.5 ★★★★</p>
                       
                    </div>
                <button onClick={()=>viewItem('item-id-5')}>View Item</button>
            </div>
            <div className="item-grid">
                <img src={require('../images/items/shirts/shirt7.jpg')} alt="Shirt" className="item-image"/>
                <h2>Wrinkle-Resistant Shirt</h2>
                <div className='info'>
                    <p>A staple lavender houndstooth in our popular Mayfair quality.</p>
                 
                </div>
                <div className="sub-info">
                        <p>4.5 ★★★★</p>
                       
                    </div>
                <button onClick={()=>viewItem('item-id-6')}>View Item</button>
            </div>
        </div>
        </>
    );
}

export default Items;
