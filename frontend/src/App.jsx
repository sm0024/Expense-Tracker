import { useState } from 'react'

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import Home from './pages/Dashboard/Home';
import Income from './pages/Dashboard/Income';
import Expense from './pages/Dashboard/Expense';
import UserProvider from './context/userContext';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <UserProvider>
      <div>
        <div>
          <Router>
            <Routes>
              <Route path="/" element={<Root />} />
              <Route path="/login" exact element={<Login />} />
              <Route path="/signup" exact element={<SignUp />} />
              <Route path="/dashboard" exact element={<Home />} />
              <Route path="/income" exact element={<Income />} />
              <Route path="/expense" exact element={<Expense />} />
            </Routes>
          </Router>
        </div>
      </div>
      <Toaster
        toastOptions={{
          className:"",
          style:{
            fontsize:"13px"
          },
        }}
      />
    </UserProvider>
  )
}

export default App

const Root = () => {
  const isAuthenticated = !!localStorage.getItem("token");
   // Replace with your authentication logic
   return isAuthenticated ? (
    <Navigate to="/dashboard" />
  ) : (
    <Navigate to="/login" />
  );
}; 