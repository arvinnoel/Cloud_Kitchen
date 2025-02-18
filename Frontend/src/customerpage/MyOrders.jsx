import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("userauthToken");
  const apiUrl = import.meta.env.VITE_BACKEND_URL;

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
        toast.success("Orders fetched successfully!");
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to fetch orders.");
        setLoading(false);
        toast.error("Failed to fetch orders. Please try again.");
      }
    };

    fetchOrders();
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-red-500 font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-6">
        My Orders
      </h1>

      {orders.length === 0 ? (
        <p className="text-center text-xl text-gray-500">No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white shadow-lg rounded-lg">
            <thead className="bg-blue-600 text-white text-left">
              <tr>
                <th className="p-3">Order ID</th>
                <th className="p-3">Date</th>
                <th className="p-3">Items</th>
                <th className="p-3">Total Price</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b hover:bg-gray-100 transition duration-300"
                >
                  <td className="p-3 font-medium text-gray-700">
                    {order.orderId}
                  </td>
                  <td className="p-3 text-gray-600">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    {order.items.map((item, index) => (
                      <p key={index} className="text-gray-700">
                        {item.quantity} x {item.name} (₹{item.price})
                      </p>
                    ))}
                  </td>
                  <td className="p-3 font-semibold text-gray-900">
                    ₹{order.totalPrice}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-4 py-1 text-sm font-semibold rounded-full ${
                        order.status === "pending"
                          ? "bg-yellow-500 text-white"
                          : order.status === "accepted"
                          ? "bg-blue-500 text-white"
                          : order.status === "preparing"
                          ? "bg-orange-500 text-white"
                          : order.status === "out_for_delivery"
                          ? "bg-purple-500 text-white"
                          : order.status === "delivered"
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default MyOrders;
