import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const getStatusStyles = (status) => {
  const baseStyles = "px-4 py-1 text-sm font-semibold rounded-full";
  switch (status) {
    case "pending":
      return `${baseStyles} bg-yellow-500 text-white`;
    case "accepted":
      return `${baseStyles} bg-blue-500 text-white`;
    case "preparing":
      return `${baseStyles} bg-orange-500 text-white`;
    case "out_for_delivery":
      return `${baseStyles} bg-purple-500 text-white`;
    case "delivered":
      return `${baseStyles} bg-green-500 text-white`;
    default:
      return `${baseStyles} bg-red-500 text-white`;
  }
};

const formatPrice = (price) =>
  `₹${parseFloat(price).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

const OrderTableRow = ({ order }) => (
  <tr className="border-b hover:bg-gray-50 transition duration-300">
    <td className="p-4 font-medium text-gray-700">{order.orderId}</td>
    <td className="p-4 text-gray-600">
      {new Date(order.orderDate).toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })}
    </td>
    <td className="p-4">
      {order.items.map((item, index) => (
        <p key={index} className="text-gray-700">
          {item.quantity} × {item.name} ({formatPrice(item.price)})
        </p>
      ))}
    </td>
    <td className="p-4 font-semibold text-gray-900">
      {formatPrice(order.totalPrice)}
    </td>
    <td className="p-4">
      <span className={getStatusStyles(order.status)}>
        {order.status.replace(/_/g, " ")}
      </span>
    </td>
  </tr>
);

const OrderCard = ({ order }) => (
  <div className="bg-white p-4 rounded-lg shadow-md border space-y-3">
    <p className="text-gray-700 font-semibold">
      <span className="text-gray-500">Order ID:</span> {order.orderId}
    </p>
    <p className="text-gray-700">
      <span className="text-gray-500">Date:</span>{" "}
      {new Date(order.orderDate).toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })}
    </p>
    <div>
      <p className="text-gray-700 font-semibold mb-2">Items Ordered:</p>
      <ul className="space-y-2">
        {order.items.map((item, index) => (
          <li key={index} className="flex justify-between">
            <span>
              {item.quantity} × {item.name}
            </span>
            <span>{formatPrice(item.price)}</span>
          </li>
        ))}
      </ul>
    </div>
    <p className="text-gray-900 font-bold pt-2 border-t">
      <span className="text-gray-500">Total:</span>{" "}
      {formatPrice(order.totalPrice)}
    </p>
    <div className="pt-2">
      <span className={getStatusStyles(order.status)}>
        {order.status.replace(/_/g, " ")}
      </span>
    </div>
  </div>
);

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("userauthToken");
  const apiUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const source = axios.CancelToken.source();

    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${apiUrl}/user/userorders`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          cancelToken: source.token,
        });

        const sortedOrders = response.data.orders.sort(
          (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
        );

        setOrders(sortedOrders);
        setLoading(false);
      } catch (error) {
        if (!axios.isCancel(error)) {
          const errorMessage = error.response?.data?.message ||
            "Failed to fetch orders. Please try again.";
          setError(errorMessage);
          setLoading(false);
          toast.error(errorMessage);
        }
      }
    };

    fetchOrders();
    return () => source.cancel("Component unmounted, request canceled");
  }, [token, apiUrl]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen" aria-live="polite">
        <div
          className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"
          role="status"
        >
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen" aria-live="assertive">
        <p className="text-xl text-red-500 font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <h1 className="text-3xl md:text-4xl font-extrabold text-center text-gray-800 mb-8">
        My Orders
      </h1>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500 mb-4">
            You haven't placed any orders yet.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto rounded-lg shadow">
            <table className="w-full border-collapse bg-white">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="p-4 text-left">Order ID</th>
                  <th className="p-4 text-left">Date & Time</th>
                  <th className="p-4 text-left">Items</th>
                  <th className="p-4 text-left">Total</th>
                  <th className="p-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <OrderTableRow key={order._id} order={order} />
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-6">
            {orders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        </div>
      )}

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        toastClassName="shadow-lg"
      />
    </div>
  );
};

export default MyOrders;