import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../Authentication/AuthContext';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const userEmail = localStorage.getItem("userEmail"); // Assuming AuthContext provides userEmail
  const token = localStorage.getItem("authToken")
  useEffect(() => {
    // Fetch orders based on user email
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/api/orders?email=${userEmail}`,{
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        setOrders(response.data); // Set orders data from response
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    if (userEmail) {
      fetchOrders();
    }
  }, [userEmail]);

  if (!userEmail) {
    return <p>Please log in to view your orders.</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Your Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order.id} className="mb-4 p-4 bg-white shadow rounded">
              <h3 className="font-bold">Order ID: {order.id}</h3>
              <p>Date: {new Date(order.timestamp).toLocaleDateString()}</p>
              <p>Total Amount: ${order.totalAmount.toFixed(2)}</p>
              <p>Payment Type: {order.paymentType}</p>
              <h4 className="mt-2 font-semibold">Items:</h4>
              <ul>
                {console.log(orders)}
                {order.items.map((item, index) => (
                  <li key={index}>
                    {item.item_name}x{item.quantity}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Orders;
