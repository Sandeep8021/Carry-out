import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe('your-publishable-key');

const PaymentOptions = ({ total, onComplete }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handlePaymentSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (!error) {
      console.log('Payment Method:', paymentMethod);
      // Here you can call your backend to create a charge or payment intent
      onComplete();
    } else {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handlePaymentSubmit} className="p-4">
      <h2 className="text-xl font-semibold mb-4">Payment</h2>
      <p className="mb-2">Total: ${total.toFixed(2)}</p>
      <CardElement className="border p-2 rounded mb-4" />
      <button
        type="submit"
        className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition-colors"
        disabled={!stripe}
      >
        Pay Now
      </button>
    </form>
  );
};

export default PaymentOptions;
