import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

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
        toast.error(data.message || "Failed to fetch cart items.");
      }
    } catch (error) {
      setError("Failed to fetch cart.");
      toast.error("Failed to fetch cart.");
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
        toast.success("Item removed from cart successfully.");
      } else {
        toast.error(data.message || "Error removing item from cart.");
      }
    } catch (error) {
      toast.error("Error removing item from cart.");
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Your Cart </h1>
        {loading && <p className="text-center text-gray-600">Loading cart...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && !error && cart.length === 0 && (
          <p className="text-center text-gray-600 text-xl">Your cart is empty.</p>
        )}

        {!loading && !error && cart.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <ul className="space-y-4">
              {cart.map((item) => (
                <li key={item.productId || item._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-6">
                    <img src={item.imageFile} alt={item.name} className="w-24 h-24 rounded-lg" />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
                      <p className="text-gray-600">Kitchen: {item.kitchenName}</p>
                      <p className="text-gray-600">Price: ₹{item.price}</p>
                      <p className="text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                  <button className="text-red-600 font-semibold hover:text-red-800" onClick={() => removeFromCart(item.productId)}>Remove</button>
                </li>
              ))}
            </ul>
            <div className="mt-8 border-t pt-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800">Total</h3>
                <p className="text-xl font-bold text-gray-800">
                  ₹{cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}
                </p>
              </div>
              <button className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700" onClick={() => setShowPopup(true)}>
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Cart;
