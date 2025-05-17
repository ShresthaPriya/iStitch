import React, { useState } from 'react'; // Added useState import
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProvider } from './context/AppContext'; // Import AppProvider
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

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
import OrderConfirmation from './pages/OrderConfirmation'; // Import OrderConfirmation

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
import CartSidebar from './components/CartSidebar'; // Import CartSidebar
import UserProfile from './pages/UserProfile'; // Import UserProfile
import OrderHistory from './pages/OrderHistory'; // Import OrderHistory
import SplashMensPage from './pages/SplashMensPage'; // Import SplashMensPage
import SplashWomensPage from './pages/SplashWomensPage'; // Import SplashWomensPage
import SplashFabricCollection from './pages/SplashFabricCollection'; // Import SplashFabricCollection
import SplashHome from './pages/SplashHome'; // Import SplashHome
import ProductDetails from './pages/ProductDetails'; // Import ProductDetails
import AdminLogin from './pages/AdminLogin'; // Import AdminLogin
import AdminDashboard from './pages/AdminDashboard'; // Import AdminDashboard
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import ForgotPassword from './pages/ForgotPassword';

function App() {
  const client = new QueryClient();
  const [isCartOpen, setIsCartOpen] = useState(false); // Cart sidebar state

  return (
    <div className='App'>
      <QueryClientProvider client={client}>
        <AuthProvider>
          <AppProvider>
            <CartProvider>
              <Router>
                <Routes>
                  {/* Public routes */}
                  <Route path='/' element={<Splash />} />
                  <Route path='/auth/Register' element={<Register />} />
                  <Route path='/login' element={<Login />} />
                  <Route path='/forgetPassword' element={<ForgetPassword />} />
                  <Route path='/home' element={<Home />} />
                  <Route path='/Splash' element={<Splash />} />
                  <Route path='/items' element={<Items />} />
                  <Route path='/resetPassword' element={<ResetPasswordRequest />} />
                  <Route path='/product/:id' element={<ProductCard />} />
                  <Route path='/cart' element={<Cart />} />
                  <Route path='/checkout' element={<Checkout />} />
                  <Route path='/customize-dress' element={<CustomizeDress />} />
                  <Route path='/measurements/shirt' element={<ShirtMeasurements />} />
                  <Route path='/measurements/pant' element={<PantMeasurements />} />
                  <Route path='/measurements/blazer' element={<BlazerMeasurements />} />
                  <Route path='/measurements/blouse' element={<BlouseMeasurements />} />
                  <Route path='/fabric-details' element={<FabricDetails />} />
                  <Route path='/fabric-collection' element={<FabricCollection />} />
                  <Route path='/fabric-details/:id' element={<FabricDetails />} />
                  <Route path='/customer-measurements' element={<CustomerMeasurements />} />
                  <Route path="/" element={<HomePage />} />
                  <Route path="/category/:categoryId" element={<CategoryPage />} />
                  <Route path='/mens' element={<MensPage />} />
                  <Route path='/women' element={<WomensPage />} />
                  <Route path='/user-profile' element={<UserProfile />} />
                  <Route path='/order-history' element={<OrderHistory />} />
                  <Route path='/splash-mens' element={<SplashMensPage />} />
                  <Route path='/splash-womens' element={<SplashWomensPage />} />
                  <Route path='/splash-fabric-collection' element={<SplashFabricCollection />} />
                  <Route path='/splash-home' element={<SplashHome />} />
                  <Route path='/review-order' element={<ReviewOrder />} />
                  <Route path='/order-confirmation' element={<OrderConfirmation />} />
                  <Route path='/product-details' element={<ProductDetails />} />
                  
                  {/* Admin login page - public */}
                  <Route path="/admin/login" element={<AdminLogin />} />
                  
                  {/* Protected admin routes */}
                  <Route path='/admin' element={
                    <ProtectedAdminRoute>
                      <AdminHome />
                    </ProtectedAdminRoute>
                  } />
                  <Route path='/admin/dashboard' element={
                    <ProtectedAdminRoute>
                      <AdminDashboard />
                    </ProtectedAdminRoute>
                  } />
                  <Route path='/admin/customers' element={
                    <ProtectedAdminRoute>
                      <Customer />
                    </ProtectedAdminRoute>
                  } />
                  <Route path='/admin/categories' element={
                    <ProtectedAdminRoute>
                      <Category />
                    </ProtectedAdminRoute>
                  } />
                  <Route path='/admin/products' element={
                    <ProtectedAdminRoute>
                      <Item />
                    </ProtectedAdminRoute>
                  } />
                  <Route path='/admin/orders' element={
                    <ProtectedAdminRoute>
                      <Order />
                    </ProtectedAdminRoute>
                  } />
                  <Route path='/admin/fabrics' element={
                    <ProtectedAdminRoute>
                      <Fabric />
                    </ProtectedAdminRoute>
                  } />
                  <Route path='/admin/measurements' element={
                    <ProtectedAdminRoute>
                      <Measurement />
                    </ProtectedAdminRoute>
                  } />
                  <Route path='/admin/designs' element={
                    <ProtectedAdminRoute>
                      <Design />
                    </ProtectedAdminRoute>
                  } />
                  <Route path='/admin-profile' element={
                    <ProtectedAdminRoute>
                      <AdminProfile />
                    </ProtectedAdminRoute>
                  } />
                  <Route path='/admin/users' element={
                    <ProtectedAdminRoute>
                      <AdminUsers />
                    </ProtectedAdminRoute>
                  } />
                  <Route path='/forgot-password' element={<ForgotPassword />} />
                </Routes>
                <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
              </Router>
            </CartProvider>
          </AppProvider>
        </AuthProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;