import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [address, setAddress] = useState({
    fullName: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    phone: "",
  });
  const [paymentMode, setPaymentMode] = useState("UPI");

  const token = localStorage.getItem("userauthToken");
  const userId = localStorage.getItem("userId");
  const apiUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (!token) {
      setError("You need to log in first.");
      setLoading(false);
      return;
    }
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await fetch(`${apiUrl}/user/getcartitem`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (response.ok && Array.isArray(data.cart)) {
        setCart(data.cart);
      } else {
        setError(data.message || "Failed to fetch cart items.");
      }
    } catch (error) {
      setError("Failed to fetch cart.");
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const response = await fetch(`${apiUrl}/user/removecartitem`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });

      const data = await response.json();
      if (response.ok) {
        setCart(data.cart);
        toast.success("Item removed from cart successfully!");
      } else {
        toast.error("Error removing item from cart.");
      }
    } catch (error) {
      toast.error("Error removing item from cart.");
    }
  };

  const updateQuantity = async (productId, action) => {
    try {
      const response = await fetch(`${apiUrl}/user/updatecartquantity`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, action }),
      });

      const data = await response.json();
      if (response.ok) {
        setCart(data.cart);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to update quantity.");
    }
  };

  const placeOrder = async () => {
    setPlacingOrder(true);
    try {
      const response = await fetch(`${apiUrl}/user/checkout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cart,
          userId,
          address,
          paymentMode,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setOrderSuccess(true);
        setCart([]);
      } else {
        setError(data.message || "Order placement failed.");
      }
    } catch (error) {
      setError("Order placement failed.");
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Your Cart
        </h1>

        {loading && <p className="text-center text-gray-600">Loading cart...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && cart.length === 0 && (
          <p className="text-center text-gray-600 text-xl">
            Your cart is empty.
          </p>
        )}

        {!loading && !error && cart.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <ul className="space-y-4">
              {cart.map((item) => (
                <li
                  key={item.productId || item._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-6">
                    <img
                      src={item.imageFile}
                      alt={item.name}
                      className="w-24 h-24 rounded-lg"
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        {item.name}
                      </h3>
                      <p className="text-gray-600">
                        Kitchen: {item.kitchenName}
                      </p>
                      <p className="text-gray-600">Price: ₹{item.price}</p>
                      <div className="flex items-center space-x-4">
                        <button
                          className="bg-gray-300 px-3 py-1 rounded-lg"
                          onClick={() => updateQuantity(item.productId, "decrement")}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <p className="text-gray-800">{item.quantity}</p>
                        <button
                          className="bg-gray-300 px-3 py-1 rounded-lg"
                          onClick={() => updateQuantity(item.productId, "increment")}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    className="text-red-600 font-semibold hover:text-red-800"
                    onClick={() => removeFromCart(item.productId)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-8 border-t pt-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800">Total</h3>
                <p className="text-xl font-bold text-gray-800">
                  ₹
                  {cart
                    .reduce((total, item) => total + item.price * item.quantity, 0)
                    .toFixed(2)}
                </p>
              </div>
              <button
                className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
                onClick={() => setShowPopup(true)}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-semibold text-center mb-4">
              Confirm Order
            </h2>
            <p className="text-center text-gray-700">
              Are you sure you want to place this order?
            </p>

            <div className="mt-4">
              <h3 className="text-lg font-semibold">Address</h3>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full p-2 mt-2 border border-gray-300 rounded"
                value={address.fullName}
                onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
              />
              <input
                type="text"
                placeholder="Street Address"
                className="w-full p-2 mt-2 border border-gray-300 rounded"
                value={address.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })}
              />
              <input
                type="text"
                placeholder="City"
                className="w-full p-2 mt-2 border border-gray-300 rounded"
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
              />
              <input
                type="text"
                placeholder="State"
                className="w-full p-2 mt-2 border border-gray-300 rounded"
                value={address.state}
                onChange={(e) => setAddress({ ...address, state: e.target.value })}
              />
              <input
                type="text"
                placeholder="Postal Code"
                className="w-full p-2 mt-2 border border-gray-300 rounded"
                value={address.postalCode}
                onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
              />
              <input
                type="text"
                placeholder="Country"
                className="w-full p-2 mt-2 border border-gray-300 rounded"
                value={address.country}
                onChange={(e) => setAddress({ ...address, country: e.target.value })}
              />
              <input
                type="text"
                placeholder="Phone Number"
                className="w-full p-2 mt-2 border border-gray-300 rounded"
                value={address.phone}
                onChange={(e) => setAddress({ ...address, phone: e.target.value })}
              />
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-semibold">Payment Mode</h3>
              <select
                className="w-full p-2 mt-2 border border-gray-300 rounded"
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
              >
                <option value="UPI">UPI</option>
                <option value="COD">COD</option>
              </select>
            </div>

            <div className="mt-6 flex justify-between">
              <button
                className="bg-gray-500 text-white py-2 px-6 rounded-lg"
                onClick={() => setShowPopup(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white py-2 px-6 rounded-lg"
                onClick={placeOrder}
                disabled={placingOrder}
              >
                {placingOrder ? "Placing Order..." : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default Cart;
