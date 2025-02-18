import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [kitchenName, setKitchenName] = useState("");
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_BACKEND_URL;

  const validTransitions = {
    pending: ["accepted", "canceled", "rejected"],
    accepted: ["preparing"],
    preparing: ["out_for_delivery", "canceled"],
    out_for_delivery: ["delivered", "canceled"],
    delivered: [],
    canceled: [],
    rejected: [],
  };

  const allStatuses = ["pending", "accepted", "preparing", "out_for_delivery", "delivered"];

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
          setOrders(response.data.orders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)));
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

  const handleOrderStatusUpdate = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("authToken")?.trim();
      if (!token) {
        toast.error("Please log in as an owner to update the order status.");
        return;
      }

      const response = await axios.put(`${apiUrl}/owner/updateorderstatus`, { orderId: String(orderId), status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.orderId === orderId ? { ...order, status: newStatus } : order
          )
        );
        toast.success(`Order status updated to '${newStatus}'`);
      } else {
        toast.error("Failed to update order status. Please try again.");
      }
    } catch (error) {
      toast.error(`Error updating order status: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-gray-800 text-center mb-6">
        Orders for <span className="text-blue-500">{kitchenName}</span>
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center text-lg">{error}</div>
      ) : (
        <div className="space-y-6">
          {orders.length > 0 ? (
            orders.map((order) => (
              <div key={order.orderId} className="border p-6 rounded-xl shadow-lg bg-white transition-transform transform hover:scale-105">
                <h3 className="text-2xl font-semibold text-gray-700">Order ID: {order.orderId}</h3>
                <p className="text-gray-600 mt-2">Total Amount: <span className="font-bold">₹{order.totalAmount}</span></p>
                <p className="text-gray-600">Order Date: <span className="font-bold">{new Date(order.orderDate).toLocaleString()}</span></p>

                <p className="mt-2 text-lg">
                  Status:{" "}
                  <span
                    className={`px-3 py-1 rounded-lg font-semibold ${
                      order.status === "accepted"
                        ? "bg-green-200 text-green-800"
                        : order.status === "canceled"
                        ? "bg-red-200 text-red-800"
                        : "bg-yellow-200 text-yellow-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </p>

                <div className="mt-4">
                  <label className="block text-gray-600 mb-2">Update Status:</label>
                  <select
                    className="w-full px-3 py-2 border rounded-lg shadow-md"
                    value={order.status}
                    onChange={(e) => handleOrderStatusUpdate(order.orderId, e.target.value)}
                  >
                    {allStatuses.map((statusOption) => (
                      <option
                        key={statusOption}
                        value={statusOption}
                        disabled={!validTransitions[order.status].includes(statusOption)}
                      >
                        {statusOption.replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 text-lg">No orders available</div>
          )}
        </div>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Orders;
