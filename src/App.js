import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Signup from './pages/Signup';
import Login from './pages/Login';
import { AuthProvider } from './components/AuthContext';
import Home from './pages/Home';
import ContactUs from './pages/ContactUs';
import Account from './pages/Account';
import AddProducts from './pages/AddProducts';
import ViewProducts from './pages/ViewProducts';
import ForgotPassword from './pages/ForgotPassword';
import { Toaster } from 'react-hot-toast';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import { CartProvider } from './components/CartContext';
import AboutUs from './pages/AboutUs';
import { UserRoute, AdminRoute } from './pages/ProtectedRoutes';
import Success from './pages/Success';
import OrderPage from './pages/OrderPage'
import AdminOrderPage from './pages/AdminOrderPage'
import UserList from './pages/UserList';
const App = () => {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Layout>
            <Toaster />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/" element={<UserRoute><Home /></UserRoute>} />
              <Route path="/ContactUs" element={<UserRoute><ContactUs /></UserRoute>} />
              <Route path="/Account" element={<UserRoute><Account /></UserRoute>} />
              <Route path="/shop" element={<UserRoute><Shop /></UserRoute>} />
              <Route path="/product/:productId" element={<UserRoute><ProductDetail /></UserRoute>} />
              <Route path="/cart" element={<UserRoute><Cart /></UserRoute>} />
              <Route path="/aboutus" element={<UserRoute><AboutUs /></UserRoute>} />
              <Route path="/addProduct" element={<AdminRoute><AddProducts /></AdminRoute>} />
              <Route path="/viewProducts" element={<AdminRoute><ViewProducts /></AdminRoute>} />
              <Route path="/success" element={<UserRoute><Success/></UserRoute>} />
              <Route path="/orderHistory" element={<UserRoute><OrderPage/></UserRoute>} />
              
              <Route path="/adminOrder" element={<AdminRoute><AdminOrderPage/></AdminRoute>} />
              <Route path="/adminUsers" element={<AdminRoute><UserList /></AdminRoute>} />

            </Routes>
          </Layout>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
