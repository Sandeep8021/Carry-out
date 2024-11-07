import React, { useState } from 'react';
import { FaMinus } from 'react-icons/fa';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe outside the component to prevent reinitializing on every render
//const stripePromise = loadStripe("pk_test_51QHAhdCZEkuch1CLcd8R33GHuYg8TE9XzVog9YMDEMpy7HLfjTg2aQ2MR4af5lslldehTfFQWd3YrgXiG58uYSXQ00nGJVOP8U");

const Cart = ({ cartItems, onRemove, onCheckout }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [tipPercentage, setTipPercentage] = useState(0);
  const [instructions, setInstructions] = useState({});
  const [paymentOption, setPaymentOption] = useState(null);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = Object.values(cartItems).reduce((sum, item) => sum + item.item_price * item.quantity, 0);
  const tax = subtotal * 0.06;
  const serviceFee = subtotal * 0.01;
  const processingFee = (subtotal * 0.029) + 0.30;
  const tip = (tipPercentage / 100) * subtotal;
  const total = subtotal + tax + serviceFee + (paymentOption === 'payNow' ? processingFee : 0) + tip;

  const handleTipChange = (percentage) => {
    setTipPercentage(percentage);
  };

  const handleInstructionChange = (itemId, value) => {
    setInstructions({
      ...instructions,
      [itemId]: value,
    });
  };

  const handlePaymentOptionChange = (option) => {
    setPaymentOption(option);
  };
  const token = localStorage.getItem("authToken");
  const handleCheckoutClick = async () => {
    if (paymentOption) {
      if (paymentOption === 'payNow') {
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) return;
  
        setIsProcessing(true);
  
        try {
          // Fetch clientSecret from backend
          const response = await fetch('http://localhost:8081/api/payments/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ amount: total * 100, currency: 'usd' }), // Convert to cents
          });
  
          // Check if response is okay and parse JSON
          if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
          }
  
          const data = await response.json();
  
          if (!data.clientSecret) {
            throw new Error('Client secret not found in the response');
          }
  
          const { error, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
            payment_method: {
              card: cardElement,
            },
          });
  
          if (error) {
            setError(error.message);
          } else {
            onCheckout(total, paymentOption); // Trigger the checkout in the parent component
          }
        } catch (err) {
          console.error('Error in handleCheckoutClick:', err);
          setError(`Checkout failed: ${err.message}`);
        } finally {
          setIsProcessing(false);
        }
      } else {
        onCheckout(total, paymentOption); // For Pay Later option
      }
    } else {
      alert("Please select a payment option.");
    }
  };
  

  return (
    <Scrollbars style={{ height: '400px' }} className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Your Cart</h2>
      <div className="space-y-4 mb-4">
        {Object.keys(cartItems).length > 0 ? (
          <>
            {Object.values(cartItems).map((item) => (
              <div key={item.id} className="border-b pb-2 flex flex-col">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">{item.item_name}</h3>
                    <p className="text-gray-500">${item.item_price} x {item.quantity}</p>
                  </div>
                  <button onClick={() => onRemove(item.id)} className="text-red-500 hover:text-red-700">
                    <FaMinus />
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Add instructions..."
                  value={instructions[item.id] || ''}
                  onChange={(e) => handleInstructionChange(item.id, e.target.value)}
                  className="mt-2 border border-gray-300 rounded p-2 focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
            ))}
          </>
        ) : (
          <p className="text-gray-500">Your cart is empty.</p>
        )}
      </div>

      <div>
        <p className="text-lg font-bold">Subtotal: ${subtotal.toFixed(2)}</p>
        <p className="text-lg font-bold">Tax (6%): ${tax.toFixed(2)}</p>
        <p className="text-lg font-bold">Service Fee (1% Maintenance): ${serviceFee.toFixed(2)}</p>
        {paymentOption === 'payNow' && (
          <p className="text-lg font-bold">Processing Fee (2.9% + $0.30): ${processingFee.toFixed(2)}</p>
        )}
        <div className="mt-2">
          <label className="font-semibold">Tip:</label>
          <select onChange={(e) => handleTipChange(e.target.value)} className="border border-gray-300 rounded p-2 ml-2">
            <option value="0">None</option>
            <option value="10">10%</option>
            <option value="15">15%</option>
            <option value="20">20%</option>
          </select>
        </div>
        <p className="text-lg font-bold mt-2">Total: ${total.toFixed(2)}</p>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold">Payment Options:</h3>
        <label className="block mt-2">
          <input type="radio" name="payment" value="payNow" onChange={() => handlePaymentOptionChange('payNow')} />
          Pay Now
        </label>
        <label className="block mt-2">
          <input type="radio" name="payment" value="payLater" onChange={() => handlePaymentOptionChange('payLater')} />
          Pay Later
        </label>
      </div>

      {paymentOption === 'payNow' && (
        <div className="mt-4">
          <CardElement />
          {error && <div className="text-red-500">{error}</div>}
        </div>
      )}

      <button
        onClick={handleCheckoutClick}
        className={`mt-4 bg-blue-600 text-white rounded p-2 hover:bg-blue-700 transition duration-200 ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={isProcessing}
      >
        {isProcessing ? 'Processing...' : 'Checkout'}
      </button>
    </Scrollbars>
  );
};

export default Cart;
