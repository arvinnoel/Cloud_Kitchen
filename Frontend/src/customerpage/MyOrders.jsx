import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem("userauthToken");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${apiUrl}/user/userorders`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const sortedOrders = response.data.orders
          .slice()
          .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

        setOrders(sortedOrders);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to fetch orders.');
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  if (loading) {
    return <div className="text-center text-xl">Loading orders...</div>;
  }

  if (error) {
    return <div className="text-center text-xl text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-center text-xl text-gray-500">No orders found.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-2">Order #{order.orderId}</h2>
              <p className="text-sm text-gray-500">Date: {new Date(order.orderDate).toLocaleDateString()}</p>

              <div className="mt-4">
                <h3 className="font-semibold">Items:</h3>
                <ul className="space-y-2 mt-2">
                  {order.items.map((item, index) => (
                    <li key={index} className="flex justify-between">
                      <span>{item.name}</span>
                      <span>{item.quantity} x ₹{item.price}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <span className="font-semibold text-lg">Total: ₹{order.totalPrice}</span>
                <span
                  className={`px-3 py-1 text-sm rounded-full ${order.status === 'success'
                      ? 'bg-green-500 text-white'
                      : 'bg-red-500 text-white'
                    }`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
