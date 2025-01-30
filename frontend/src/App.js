import React, {createContext, useState} from'react';
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
import Navbar from './components/Navbar';
import Measurements from './components/Measurements';
import ResetPasswordRequest from './pages/ResetPassword';
import ProductCard from './components/ProductCard';
import Cart from './components/Cart'; // Import Cart component
import Checkout from './components/Checkout'; // Import Checkout component
import ShirtMeasurements from './components/ShirtMeasurements'; // Import ShirtMeasurements component
import PantMeasurements from './components/PantMeasurements'; // Import PantMeasurements component
import BlazerMeasurements from './components/BlazerMeasurements'; // Import BlazerMeasurements component
import BlouseMeasurements from './components/BlouseMeasurements'; // Import BlouseMeasurements component


export const AppContext = createContext();

function App(){
  const client = new QueryClient();
  const [fullname, setFullname] = useState(" "); 

  return (
    <div className='App'>
      <QueryClientProvider client = {client}>
        <AppContext.Provider value = {{fullname, setFullname}}>
          <Router>
            <Navbar />
            <Routes>
              <Route path='/' element={<Splash/>}/>
              <Route path='/auth/Register' element={<Register/>}/>
              <Route path='/Login' element={<Login/>}/>
              <Route path='/forgetPassword' element={<ForgetPassword />} />
              <Route path='/Home' element={<Home/>}/>
              <Route path='/Splash' element={<Splash/>}/>
              <Route path='/Items' element={<Items />} />
              <Route path='/Measurement' element={<Measurements />} />
              <Route path ='/resetPassword' element={<ResetPasswordRequest />} />
              <Route path='/product/:id' element={<ProductCard />} />
              <Route path='/cart' element={<Cart />} /> {/* Add Cart route */}
              <Route path='/checkout' element={<Checkout />} /> {/* Add Checkout route */}
              <Route path='/measurements/shirt' element={<ShirtMeasurements />} /> {/* Add ShirtMeasurements route */}
              <Route path='/measurements/pant' element={<PantMeasurements />} /> {/* Add PantMeasurements route */}
              <Route path='/measurements/blazer' element={<BlazerMeasurements />} /> {/* Add BlazerMeasurements route */}
              <Route path='/measurements/blouse' element={<BlouseMeasurements />} /> {/* Add BlouseMeasurements route */}
              {/* Add other measurement routes as needed */}
            </Routes>
          </Router>
        </AppContext.Provider>
      </QueryClientProvider>
    </div>
  );
}
export default App;