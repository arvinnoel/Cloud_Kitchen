import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [kitchenName, setKitchenName] = useState("");
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("authToken")?.trim();
        if (!token) {
          setError("Please log in as an owner to see your orders.");
          setLoading(false);
          return;
        }

        const response = await axios.get(`${apiUrl}/owner/getownerorders`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.data.orders || response.data.orders.length === 0) {
          setError("No orders found.");
          setOrders([]);
        } else {
          // Group orders by orderId
          const groupedOrders = response.data.orders.reduce((acc, order) => {
            if (!acc[order.orderId]) {
              acc[order.orderId] = { ...order, items: [] };
            }
            acc[order.orderId].items.push(...order.items);
            return acc;
          }, {});

          setOrders(Object.values(groupedOrders).sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)));
        }

        setKitchenName(response.data.kitchenName || "No Kitchen Name");
        setError(null);
      } catch (error) {
        console.error("Error fetching orders:", error);
        if (error.response?.status === 401) {
          setError("Unauthorized access. Please log in again.");
          localStorage.removeItem("authToken");
          navigate("/owner/login");
        } else {
          setError("Failed to fetch orders. Please try again.");
        }
        toast.error(error.response?.data?.message || "Error fetching orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate, apiUrl]);

  const handleOrderStatusUpdate = async (orderId, status) => {
    console.log("Updating Order:", { orderId, status });
    try {
      const token = localStorage.getItem("authToken")?.trim();
      if (!token) {
        toast.error("Please log in as an owner to update the order status.");
        return;
      }

      const response = await axios.put(
        `${apiUrl}/owner/updateorderstatus`,
        { orderId: String(orderId), status: status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        console.log("Order Updated Successfully:", response.data);
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.orderId === orderId ? { ...order, status } : order
          )
        );

        // Display correct status message
        toast.success(`Order ${status} successfully`);
      } else {
        toast.error("Failed to update order status. Please try again.");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error(`Error updating order status: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-6">Orders for {kitchenName}</h1>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : (
        <div className="space-y-4">
          {orders.length > 0 ? (
            orders.map((order) => (
              <div key={order.orderId} className="border p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-bold">Order ID: {order.orderId}</h3>
                <p className="text-gray-500">Total Amount: ₹{order.totalAmount}</p>
                <p className="text-gray-500">
                  Order Date: {new Date(order.orderDate).toLocaleString()}
                </p>
                <p className="text-gray-500">
                  Status:{" "}
                  <span
                    className={`font-semibold ${order.status === "accepted" ? "text-green-600" : order.status === "canceled" ? "text-red-600" : "text-yellow-600"
                      }`}
                  >
                    {order.status}
                  </span>
                </p>

                {order.items.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold">Items:</h4>
                    <ul className="space-y-2">
                      {order.items.map((item, index) => (
                        <li key={index} className="flex justify-between">
                          <span>{item.name}</span>
                          <span>Qty: {item.quantity}</span>
                          <span>₹{item.price * item.quantity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-4 flex justify-between">
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
                    onClick={() => handleOrderStatusUpdate(order.orderId, "accepted")}
                    disabled={order.status === "accepted" || order.status === "canceled"}
                  >
                    Accept
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50"
                    onClick={() => handleOrderStatusUpdate(order.orderId, "canceled")}
                    disabled={order.status === "accepted" || order.status === "canceled"}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">No orders available</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Orders;
