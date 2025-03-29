import React, { createContext, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Splash from './pages/Splash';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import ForgetPassword from './pages/ResetPassword';
import Items from './components/Items';
// import Measurements from './components/Measurements';
import ResetPasswordRequest from './pages/ResetPassword';
import ProductCard from './components/ProductCard';
import Cart from './components/Cart';
import Checkout from './pages/Checkout'; // Import Checkout
import CustomizeDress from './pages/CustomizeDress'; // Import CustomizeDress
import ShirtMeasurements from './components/ShirtMeasurements';
import PantMeasurements from './components/PantMeasurements';
import BlazerMeasurements from './components/BlazerMeasurements';
import BlouseMeasurements from './components/BlouseMeasurements';
import FabricDetails from './pages/FabricDetails';
import FabricCollection from './components/FabricCollection'; // Import FabricCollection
import ReviewOrder from './pages/ReviewOrder'; // Import ReviewOrder

import Customer from './pages/Customer';
import AdminHome from './pages/AdminHome';
import Category from './pages/Category';
// import Subcategory from './pages/Subcategory';
import Item from './pages/Item';
import Order from './pages/Order';
import Fabric from './pages/Fabric';
import Measurement from './pages/Measurement';
import Sidebar from "./components/Sidebar";
import Design from "./pages/Design";
import CustomerMeasurements from './pages/CustomerMeasurements';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import MensPage from './pages/MensPage';
import WomensPage from './pages/WomensPage';
import AdminProfile from './pages/AdminProfile'; // Import AdminProfile
import AdminUsers from './pages/AdminUsers'; // Import AdminUsers
import { CartProvider } from './context/CartContext'; // Import CartProvider
import CartSidebar from './components/CartSidebar'; // Import CartSidebar
import UserProfile from './pages/UserProfile'; // Import UserProfile
import OrderHistory from './pages/OrderHistory'; // Import OrderHistory
import SplashMensPage from './pages/SplashMensPage'; // Import SplashMensPage
import SplashWomensPage from './pages/SplashWomensPage'; // Import SplashWomensPage
import SplashFabricCollection from './pages/SplashFabricCollection'; // Import SplashFabricCollection
import SplashHome from './pages/SplashHome'; // Import SplashHome

export const AppContext = createContext();

function App() {
  const client = new QueryClient();
  const [fullname, setFullname] = useState(" ");
  const [isCartOpen, setIsCartOpen] = useState(false); // Cart sidebar state

  return (
    <div className='App'>
      <QueryClientProvider client={client}>
        <AppContext.Provider value={{ fullname, setFullname }}>
          <CartProvider> {/* Wrap the application with CartProvider */}
            <Router>
              <Routes>
                <Route path='/' element={<Splash />} />
                <Route path='/auth/Register' element={<Register />} />
                <Route path='/login' element={<Login />} />
                <Route path='/forgetPassword' element={<ForgetPassword />} />
                <Route path='/home' element={<Home />} />
                <Route path='/admin' element={<AdminHome />} />
                <Route path='/Splash' element={<Splash />} />
                <Route path='/items' element={<Items />} />
                {/* <Route path='/measurements' element={<Measurements />} /> */}
                <Route path='/resetPassword' element={<ResetPasswordRequest />} />
                <Route path='/product/:id' element={<ProductCard />} />
                <Route path='/cart' element={<Cart />} />
                <Route path='/checkout' element={<Checkout />} /> {/* Add Checkout route */}
                <Route path='/customize-dress' element={<CustomizeDress />} /> {/* Add CustomizeDress route */}
                <Route path='/measurements/shirt' element={<ShirtMeasurements />} />
                <Route path='/measurements/pant' element={<PantMeasurements />} />
                <Route path='/measurements/blazer' element={<BlazerMeasurements />} />
                <Route path='/measurements/blouse' element={<BlouseMeasurements />} />
                <Route path='/admin/customers' element={<Customer />} />
                <Route path='/admin/categories' element={<Category />} />
                {/* <Route path='/admin/subcategories' element={<Subcategory />} /> */}
                <Route path='/admin/products' element={<Item />} />
                <Route path='/admin/orders' element={<Order />} />
                <Route path='/admin/fabrics' element={<Fabric />} />
                <Route path='/admin/measurements' element={<Measurement />} />
                <Route path='/items/:category/:subcategory' element={<Items />} />
                <Route path='/admin/designs' element={<Design />} />
                <Route path='/fabric-details' element={<FabricDetails />} />
                <Route path='/fabric-collection' element={<FabricCollection />} /> {/* Add FabricCollection route */}
                <Route path='/fabric-details/:id' element={<FabricDetails />} />
                <Route path='/customer-measurements' element={<CustomerMeasurements />} />
                <Route path="/" element={<HomePage />} />
                <Route path="/category/:categoryId" element={<CategoryPage />} />
                <Route path='/mens' element={<MensPage />} /> {/* Updated Route */}
                <Route path='/women' element={<WomensPage />} /> {/* Updated Route */}
                <Route path='/admin-profile' element={<AdminProfile />} /> {/* Add AdminProfile route */}
                <Route path='/admin/users' element={<AdminUsers />} /> {/* Add AdminUsers route */}
                <Route path='/user-profile' element={<UserProfile />} /> {/* Add UserProfile route */}
                <Route path='/order-history' element={<OrderHistory />} /> {/* Add OrderHistory route */}
                <Route path='/splash-mens' element={<SplashMensPage />} /> {/* Add SplashMensPage route */}
                <Route path='/splash-womens' element={<SplashWomensPage />} /> {/* Add SplashWomensPage route */}
                <Route path='/splash-fabric-collection' element={<SplashFabricCollection />} /> {/* Add SplashFabricCollection route */}
                <Route path='/splash-home' element={<SplashHome />} /> {/* Add SplashHome route */}
                <Route path='/review-order' element={<ReviewOrder />} /> {/* Add ReviewOrder route */}
              </Routes>
              <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} /> {/* Cart sidebar */}
            </Router>
          </CartProvider>
        </AppContext.Provider>
      </QueryClientProvider>
    </div>
  );
}

export default App;