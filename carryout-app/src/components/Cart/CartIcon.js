import React, { useState } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import Cart from './Cart'; // Import the Cart component

const CartIcon = ({ cartItems, removeFromCart }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleCartClick = () => {
    setIsCartOpen((prev) => !prev);
  };

  return (
    <div className="relative cursor-pointer">
      <div onClick={handleCartClick} className="flex items-center">
        <FaShoppingCart className="text-2xl" />
        {totalItems > 0 && (
          <span className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full px-1">
            {totalItems}
          </span>
        )}
      </div>
      {isCartOpen && (
        <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <Cart cartItems={cartItems} removeFromCart={removeFromCart} />
        </div>
      )}
    </div>
  );
};

export default CartIcon;
