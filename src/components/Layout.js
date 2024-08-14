import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import '../css/Layout.css';
import { useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login' || location.pathname === '/signup';
  return (
    <div className="layout">
      <Navbar />
        {children}
      <Footer />
    </div>
  );
};

export default Layout;
