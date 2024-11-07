import React from 'react';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login/login';
import { AuthProvider, useAuth } from './components/Authentication/AuthContext';
import ProtectedRoute from './components/Authentication/ProtectedRoute';
import RestaurantList from './components/Restaurants/RestaurantList';
import Signup from './Signup/signup';
import Menu from "./components/Menu/Menu";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Orders from './components/Orders/Orders';
function App() {
  const { isAuthenticated } = useAuth();

  const [cartItems, setCartItems] = useState([]);
  
  const addToCart = (item) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      if (existingItem) {
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevItems, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems((prevItems) =>
      prevItems.reduce((acc, item) => {
        if (item.id === itemId) {
          if (item.quantity > 1) {
            acc.push({ ...item, quantity: item.quantity - 1 });
          }
          return acc;
        }
        acc.push(item);
        return acc;
      }, [])
    );
  };

const stripePromise = loadStripe('pk_test_51QHAhdCZEkuch1CLcd8R33GHuYg8TE9XzVog9YMDEMpy7HLfjTg2aQ2MR4af5lslldehTfFQWd3YrgXiG58uYSXQ00nGJVOP8U');

  return (
    <Elements stripe={stripePromise}>
    <AuthProvider>
<Routes>
  <Route element={<ProtectedRoute />}>
    <Route path="/restaurants" element={<RestaurantList />} /> 
    <Route path="/orders" element={<Orders />} />
    <Route path="/restaurants/:restaurantId/menu" element={<Menu />} />
  </Route>
  <Route path="/" element={<Login />} />
  <Route path="/signup" element={<Signup />} />
</Routes>
</AuthProvider>
</Elements>
  )
};



export default App;