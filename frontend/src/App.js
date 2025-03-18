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
import Checkout from './components/Checkout';
import ShirtMeasurements from './components/ShirtMeasurements';
import PantMeasurements from './components/PantMeasurements';
import BlazerMeasurements from './components/BlazerMeasurements';
import BlouseMeasurements from './components/BlouseMeasurements';
import FabricDetails from './pages/FabricDetails';
import FabricCollection from './components/FabricCollection';

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

export const AppContext = createContext();

function App() {
  const client = new QueryClient();
  const [fullname, setFullname] = useState(" ");

  return (
    <div className='App'>
      <QueryClientProvider client={client}>
        <AppContext.Provider value={{ fullname, setFullname }}>
          <Router>
            {/* <Sidebar /> */}
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
              <Route path='/checkout' element={<Checkout />} />
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
              <Route path='/fabric-collection' element={<FabricCollection />} />
              <Route path='/fabric-details/:id' element={<FabricDetails />} />
              <Route path='/customer-measurements' element={<CustomerMeasurements />} />
            </Routes>
          </Router>
        </AppContext.Provider>
      </QueryClientProvider>
    </div>
  );
}

export default App;