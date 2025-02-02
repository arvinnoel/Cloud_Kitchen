import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify"; // Ensure react-toastify is installed

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [kitchenName, setKitchenName] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);

      try {
        const token = localStorage.getItem("authToken")?.trim();

        if (!token) {
          console.error("No owner auth token found.");
          setError("Please log in as an owner to see your orders.");
          setLoading(false);
          return;
        }

        const response = await axios.get("http://localhost:5000/owner/getownerorders", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.data.orders || response.data.orders.length === 0) {
          setError("No orders found.");
          setOrders([]);
        } else {
          const sortedOrders = response.data.orders.sort(
            (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
          );
          setOrders(sortedOrders);
        }

        setKitchenName(response.data.kitchenName || "No Kitchen Name");
        setError(null);
      } catch (error) {
        console.error("Error fetching orders:", error);

        if (error.response?.status === 401) {
          setError("Unauthorized access. Please log in again as an owner.");
          localStorage.removeItem("authToken");
          window.location.href = "/owner/login";
        } else {
          setError("Failed to fetch orders. Please try again.");
        }

        toast.error("Error fetching orders: " + (error.response?.data?.message || error.message));
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleOrderStatusUpdate = async (orderId, status) => {
    try {
      const token = localStorage.getItem("authToken")?.trim();
      if (!token) {
        toast.error("Please log in as an owner to update the order status.");
        return;
      }

      const response = await axios.put(
        "http://localhost:5000/owner/updateorderstatus",
        {
          orderId,
          status, // "success" or "canceled"
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,  // Ensure token is correctly added here
            "Content-Type": "application/json",
          },
        }
      );


      // Update orders locally
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderId === orderId ? { ...order, status } : order  // Update by orderId
        )
      );

      toast.success(`Order ${status === "success" ? "accepted" : "rejected"} successfully`);
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Error updating order status. Please try again.");
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
              <div key={order._id} className="border p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-bold">Order ID: {order.orderId}</h3> {/* Use orderId here */}
                <p className="text-gray-500">Total Amount: ₹{order.totalAmount}</p>
                <p className="text-gray-500">Order Date: {new Date(order.orderDate).toLocaleString()}</p>
                <p className="text-gray-500">Status: {order.status}</p>

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

                <div className="mt-4 flex justify-between">
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded"
                    onClick={() => handleOrderStatusUpdate(order.orderId, "success")} // Use orderId here as well
                    disabled={order.status !== "pending"} // Disable if already processed
                  >
                    Accept
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded"
                    onClick={() => handleOrderStatusUpdate(order.orderId, "canceled")} // Use orderId here as well
                    disabled={order.status !== "pending"} // Disable if already processed
                  >
                    Reject
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
