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



export const AppContext = createContext();

function App(){
  const client = new QueryClient();
  const [fullname, setFullname] = useState(" "); 

  return (
    <div className='App'>
      <QueryClientProvider client = {client}>
        <AppContext.Provider value = {{fullname, setFullname}}>
          <Router>
            <Routes>
              <Route path='/auth/Register' element={<Register/>}/>
              <Route path='/Login' element={<Login/>}/>
              <Route path='/forgetPassword' element={<ForgetPassword />} />
              <Route path='/Home' element={<Home/>}/>
              
            </Routes>
          </Router>
        </AppContext.Provider>
      </QueryClientProvider>
    </div>
  );
}
export default App;