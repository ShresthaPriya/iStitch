import React, { useState } from "react";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartSidebar from '../components/CartSidebar';
import CategoryGrid from "../components/CategoryGrid";
import "../styles/Home.css";

const Home = () => {
    const [isCartOpen, setIsCartOpen] = useState(false);

    return (
        <>
            <Navbar onCartClick={() => setIsCartOpen(true)} />
            <div className="home-page">
                <h2>Welcome to iStitch</h2>
                <CategoryGrid includeNavbar={false} /> {/* Ensure no navbar is included */}
            </div>
            <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            <Footer />
        </>
    );
};

export default Home;
