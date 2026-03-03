import React from 'react'
import { usePhoneNumberQuery } from './app/services/authApi';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/home/Home';
import Admin from './pages/admin/Admin';
import ProductDetail from './pages/productDetails/ProductDetails';
import Basket from './pages/items/Basket';
import Products from './pages/products/Products';
import PrivateRoute from './PrivateRoute';
// import { useGetProductsMutation } from './app/services/authApi';

import SeoRouter from "./ui/SeoRouter";

function App() {
  const phoneNumber = localStorage.getItem("pv_phone") || null;

  return (
    <BrowserRouter>
      <SeoRouter />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/adm"
          element={
            <PrivateRoute phone={phoneNumber}>
              <Admin />
            </PrivateRoute>
          }
        />
        <Route path="/details/:id" element={<ProductDetail />} />
        <Route
          path="/basket"
          element={
            <PrivateRoute phone={phoneNumber}>
              <Basket />
            </PrivateRoute>
          }
        />
        <Route path="/products" element={<Products />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App