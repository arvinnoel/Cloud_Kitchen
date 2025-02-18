import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
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
        setCart([]);
        setShowPopup(false); // Close the popup after successful order
        toast.success("Order placed successfully!");
      } else {
        setError(data.message || "Order placement failed.");
        toast.error("Failed to place order.");
      }
    } catch (error) {
      setError("Order placement failed.");
      toast.error("Order placement failed.");
    } finally {
      setPlacingOrder(false);
    }
  };

  const isAddressComplete = Object.values(address).every((field) => field.trim() !== "");

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-8 text-gray-800">Your Cart</h1>

        {loading && <p className="text-center text-gray-600">Loading cart...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && cart.length === 0 && (
          <p className="text-center text-gray-600 text-lg md:text-xl">Your cart is empty.</p>
        )}

        {!loading && !error && cart.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
            <ul className="space-y-4">
              {cart.map((item) => (
                <li key={item.productId || item._id} className="flex flex-col md:flex-row items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4 md:space-x-6">
                    <img src={item.imageFile} alt={item.name} className="w-16 h-16 md:w-24 md:h-24 rounded-lg" />
                    <div>
                      <h3 className="text-lg md:text-xl font-semibold text-gray-800">{item.name}</h3>
                      <p className="text-gray-600 text-sm md:text-base">Kitchen: {item.ownerId}</p> {/* Display owner ID here */}
                      <p className="text-gray-600 text-sm md:text-base">Price: ₹{item.price}</p>
                      <div className="flex items-center space-x-4">
                        <button
                          className="bg-gray-300 px-2 py-1 md:px-3 md:py-1 rounded-lg"
                          onClick={() => updateQuantity(item.productId, "decrement")}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <p className="text-gray-800 text-sm md:text-base">{item.quantity}</p>
                        <button
                          className="bg-gray-300 px-2 py-1 md:px-3 md:py-1 rounded-lg"
                          onClick={() => updateQuantity(item.productId, "increment")}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  <button className="text-red-600 font-semibold hover:text-red-800 mt-4 md:mt-0" onClick={() => removeFromCart(item.productId)}>
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-8 border-t pt-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg md:text-xl font-semibold text-gray-800">Total</h3>
                <p className="text-lg md:text-xl font-bold text-gray-800">
                  ₹{cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}
                </p>
              </div>
              <button
                className="w-full mt-6 bg-blue-600 text-white py-2 md:py-3 rounded-lg hover:bg-blue-700"
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
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg w-11/12 md:w-[450px]">
            <h2 className="text-lg md:text-xl font-semibold text-center mb-4">Confirm Order</h2>

            {/* Address Fields in Two Columns */}
            <div className="mt-4">
              <h3 className="text-md md:text-lg font-semibold mb-2">Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="p-2 border border-gray-300 rounded"
                  value={address.fullName}
                  onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Street"
                  className="p-2 border border-gray-300 rounded"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="City"
                  className="p-2 border border-gray-300 rounded"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="State"
                  className="p-2 border border-gray-300 rounded"
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Postal Code"
                  className="p-2 border border-gray-300 rounded"
                  value={address.postalCode}
                  onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Country"
                  className="p-2 border border-gray-300 rounded"
                  value={address.country}
                  onChange={(e) => setAddress({ ...address, country: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Phone"
                  className="p-2 border border-gray-300 rounded"
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                />
              </div>
            </div>

            {/* Payment Mode */}
            <div className="mt-4">
              <h3 className="text-md md:text-lg font-semibold mb-2">Payment Mode</h3>
              <select
                className="p-2 border border-gray-300 rounded w-full"
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
              >
                <option value="UPI">UPI</option>
                <option value="COD">Cash On Delivery</option>
              </select>
            </div>

            <div className="flex justify-between mt-6">
              <button
                className="text-gray-500 font-semibold hover:text-gray-800"
                onClick={() => setShowPopup(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white py-2 px-4 md:px-6 rounded-lg hover:bg-blue-700"
                onClick={placeOrder}
                disabled={placingOrder || !isAddressComplete}
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