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
import ResetPasswordRequest from './pages/ResetPassword';
import ProductCard from './components/ProductCard';
import Cart from './components/Cart'; // Import Cart component
import Checkout from './components/Checkout'; // Import Checkout component


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
              <Route path ='/resetPassword' element={<ResetPasswordRequest />} />
              <Route path='/product/:id' element={<ProductCard />} />
              <Route path='/cart' element={<Cart />} /> {/* Add Cart route */}
              <Route path='/checkout' element={<Checkout />} /> {/* Add Checkout route */}
            </Routes>
          </Router>
        </AppContext.Provider>
      </QueryClientProvider>
    </div>
  );
}
export default App;